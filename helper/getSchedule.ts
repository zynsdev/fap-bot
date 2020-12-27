import { ISlot } from './fetchData';
import moment from 'moment'
import * as storage from './fetchCycle'

export async function getScheduleByDay(studentID: string,
    day: string | number = moment.now()
) {
    let res: ISlot[] = [];
    const date = moment(day).format('dddd DD/MM/YYYY')
    if (storage.lsStudent1[studentID])
        for (let groupId of storage.lsStudent1[studentID].enrolledGroupID) {
            const subject = storage.lsGroup1[groupId].courseCode
            const lsSlot = storage.lsGroup1[groupId].schedules
                .filter((el: any) => el.date == date)
                .map((el: any) => ({ ...el, subject }))
            res = [...res, ...lsSlot]
        }

    if (storage.lsStudent2) {
        if (storage.lsStudent2[studentID])
            for (let groupId of storage.lsStudent1[studentID].enrolledGroupID) {
                const subject = storage.lsGroup2[groupId].courseCode
                const lsSlot = storage.lsGroup2[groupId].schedules
                    .filter((el: any) => el.date == date)
                    .map((el: any) => ({ ...el, subject }))
                res = [...res, ...lsSlot]
            }
    }
    return res
}
