from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class RiskQuestion:
    id: int
    question: str
    options: List[Dict[str, Any]]

@dataclass
class RiskProfile:
    name: str
    score_range: tuple
    description: str
    asset_allocation: Dict[str, float]
    characteristics: List[str]

class RiskProfiler:
    def __init__(self):
        self.questions = self._initialize_questions()
        self.risk_profiles = self._initialize_risk_profiles()
    
    def _initialize_questions(self) -> List[RiskQuestion]:
        """Initialize risk assessment questions"""
        return [
            RiskQuestion(
                id=1,
                question="What is your investment time horizon?",
                options=[
                    {"value": "1", "label": "Less than 2 years", "score": 1},
                    {"value": "2", "label": "2-5 years", "score": 2},
                    {"value": "3", "label": "5-10 years", "score": 3},
                    {"value": "4", "label": "More than 10 years", "score": 4},
                ]
            ),
            RiskQuestion(
                id=2,
                question="How would you react to a 20% portfolio decline?",
                options=[
                    {"value": "1", "label": "Sell everything immediately", "score": 1},
                    {"value": "2", "label": "Sell some positions", "score": 2},
                    {"value": "3", "label": "Hold and wait for recovery", "score": 3},
                    {"value": "4", "label": "Buy more at lower prices", "score": 4},
                ]
            ),
            RiskQuestion(
                id=3,
                question="What percentage of your total wealth are you investing?",
                options=[
                    {"value": "1", "label": "More than 75%", "score": 1},
                    {"value": "2", "label": "50-75%", "score": 2},
                    {"value": "3", "label": "25-50%", "score": 3},
                    {"value": "4", "label": "Less than 25%", "score": 4},
                ]
            ),
            RiskQuestion(
                id=4,
                question="What is your primary investment goal?",
                options=[
                    {"value": "1", "label": "Capital preservation", "score": 1},
                    {"value": "2", "label": "Income generation", "score": 2},
                    {"value": "3", "label": "Balanced growth", "score": 3},
                    {"value": "4", "label": "Maximum growth", "score": 4},
                ]
            ),
            RiskQuestion(
                id=5,
                question="How familiar are you with investing?",
                options=[
                    {"value": "1", "label": "Complete beginner", "score": 1},
                    {"value": "2", "label": "Some knowledge", "score": 2},
                    {"value": "3", "label": "Experienced investor", "score": 3},
                    {"value": "4", "label": "Professional/Expert", "score": 4},
                ]
            ),
            RiskQuestion(
                id=6,
                question="Which statement best describes your income?",
                options=[
                    {"value": "1", "label": "Unstable, need access to funds", "score": 1},
                    {"value": "2", "label": "Stable, but limited savings", "score": 2},
                    {"value": "3", "label": "Stable with good savings", "score": 3},
                    {"value": "4", "label": "High income with substantial savings", "score": 4},
                ]
            ),
        ]
    
    def _initialize_risk_profiles(self) -> Dict[str, RiskProfile]:
        """Initialize risk profile definitions"""
        return {
            "conservative": RiskProfile(
                name="Conservative",
                score_range=(6, 12),
                description="Focus on capital preservation with minimal volatility",
                asset_allocation={
                    "stock": 30,
                    "bond": 60,
                    "crypto": 0,
                    "cash": 10
                },
                characteristics=[
                    "Low risk tolerance",
                    "Capital preservation focused",
                    "Stable income preference",
                    "Short to medium time horizon"
                ]
            ),
            "moderate": RiskProfile(
                name="Moderate",
                score_range=(13, 18),
                description="Balanced approach seeking steady growth with moderate risk",
                asset_allocation={
                    "stock": 60,
                    "bond": 30,
                    "crypto": 5,
                    "cash": 5
                },
                characteristics=[
                    "Moderate risk tolerance",
                    "Balanced growth objective",
                    "Medium to long time horizon",
                    "Diversified approach"
                ]
            ),
            "aggressive": RiskProfile(
                name="Aggressive",
                score_range=(19, 24),
                description="Growth-focused with higher risk tolerance for maximum returns",
                asset_allocation={
                    "stock": 80,
                    "bond": 10,
                    "crypto": 8,
                    "cash": 2
                },
                characteristics=[
                    "High risk tolerance",
                    "Growth maximization focus",
                    "Long time horizon",
                    "Comfortable with volatility"
                ]
            )
        }
    
    def calculate_risk_score(self, answers: Dict[int, str]) -> int:
        """Calculate total risk score from answers"""
        total_score = 0
        
        for question in self.questions:
            answer_value = answers.get(question.id)
            if answer_value:
                # Find the score for this answer
                for option in question.options:
                    if option["value"] == answer_value:
                        total_score += option["score"]
                        break
        
        return total_score
    
    def determine_risk_profile(self, answers: Dict[int, str]) -> RiskProfile:
        """Determine risk profile based on answers"""
        total_score = self.calculate_risk_score(answers)
        
        for profile in self.risk_profiles.values():
            if profile.score_range[0] <= total_score <= profile.score_range[1]:
                return profile
        
        # Default to moderate if no match
        return self.risk_profiles["moderate"]
    
    def get_personalized_recommendations(self, risk_profile: RiskProfile) -> Dict[str, Any]:
        """Get personalized investment recommendations"""
        recommendations = {
            "asset_allocation": risk_profile.asset_allocation,
            "investment_strategy": self._get_investment_strategy(risk_profile),
            "rebalancing_frequency": self._get_rebalancing_frequency(risk_profile),
            "key_considerations": self._get_key_considerations(risk_profile)
        }
        
        return recommendations
    
    def _get_investment_strategy(self, profile: RiskProfile) -> List[str]:
        """Get investment strategy recommendations"""
        strategies = {
            "Conservative": [
                "Focus on high-grade bonds and dividend-paying stocks",
                "Maintain significant cash reserves for stability",
                "Avoid volatile assets like crypto and growth stocks",
                "Consider Treasury Inflation-Protected Securities (TIPS)"
            ],
            "Moderate": [
                "Diversify across asset classes and geographies",
                "Include both growth and value stocks",
                "Maintain moderate bond allocation for stability",
                "Small crypto allocation for growth potential"
            ],
            "Aggressive": [
                "Emphasize growth stocks and emerging markets",
                "Higher allocation to technology and innovation sectors",
                "Include alternative investments like crypto",
                "Minimize cash and low-yield bonds"
            ]
        }
        
        return strategies.get(profile.name, strategies["Moderate"])
    
    def _get_rebalancing_frequency(self, profile: RiskProfile) -> str:
        """Get recommended rebalancing frequency"""
        frequencies = {
            "Conservative": "Quarterly - to maintain stability",
            "Moderate": "Semi-annually - balanced approach",
            "Aggressive": "Annually - let winners run"
        }
        
        return frequencies.get(profile.name, frequencies["Moderate"])
    
    def _get_key_considerations(self, profile: RiskProfile) -> List[str]:
        """Get key considerations for the risk profile"""
        considerations = {
            "Conservative": [
                "Monitor interest rate changes affecting bond values",
                "Ensure adequate emergency fund outside investments",
                "Consider inflation impact on fixed-income investments",
                "Review allocation if time horizon changes"
            ],
            "Moderate": [
                "Regularly review and rebalance portfolio",
                "Stay disciplined during market volatility",
                "Consider tax-efficient investment vehicles",
                "Monitor correlation between asset classes"
            ],
            "Aggressive": [
                "Be prepared for significant short-term volatility",
                "Don't panic during market downturns",
                "Consider dollar-cost averaging for new investments",
                "Monitor concentration risk in growth sectors"
            ]
        }
        
        return considerations.get(profile.name, considerations["Moderate"])

if __name__ == "__main__":
    # Test the risk profiler
    profiler = RiskProfiler()
    
    # Sample answers (moderate risk profile)
    sample_answers = {
        1: "3",  # 5-10 years
        2: "3",  # Hold and wait
        3: "3",  # 25-50% of wealth
        4: "3",  # Balanced growth
        5: "2",  # Some knowledge
        6: "3"   # Stable with good savings
    }
    
    risk_profile = profiler.determine_risk_profile(sample_answers)
    recommendations = profiler.get_personalized_recommendations(risk_profile)
    
    print(f"Risk Profile: {risk_profile.name}")
    print(f"Description: {risk_profile.description}")
    print(f"Asset Allocation: {risk_profile.asset_allocation}")
    print(f"Investment Strategy: {recommendations['investment_strategy']}")
    print(f"Rebalancing: {recommendations['rebalancing_frequency']}")
