import logging
from newsapi import NewsApiClient
from uagents import Agent, Context, Model
from huggingface_hub import InferenceClient
from portfolio_manager import PortfolioManager
import json

# Replace with your NewsAPI key
NEWS_API_KEY = ""
HF_GROQ_API_KEY = ""

# Setup logging
logging.basicConfig(level=logging.INFO)

# Define message models
class NewsRequest(Model):
    pass

class NewsResponse(Model):
    headlines: list
    analysis: str
    
class UserConfirmation(Model):
    decision: str
    target_allocation: dict
    
# Fetch news function
def fetch_news(topic: str):
    try:
        newsapi = NewsApiClient(api_key=NEWS_API_KEY)
        result = newsapi.get_top_headlines(q="finance", language="en", page_size=5)

        #  TODO - lookup news on top holdings in portfolio as well?

        if result["status"] != "ok":
            logging.warning(f"NewsAPI returned status: {result['status']}")
            return []

        articles = result.get("articles", [])
        if not articles:
            logging.info("No articles found for the topic.")
            return []

        headlines = []
        for article in articles:
            title = article.get("title", "No title")
            url = article.get("url", "")
            headlines.append(f"{title} ({url})")

        return headlines

    except Exception as e:
        logging.error(f"Error fetching news from NewsAPI: {e}")
        return []

async def analyze_headlines_async(headlines: list, assets: list):
    if not headlines:
        return "No headlines to analyze."

    #  get asset allocations from assets (list of Asset instances)
    #  TODO - can probably just use portfolio manager methods to get allocations
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
        
        At the beginning of your answer, only provide the asset class, market, or asset, and the estimate of the allocation change.
        
        Here are some examples:
            
            1.  For asset class: ("Bonds", 10%)
            2.  For market: ("Emerging", -10%)
            3.  For specific asset class: ("AAPL", 5%)
                
        If recommending an asset class or market in which the user does not
            have anything currently allocated, suggest a specific asset they
            might want to include.
            
        Please finish the answer with the new asset class allocations you recommend
            for the portfolio and begin this section with "target allocations".  Only
            show the new allocations for the asset classes.  For example:
            
        target allocations: [("stocks":"60%"), ("bonds":"20%"), ("crypto":"10%"), ("cash":"10%")]            
    """

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

    client = InferenceClient(
        provider="groq",
        api_key=HF_GROQ_API_KEY,
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
    
    #  use first choice for recommendation (for now)
    return completion.choices[0].message.content
    
def parse_analysis(analysis: str):
    allocation = analysis[analysis.index("{")+1:analysis.index("}")].split(",")
    allocation = {
        asset_type.split(":")[0].strip():float(
            asset_type.split(":")[1].replace("%","")
        ) 
        for asset_type in allocation
    }

    return allocation    

# Create the agent
news_agent = Agent(name="news_agent")

@news_agent.on_message(model=NewsRequest)
async def handle_news_request(ctx: Context, sender: str, msg: NewsRequest):
    ctx.logger.info(f"Received news request for topic: {msg.topic}")

    headlines = fetch_news(msg.topic)

    if not headlines:
        ctx.logger.warning("No headlines found, sending empty response.")
        await ctx.send(sender, NewsResponse(headlines=[], analysis="No news found."))
        return

    ctx.logger.info("Sending headlines to LLaMA for analysis...")
    analysis = await analyze_headlines_async(headlines)
    target_allocation = parse_analysis(analysis)

    if not target_allocation:
        await ctx.send(sender, "LLaMA did not provide a valid portfolio recommendation.")
        return

    # Send recommendations and ask for confirmation
    confirmation_message = "\nDo you want to proceed with this rebalancing? Reply with 'yes' or 'no'."

    # Send response with headlines and analysis
    await ctx.send(sender, NewsResponse(headlines=headlines, analysis=analysis))
    
    # Send confirmation request
    await ctx.send(sender, confirmation_message)

    # Store the recommended allocation in memory
    news_agent.context['target_allocation'] = target_allocation

@news_agent.on_message(model=UserConfirmation)
async def handle_user_confirmation(ctx: Context, sender: str, msg: UserConfirmation):
    decision = msg.decision.strip().lower()

    if decision == "yes":
        ctx.logger.info("User confirmed rebalancing.")

        # Retrieve stored target allocation
        pm = PortfolioManager()
        pm.rebalance_portfolio(msg.target_allocation)
        portfolio_data = pm.to_dict()    
        print(json.dumps(portfolio_data))
        
        await ctx.send(sender, "Proceeding with portfolio rebalancing...")        
        
        #  note - only rebalances based on asset classes, for now.        
        print("\nPortfolio Summary:")
        print(f"Total Value: ${portfolio_data['total_value']:,.2f}")
        print(f"Number of Assets: {len(portfolio_data['assets'])}")
        print(f"Asset Allocation: {portfolio_data['asset_allocation']}")
        print(f"Geographic Allocation: {portfolio_data['geographic_allocation']}")
        print(f"Portfolio Metrics: {portfolio_data['metrics']}")
        
    else:
        ctx.logger.info("User declined to rebalance.")
        await ctx.send(sender, "Rebalancing canceled. Let me know if you need anything else.")

if __name__ == "__main__":
    news_agent.run()


