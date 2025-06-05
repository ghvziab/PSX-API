from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import schedule
import time
from datetime import datetime


def scraper():
    #setup chrome driver
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    driver.get('https://dps.psx.com.pk')

    #close the initial warning page
    try:
        button1 = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@class="tingle-modal__close"]'))
        )
        button1.click()
    except:
        pass

    #dropdowntable selector
    dropdown = driver.find_element(By.XPATH, '//select[@name="DataTables_Table_0_length"]')
    select = Select(dropdown)
    select.select_by_visible_text("All")
    driver.implicitly_wait(2)

    #finding tables and then its rows
    table = driver.find_element(By.XPATH, '//table[@class="tbl dataTable no-footer"]')
    rows = table.find_elements(By.TAG_NAME, "tr")

    #finding cells
    for row in rows[1:]:
        cols = row.find_elements(By.TAG_NAME, 'td')
        data = [col.text.strip() for col in cols]
        stocks.append(data)
    driver.quit()
    return stocks
    
def runscraper():
    now = datetime.now
    if now.weekday() < 5 and now.hour >=9 and now.hour <= 17:
        scraper()

schedule.every(5).minutes.do(runscraper)
def scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)