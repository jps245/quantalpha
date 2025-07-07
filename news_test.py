NEWS_API_KEY = ''

from newsapi import NewsApiClient

newsapi = NewsApiClient(api_key=NEWS_API_KEY)
result = newsapi.get_top_headlines(language="en", page_size=5)
