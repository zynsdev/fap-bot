import { ElementHandle, Page } from "playwright";
import { chromium } from 'playwright'
import fs from 'fs'

const URL_TIMETABLE = 'http://fap.fpt.edu.vn/Schedule/TimeTable.aspx'
const URL_FAP = 'http://fap.fpt.edu.vn/'


export default async function crawler() {
    const browser = await chromium.launch({
        headless: true
    })
    const context = await browser.newContext()
    const mainPage = await context.newPage()
    await mainPage.goto(URL_FAP)
    
    await login(mainPage)

    
    // Start Crawl    
    const lsClass = await getListClass(mainPage)
    let lsGroup = []
    let lsCourse = []
    for (const el of lsClass){
        await mainPage.goto(el.url)
        const lsCourseHTMLElement = await mainPage.$$('#id')
        for (const htmlEl of lsCourseHTMLElement){            
            let [courseInfo, group] = await getCourseInfo(await context.newPage(), htmlEl)
            courseInfo.className = lsClass[0].name
            lsCourse.push(courseInfo)
            lsGroup.push(group)
        }
    }
    
    fs.writeFile('./data/list-course.json', JSON.stringify(lsCourse), err => {
        if (err) throw err
    })
    fs.writeFile('./data/list-group.json', JSON.stringify(lsGroup), err => {
        if (err) throw err
    })

    await mainPage.close()
    // ------------------------
    await context.close()
    await browser.close()

}

async function getCourseInfo(page:Page, courseElement:ElementHandle<SVGElement | HTMLElement>) {    
    const name = await courseElement.$eval('caption', el => el.textContent)
    const lsTdElement = await courseElement.$$eval('td', ls => ls.map(el => el.textContent))
    let schedule = []
    for (let i=0; 5*i<lsTdElement.length; i++){
        schedule.push({
            date: lsTdElement[i*5],
            slot: lsTdElement[i*5 + 1],
            room: lsTdElement[i*5 + 2],
            lecturer: lsTdElement[i*5 + 3]
        })
    }

    await page.goto(await courseElement.$eval('td:nth-child(3) a', (a:any) => a.href))
    await page.click('#ctl00_mainContent_divContent tbody tr:nth-child(3) a')
    const id = page.url().slice(-4)

    let lsStudent = []
    const lsTd = await page.$$eval('#id td', ls => ls.map(el => el.textContent))
    for (let i=0; 7*i<lsTd.length; i++){
        lsStudent.push({
            id: lsTd[7*i + 3],
            name: `${lsTd[7*i+4]} ${lsTd[7*i+5]} ${lsTd[7*i+6]}`,
            email: `${lsTd[7*i+2]?.toLowerCase()}@fpt.edu.vn`
        })
    }

    await page.close()
    return [
        {
            id,
            className: '',
            name,
            schedule,
        },
        {
            id,
            lsStudent
        }
    ]
}

async function login(page:Page) {
    // Select Campus
    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://fap.fpt.edu.vn/' }*/),
        page.selectOption('select[id="ctl00_mainContent_ddlCampus"]', '5')
    ]);

    // Login
    const [loginPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('div.abcRioButtonContentWrapper')
    ])

    await loginPage.fill('#Email', process.env.EMAIL || '');
    await loginPage.click('#next')
    await loginPage.fill('#password', process.env.PASS || '')
    await loginPage.click('#submit')   
    await page.waitForNavigation() 
}

async function getListClass(page:Page) {    
    await page.goto(URL_TIMETABLE)

    return await page.$$eval(
        '#ctl00_mainContent_divGroup a',
        ls => ls.map((el:any) => ({
            name: el.textContent,
            url: el.href
        }))
    )
}
