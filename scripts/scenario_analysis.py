import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt
from portfolio_manager import PortfolioManager

class ScenarioAnalyzer:
    def __init__(self):
        self.portfolio_manager = PortfolioManager()
        
    def monte_carlo_simulation(self, num_simulations: int = 1000, time_horizon: int = 252) -> Dict:
        """Run Monte Carlo simulation for portfolio returns"""
        portfolio_data = self.portfolio_manager.to_dict()
        
        # Asset expected returns and volatilities (simplified)
        asset_returns = {
            'stock': {'return': 0.10, 'volatility': 0.16},
            'bond': {'return': 0.04, 'volatility': 0.05},
            'crypto': {'return': 0.15, 'volatility': 0.60},
            'cash': {'return': 0.02, 'volatility': 0.01}
        }
        
        # Portfolio weights
        weights = portfolio_data['asset_allocation']
        total_weight = sum(weights.values())
        normalized_weights = {k: v/total_weight for k, v in weights.items()}
        
        # Calculate portfolio expected return and volatility
        portfolio_return = sum(normalized_weights[asset] * asset_returns[asset]['return'] 
                             for asset in normalized_weights)
        
        portfolio_volatility = np.sqrt(sum((normalized_weights[asset] * asset_returns[asset]['volatility'])**2 
                                         for asset in normalized_weights))
        
        # Run simulations
        initial_value = portfolio_data['total_value']
        simulations = []
        
        for _ in range(num_simulations):
            daily_returns = np.random.normal(
                portfolio_return / 252,  # Daily return
                portfolio_volatility / np.sqrt(252),  # Daily volatility
                time_horizon
            )
            
            # Calculate cumulative portfolio value
            portfolio_values = [initial_value]
            for daily_return in daily_returns:
                new_value = portfolio_values[-1] * (1 + daily_return)
                portfolio_values.append(new_value)
            
            simulations.append(portfolio_values)
        
        # Calculate statistics
        final_values = [sim[-1] for sim in simulations]
        
        return {
            'simulations': simulations,
            'final_values': final_values,
            'statistics': {
                'mean_final_value': np.mean(final_values),
                'median_final_value': np.median(final_values),
                'std_final_value': np.std(final_values),
                'percentile_5': np.percentile(final_values, 5),
                'percentile_95': np.percentile(final_values, 95),
                'probability_of_loss': sum(1 for val in final_values if val < initial_value) / len(final_values),
                'expected_return': (np.mean(final_values) - initial_value) / initial_value,
                'initial_value': initial_value
            }
        }
    
    def interest_rate_scenarios(self) -> Dict:
        """Analyze portfolio under different interest rate scenarios"""
        portfolio_data = self.portfolio_manager.to_dict()
        initial_value = portfolio_data['total_value']
        
        scenarios = {
            'rate_cut': {'rate_change': -2.0, 'name': 'Rate Cut (-2%)'},
            'current': {'rate_change': 0.0, 'name': 'Current Rates'},
            'rate_hike': {'rate_change': 2.0, 'name': 'Rate Hike (+2%)'}
        }
        
        # Impact factors for different asset classes
        rate_sensitivity = {
            'stock': -0.5,  # Stocks benefit from lower rates
            'bond': -2.0,   # Bonds are very sensitive to rates
            'crypto': -1.0, # Crypto benefits from lower rates
            'cash': 1.0     # Cash benefits from higher rates
        }
        
        scenario_results = {}
        
        for scenario_key, scenario in scenarios.items():
            rate_change = scenario['rate_change']
            portfolio_impact = 0
            
            # Calculate impact on each asset class
            for asset_type, allocation in portfolio_data['asset_allocation'].items():
                if asset_type in rate_sensitivity:
                    # Impact = rate_change * sensitivity * allocation_weight
                    impact = rate_change * rate_sensitivity[asset_type] * (allocation / 100)
                    portfolio_impact += impact
            
            # Generate 12-month projection
            months = list(range(1, 13))
            monthly_values = []
            
            for month in months:
                # Gradual impact over time with some randomness
                time_factor = month / 12
                random_factor = np.random.normal(0, 0.02)  # 2% monthly volatility
                
                monthly_return = (portfolio_impact * time_factor + random_factor) / 100
                monthly_value = initial_value * (1 + monthly_return)
                monthly_values.append(monthly_value)
            
            scenario_results[scenario_key] = {
                'name': scenario['name'],
                'rate_change': rate_change,
                'portfolio_impact': portfolio_impact,
                'monthly_values': monthly_values,
                'final_value': monthly_values[-1],
                'total_return': (monthly_values[-1] - initial_value) / initial_value * 100
            }
        
        return scenario_results
    
    def risk_analysis(self) -> Dict:
        """Comprehensive risk analysis of the portfolio"""
        portfolio_data = self.portfolio_manager.to_dict()
        
        # Value at Risk (VaR) calculation
        monte_carlo_results = self.monte_carlo_simulation(num_simulations=10000, time_horizon=21)  # 1 month
        final_values = monte_carlo_results['final_values']
        initial_value = portfolio_data['total_value']
        
        # Calculate VaR at different confidence levels
        var_95 = initial_value - np.percentile(final_values, 5)
        var_99 = initial_value - np.percentile(final_values, 1)
        
        # Expected Shortfall (Conditional VaR)
        var_95_threshold = np.percentile(final_values, 5)
        expected_shortfall = initial_value - np.mean([val for val in final_values if val <= var_95_threshold])
        
        # Maximum Drawdown estimation
        max_drawdown = 0
        for simulation in monte_carlo_results['simulations'][:100]:  # Sample 100 simulations
            peak = simulation[0]
            for value in simulation:
                if value > peak:
                    peak = value
                drawdown = (peak - value) / peak
                if drawdown > max_drawdown:
                    max_drawdown = drawdown
        
        return {
            'value_at_risk': {
                'var_95': var_95,
                'var_99': var_99,
                'var_95_percent': (var_95 / initial_value) * 100,
                'var_99_percent': (var_99 / initial_value) * 100
            },
            'expected_shortfall': expected_shortfall,
            'expected_shortfall_percent': (expected_shortfall / initial_value) * 100,
            'max_drawdown_estimate': max_drawdown * 100,
            'portfolio_volatility': portfolio_data['metrics']['portfolio_volatility'],
            'sharpe_ratio': portfolio_data['metrics']['sharpe_ratio']
        }

