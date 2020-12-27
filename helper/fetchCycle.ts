import moment from 'moment'
import { fetchData, IDictCourse, IDictStudent, IDictGroup, ISlot } from './fetchData';
import { getScheduleByDay } from './getSchedule';
import _ from "lodash";

export declare var lsStudent1: IDictStudent, lsGroup1: IDictGroup, lsCourse1: IDictCourse,
    lsStudent2: IDictStudent, lsGroup2: IDictGroup, lsCourse2: IDictCourse,
    diff1: IDictGroup, diff2: IDictGroup
    //Diff1 and Diff2 is like another the lists of groups, but it contains groups that have changes in schedules

export default async function fetch() {
    
    console.time('id')
    const date = moment()
    console.log('Start fetch cycle at ' + date.format('HH:mm:ss DD-MM-YYYY'))

    const months = Math.round(date.diff(moment('2020-09-01'), 'months', false) + 1)
    console.log(`Months: ${months}`)

    //Every 4 months is equal to 1 term, begin at term 19 (01/09/2020)
    const term = Math.floor(months / 4 + 19);

    console.log('Get term ' + term)
    let { s, g, c } = await fetchData(String(term), '5')

    //Check if have any change
    if (lsStudent1) {
        diff1 = diffBetween(g, lsGroup1)
    }
    lsStudent1 = s, lsGroup1 = g, lsCourse1 = c

    /* Use in-ram database, so not need to save files
    fs.writeFileSync('./data/1/list-course.json', JSON.stringify(lsCourse1))
    fs.writeFileSync('./data/1/list-group.json', JSON.stringify(lsGroup1))
    fs.writeFileSync('./data/1/list-student.json', JSON.stringify(lsStudent1))
    */

    //If it in the transition between 2 terms, then fetch the pervious term | 0 = the last month of pervious term, 1 = the first of current term
    if (months % 4 < 2) {
        console.log('Get term ' + (term - 1))

        let { s, g, c } = await fetchData(String(term - 1), '5')

        //Check if have any change
        if (lsStudent2) {
            diff2 = diffBetween(g, lsGroup2)
        }
        lsStudent2 = s, lsGroup2 = g, lsCourse2 = c
    }

    /* Use in-ram database, so not need to save files 
    fs.writeFileSync('./data/2/list-course.json', JSON.stringify(lsCourse1))
    fs.writeFileSync('./data/2/list-group.json', JSON.stringify(lsGroup1))
    fs.writeFileSync('./data/2/list-student.json', JSON.stringify(lsStudent1))
    */

    console.timeEnd('id')
    getScheduleByDay('DE150302', '2021-01-05');
};

/* Use in-ram database, so shouldn't read from files :) 
lsStudent1 = JSON.parse(fs.readFileSync('./data/1/list-student.json').toString())
lsStudent2 = JSON.parse(fs.readFileSync('./data/2/list-student.json').toString())

lsGroup1 = JSON.parse(fs.readFileSync('./data/1/list-group.json').toString())
lsGroup2 = JSON.parse(fs.readFileSync('./data/2/list-group.json').toString())

lsCourse1 = JSON.parse(fs.readFileSync('./data/1/list-course.json').toString())
lsCourse2 = JSON.parse(fs.readFileSync('./data/2/list-course.json').toString())
*/


function diffBetween(g1: IDictGroup, g2: IDictGroup) {
    return  Object.assign({}, ...Object.entries(g1)
    .map(function ([k, v]) {
        const slots = v.schedules.filter((ex: ISlot) => _.findIndex(g2[parseInt(k)].schedules, ex) == -1)

        //If didn't change anything, return undefined
        return slots.length > 0 ?
            {
                [k]: {
                    name: v.name, courseCode: v.courseCode, schedules: slots
                }
            } : undefined      
        }          
    ))
}