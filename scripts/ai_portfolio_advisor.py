import os
import json
from typing import Dict, List, Any
import requests
from portfolio_manager import PortfolioManager

class AIPortfolioAdvisor:
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        self.base_url = "https://api.groq.com/openai/v1"
        self.portfolio_manager = PortfolioManager()
        
    def _make_groq_request(self, messages: List[Dict], max_tokens: int = 1000) -> str:
        """Make a request to Groq API"""
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-70b-versatile",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(f"{self.base_url}/chat/completions", 
                                   headers=headers, json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error getting AI response: {str(e)}"
    
    def get_portfolio_analysis(self, analysis_type: str = "general") -> str:
        """Get AI analysis of the current portfolio"""
        portfolio_data = self.portfolio_manager.to_dict()
        
        system_prompt = """You are an expert AI Portfolio Manager for QuantAlpha. 
        You analyze portfolios and provide actionable investment advice based on:
        - Modern Portfolio Theory
        - Risk management principles
        - Market conditions and trends
        - Asset allocation best practices
        
        Provide concise, professional advice with specific recommendations."""
        
        user_prompt = f"""
        Analyze this portfolio:
        
        Total Value: ${portfolio_data['total_value']:,.2f}
        Asset Allocation: {portfolio_data['asset_allocation']}
        Geographic Allocation: {portfolio_data['geographic_allocation']}
        Risk Profile: {portfolio_data['risk_profile']}
        
        Portfolio Metrics:
        - Portfolio Return: {portfolio_data['metrics']['portfolio_return']:.2f}%
        - Volatility: {portfolio_data['metrics']['portfolio_volatility']:.2f}%
        - Sharpe Ratio: {portfolio_data['metrics']['sharpe_ratio']:.2f}
        
        Analysis Type: {analysis_type}
        
        Provide specific recommendations for optimization.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return self._make_groq_request(messages)
    
    def get_rebalancing_advice(self, target_allocation: Dict[str, float]) -> str:
        """Get AI advice on portfolio rebalancing"""
        rebalancing_data = self.portfolio_manager.rebalance_portfolio(target_allocation)
        
        system_prompt = """You are an AI Portfolio Manager. Analyze rebalancing recommendations 
        and provide clear, actionable advice on portfolio adjustments."""
        
        user_prompt = f"""
        Rebalancing Analysis:
        {json.dumps(rebalancing_data, indent=2)}
        
        Provide specific advice on:
        1. Whether rebalancing is recommended
        2. Which assets to buy/sell
        3. Timing considerations
        4. Risk implications
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return self._make_groq_request(messages)
    
    def get_market_outlook(self) -> str:
        """Get AI market outlook and portfolio implications"""
        portfolio_data = self.portfolio_manager.to_dict()
        
        system_prompt = """You are an AI Portfolio Manager with expertise in market analysis. 
        Provide market outlook and specific implications for the given portfolio."""
        
        user_prompt = f"""
        Current Portfolio Exposure:
        - Stocks: {portfolio_data['asset_allocation']['stock']}%
        - Bonds: {portfolio_data['asset_allocation']['bond']}%
        - Crypto: {portfolio_data['asset_allocation']['crypto']}%
        - Cash: {portfolio_data['asset_allocation']['cash']}%
        
        Geographic Exposure:
        - US: {portfolio_data['geographic_allocation']['US']}%
        - Developed Markets: {portfolio_data['geographic_allocation']['Developed']}%
        - Emerging Markets: {portfolio_data['geographic_allocation']['Emerging']}%
        
        Provide:
        1. Current market outlook
        2. Risks and opportunities
        3. Portfolio-specific recommendations
        4. Sector/geographic adjustments if needed
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return self._make_groq_request(messages)
    
    def chat_with_advisor(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """Interactive chat with AI portfolio advisor"""
        portfolio_data = self.portfolio_manager.to_dict()
        
        system_prompt = f"""You are an AI Portfolio Manager for QuantAlpha. 
        
        Current Portfolio Context:
        - Total Value: ${portfolio_data['total_value']:,.2f}
        - Asset Mix: {portfolio_data['asset_allocation']}
        - Geographic Mix: {portfolio_data['geographic_allocation']}
        - Risk Profile: {portfolio_data['risk_profile']}
        
        Provide helpful, specific advice about portfolio management, investments, and market conditions.
        Keep responses concise but informative."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        messages.append({"role": "user", "content": user_message})
        
        return self._make_groq_request(messages)

if __name__ == "__main__":
    # Test the AI advisor
    advisor = AIPortfolioAdvisor()
    
    print("=== Portfolio Analysis ===")
    analysis = advisor.get_portfolio_analysis("general")
    print(analysis)
    
    print("\n=== Market Outlook ===")
    outlook = advisor.get_market_outlook()
    print(outlook)
    
    print("\n=== Chat Test ===")
    response = advisor.chat_with_advisor("Should I increase my crypto allocation?")
    print(response)
