import { CAMPUS_CODE, EMAIL, PASS, TERM_CODE, URL_FAP } from './variable';
import { Browser, BrowserContext, chromium, ElementHandle, Page } from 'playwright';


export interface IDictStudent{
    [id: string] :{
        fullname: string,
        email: string,
        enrolledGroupID: number[]
    }
}
export interface IDictCourse{
    [id: string]: string
}
export interface ISlot{
    date: any,
    slot: any | null,
    room: string | null,
    lecturer: string | null
}
export interface IDictGroup{
    [id: number] : {
        name: string,
        courseCode: string,
        schedules: ISlot[]
    }
}

export async function fetchData(
    term:  string = TERM_CODE,
    campus: string = CAMPUS_CODE,
    lsStudent: IDictStudent = {},
    lsGroup: IDictGroup = {},
    lsCourse: IDictCourse = {}
) {
    const {browser, context, mainPage} = await init()
    
    await mainPage.goto(`http://fap.fpt.edu.vn/Schedule/TimeTable.aspx?campus=${campus}&term=${term}`)
    const lsClass = await mainPage.$$eval(
        '#ctl00_mainContent_divGroup a',
        ls => ls.map((el:any) => el.href)
    )
    
    for (let el of lsClass){
        await mainPage.goto(el)
        const lsTable = await mainPage.$$('#id')
        for (let table of lsTable) await getInfo(
            await context.newPage(),
            table,
            lsStudent,
            lsGroup,
            lsCourse,            
            el.slice(-6)
        )
    }

    await kill(browser, context, mainPage)
    return {s: lsStudent, g: lsGroup, c: lsCourse}
}

async function getInfo(
    page:Page, 
    tableElement:ElementHandle<SVGElement | HTMLElement>,
    lsStudent: IDictStudent = {},
    lsGroup: IDictGroup = {},
    lsCourse: IDictCourse = {},
    groupName: string = ''
) {
    const [_, courseCode, courseName] = (await tableElement.$eval('caption', el => el.textContent))
        ?.match(/([\w]*) \((.*)\)/)
        ?.map(el => el)
        || []        
    lsCourse[courseCode] = courseName
    
    let tempList = []
    tempList = await tableElement.$$eval('td', list => list.map(el => el.textContent))
    let schedules: ISlot[] = []
    for (let i=0; 5*i<tempList.length; i++) schedules.push({
        date: tempList[5*i],
        slot: tempList[5*i + 1],
        room: tempList[5*i + 2],
        lecturer: tempList[5*i + 3]
    })

    if (!(await tableElement.$('td'))) return
    await page.goto(await tableElement.$eval('td:nth-child(3) a', (a:any) => a.href))
    await page.click('#ctl00_mainContent_divContent tbody tr:nth-child(3) a')
    const groupId = +page.url().slice(-4)
    lsGroup[groupId] = {  
        name: groupName, 
        courseCode,
        schedules,
    }

    tempList = await page.$$eval('#id td', list => list.map(el => el.textContent))
    for (let i=0; 7*i<tempList.length; i++){
        const studentID:any = tempList[7*i + 3] || ''
        const email = `${tempList[7*i + 2]?.toLowerCase()}@fpt.edu.vn`
        const fullname = `${tempList[7*i+4]} ${tempList[7*i+5]} ${tempList[7*i+6]}`.replace(/\s+/g, ' ')
                
        if (!lsStudent[studentID]) lsStudent[studentID] = {fullname, email, enrolledGroupID: []}
        lsStudent[studentID].enrolledGroupID.push(groupId)
    }
    await page.close()
}

async function init() {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const mainPage = await context.newPage()
    await mainPage.goto(URL_FAP)

    // Select Campus
    await Promise.all([
        mainPage.waitForNavigation(),
        mainPage.selectOption('select[id="ctl00_mainContent_ddlCampus"]', '5')
    ])
    // Login
    const [loginPage] = await Promise.all([
        mainPage.waitForEvent('popup'),
        mainPage.click('div.abcRioButtonContentWrapper')
    ])
    await loginPage.fill('#Email', EMAIL)
    await loginPage.click('#next')
    await loginPage.fill('#password', PASS)
    await loginPage.click('#submit')
    await mainPage.waitForNavigation()
    await loginPage.close()

    return {browser, context, mainPage}
}

async function kill(
    browser:Browser, 
    context: BrowserContext,
    page: Page
) {
    await page.close()
    // Close browser
    await context.close()
    await browser.close()
}


