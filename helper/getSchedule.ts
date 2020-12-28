import { ISlot } from './fetchData';
import moment from 'moment'
import * as storage from './fetchCycle'

export default async function getScheduleByDay(studentID: string, days: number,
    datestr: string | number = moment.now()
) {
    let res: ISlot[] = [];
    const date = moment(datestr)
    if (storage.lsStudent1[studentID])
        for (let groupId of storage.lsStudent1[studentID].enrolledGroupID) {
            const subject = storage.lsGroup1[groupId].courseCode
            const lsSlot = storage.lsGroup1[groupId].schedules
                .filter((el: any) => {
                    const diffdays = moment(el.date, 'dddd DD/MM/YYYY').diff(date, 'days')
                    return (diffdays >= 0 && diffdays < days)
                })
                .map((el: any) => ({ ...el, subject }))
            res = [...res, ...lsSlot]
        }

    if (storage.lsStudent2) {
        if (storage.lsStudent2[studentID])
            for (let groupId of storage.lsStudent1[studentID].enrolledGroupID) {
                const subject = storage.lsGroup2[groupId].courseCode
                const lsSlot = storage.lsGroup2[groupId].schedules
                    .filter((el: any) => {
                        const diffdays = moment(el.date, 'dddd DD/MM/YYYY').diff(date, 'days')
                        return (diffdays >= 0 && diffdays < days)
                    })
                    .map((el: any) => ({ ...el, subject }))
                res = [...res, ...lsSlot]
            }
    }
    return res
}
