from scraper import scraper
from datetime import datetime

now = datetime.now
if now.weekday() < 5 and now.hour >=9 and now.hour <= 17:
    scraper()
