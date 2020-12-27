import { diffBetween } from './helper/fetchCycle';
import getSchedule from './helper/getSchedule'

(async () => {
    const c1 = {
        "1800": {
            "name": "1302",
            "courseCode": "DBW301",
            "schedules": [
                {
                    "date": "Tuesday 05/01/2021",
                    "slot": "1",
                    "room": "201",
                    "lecturer": "AAAAA"
                },
            ]
        },
    }
    const c2 = {
        "1800": {
            "name": "1302",
            "courseCode": "DBW301",
            "schedules": [
                {
                    "date": "Tuesday 05/01/2021",
                    "slot": "1",
                    "room": "201",
                    "lecturer": "BBBBB"
                },
            ]
        },
    }
    console.log("Test diff: " + JSON.stringify(diffBetween(c1, c2)))

    console.time('fetch schedule')
    console.log(await getSchedule('DE150074', '2021-01-05', 7))
    console.timeEnd('fetch schedule')
})();