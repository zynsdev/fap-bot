import { diffBetween } from './helper/fetchCycle';
import getSchedule from './helper/getSchedule';
import * as auth from './helper/authCode';

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

    /*
    console.time('fetch schedule')
    console.log(await getSchedule('DE150074', 7))
    console.timeEnd('fetch schedule')
    */
    auth.load()
    console.log(await auth.sendCode('nezumixxi@gmail.com'));
    auth.close()
})();