if __name__ == "__main__":
    analyzer = ScenarioAnalyzer()
    
    print("=== Monte Carlo Simulation ===")
    mc_results = analyzer.monte_carlo_simulation(num_simulations=1000)
    stats = mc_results['statistics']
    print(f"Expected Final Value: ${stats['mean_final_value']:,.2f}")
    print(f"5th Percentile: ${stats['percentile_5']:,.2f}")
    print(f"95th Percentile: ${stats['percentile_95']:,.2f}")
    print(f"Probability of Loss: {stats['probability_of_loss']:.2%}")
    
    print("\n=== Interest Rate Scenarios ===")
    rate_scenarios = analyzer.interest_rate_scenarios()
    for scenario_key, scenario in rate_scenarios.items():
        print(f"{scenario['name']}: Final Value ${scenario['final_value']:,.2f} "
              f"({scenario['total_return']:+.1f}%)")
    
    print("\n=== Risk Analysis ===")
    risk_analysis = analyzer.risk_analysis()
    print(f"VaR (95%): ${risk_analysis['value_at_risk']['var_95']:,.2f} "
          f"({risk_analysis['value_at_risk']['var_95_percent']:.1f}%)")
    print(f"Expected Shortfall: ${risk_analysis['expected_shortfall']:,.2f} "
          f"({risk_analysis['expected_shortfall_percent']:.1f}%)")
    print(f"Max Drawdown Estimate: {risk_analysis['max_drawdown_estimate']:.1f}%")
