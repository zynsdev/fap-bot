const { chromium } = require('playwright')
const fs = require('fs')

async function Crawler() {
    const browser = await chromium.launch({
        headless: true
    })
    const context = await browser.newContext()
    const mainPage = await context.newPage()

    await mainPage.goto('http://fap.fpt.edu.vn/')

    // Select Campus
    await Promise.all([
        mainPage.waitForNavigation(/*{ url: 'http://fap.fpt.edu.vn/' }*/),
        mainPage.selectOption('select[id="ctl00_mainContent_ddlCampus"]', '5')
    ]);

    // Login
    const [loginPage] = await Promise.all([
        mainPage.waitForEvent('popup'),
        mainPage.click('div.abcRioButtonContentWrapper')
    ])

    await loginPage.fill('#Email', 'lucltde150074@fpt.edu.vn');
    await loginPage.click('#next')
    await loginPage.fill('#password', '2001pain__Q')
    await loginPage.click('#submit')

    
    // Start Crawl
    await mainPage.waitForNavigation()
    await mainPage.goto('http://fap.fpt.edu.vn/Schedule/TimeTable.aspx')

    await mainPage.screenshot({path: "main-page.png"})
    const lsClass = await mainPage.$$eval('#ctl00_mainContent_divGroup a', ls => Array.from(ls).map(el => el.href))
    
    fs.writeFile('./data/list-class.json', JSON.stringify(lsClass), err => {
        if (err) throw err
    });

    await mainPage.close()
    // ------------------------
    await context.close()
    await browser.close()

}

module.exports = Crawler