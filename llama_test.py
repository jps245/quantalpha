# -*- coding: utf-8 -*-
"""
Created on Mon Jul  7 00:17:38 2025

@author: jps24
"""
from dataclasses import dataclass
import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="groq",
    api_key="",
)

SYSTEM_PROMPT = """
    You are a financial advisor.
    Your job is to determine whether the user needs to change 
        his asset allocations based on the context of the discussion. 
    
    If necessary, your recommendations on asset allocations should
        only be in terms of the following segments:
    
        1.  Should he change his allocation among the following asset classes - Stocks, Bonds, Crypto, and Cash?
        2.  Should he change his allocation among the following markets - US, Developed, and Emerging Markets?
        3.  And, is there any specific news that would cause you to recommend increase or reducing his allocation in the current assets he holds?
        
    If you do make any recommendations, be sure to give a rough estimate of the change in allocation.
    In your answer, only provide the asset class, market, or asset, and the estimate of the allocation change.

    Please provide a numbered list of the recommendations.  Here are some examples:
        
        1.  For asset class: ("Bonds", 10%)
        2.  For market: ("Emerging", -10%)
        3.  For specific asset class: ("AAPL", 5%)
            
    If recommending an asset class or market in which the user does not
        have anything currently allocated, suggest a specific asset they
        might want to include.
        
    Please finish the answer with the new asset class allocations you recommend
        for the portfolio and begin this section with "target allocations".  Only
        show the new allocations for the asset classes.  For example:
        
    target allocations: {stocks:60%, bonds:20%, crypto:10%, cash:10%}            
   
         
"""

headlines = [
    "Stock markets rally after strong earnings reports.",
    "New regulations may impact the tech sector.",
    "Oil prices fluctuate amid global tensions."
]

@dataclass
class Asset:
    symbol: str
    name: str
    asset_type: str  # 'stock', 'bond', 'crypto', 'cash'
    region: str  # 'US', 'Developed', 'Emerging'
    allocation: float
    value: float
    current_price: float
    change_percent: float

assets = [
    Asset("AAPL", "Apple Inc.", "stock", "US", 15.0, 18862.58, 185.50, 1.8),
    Asset("MSFT", "Microsoft Corp.", "stock", "US", 12.0, 15090.06, 380.25, 2.4),
    Asset("GOOGL", "Alphabet Inc.", "stock", "US", 8.0, 10060.04, 142.30, -0.8),
    Asset("BTC", "Bitcoin", "crypto", "Global", 5.0, 6287.53, 45200.00, 12.1),
    Asset("TLT", "20+ Year Treasury Bond ETF", "bond", "US", 15.0, 18862.58, 95.40, -0.3),
    Asset("VEA", "Developed Markets ETF", "stock", "Developed", 20.0, 25150.10, 48.75, 1.5),
    Asset("VWO", "Emerging Markets ETF", "stock", "Emerging", 15.0, 18862.58, 42.30, 4.2),
    Asset("CASH", "Cash & Equivalents", "cash", "US", 10.0, 12575.05, 1.0, 0.0),
]

asset_allocation = {asset.symbol:asset.allocation for asset in assets}
region_allocation = {}
asset_type_allocation = {}

for asset in assets:
    if asset.region not in region_allocation:
        region_allocation[asset.region] = asset.allocation
    else:
        region_allocation[asset.region] += asset.allocation
        
    if asset.asset_type not in asset_type_allocation:
        asset_type_allocation[asset.asset_type] = asset.allocation
    else:
        asset_type_allocation[asset.asset_type] += asset.allocation

USER_PROMPT = (
    "Here are the top headlines for today: " 
    + ", ".join(headlines)
    + "Here are the current asset allocations in my portfolio." 
    + "Asset Type allocation: " 
    + ", ".join([key + " - " + str(value) for key, value in asset_type_allocation.items()])
    + "Region allocation: " 
    + ", ".join([key + " - " + str(value) for key, value in region_allocation.items()])
    + "Asset allocation: " 
    + ", ".join([key + " - " + str(value) for key, value in asset_allocation.items()])
    + "Based on this information, which changes should I make to my portfolio?"
)

completion = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct",
    messages=[
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": USER_PROMPT
        }
    ],
)

print(completion.choices[0].message.content)