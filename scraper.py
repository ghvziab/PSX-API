from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def scraper():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--single-process",
                "--no-zygote",
            ]
        )
        page =  browser.new_page()
        page.goto('https://dps.psx.com.pk')

        page.click('button[class=tingle-modal__close]')
        page.locator('//select[@name="DataTables_Table_0_length"]').select_option('All')

        page.is_visible('table.tbl dataTable no-footer')
        table = page.inner_html('//table[@class="tbl dataTable no-footer"]')
        soup = BeautifulSoup(table, 'lxml')

        stocks = []
        rows = soup.find_all('tr')
        for row in rows[1:]:
            cols = row.find_all('td')
            data = [col.text.strip() for col in cols]
            stocks.append(data)
        
        #page.wait_for_timeout(20000)
    return stocks