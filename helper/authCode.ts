import { SENDGRID_APIKEY, SENDER_EMAIL_ADDR } from './variable';

const sendgrid = require('@sendgrid/mail');
const randomNumber = require('random-number-csprng');

const TIMEOUT = 5 * 60 * 1000; //code's time to live
const MAXATTEMPT = 3; // maximum false testings
const CODELENGTH = 7;
const tokendict: { [id: string]: CodeRecord } = {}

export function load() {
    sendgrid.setApiKey(
        SENDGRID_APIKEY //Email API Key
    );
}

/**
 *send code to user
 */
export async function sendCode(emailaddr: string): Promise<boolean> {
    const code = padDigits((await randomNumber(0, Math.pow(10, CODELENGTH))) - 1);
    try {
        const msg = {
            to: emailaddr,
            from: SENDER_EMAIL_ADDR,
            subject: 'Your requested validation infomation',
            text: `Your verification code is: ${code}`,
            html: `Your verification code is: <strong>${code}</strong>`,
        };
        await sendgrid.send(msg);
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
        }
        return false;
    }
    console.log('Sended to ' + emailaddr);
    tokendict[emailaddr] = {
        Code: code,
        Counter: 0,
        Cancel: setTimeout(function () {
            delete tokendict[emailaddr];
            console.log('Deleted the code of ' + emailaddr);
        }, TIMEOUT),
    };
    return true;
}

/**
 *check code is vaild, 0 is no, 1 is yes, -1 is not exist or spam
 */
export function isVaild(emailaddr: string, code: string): number {
    if (tokendict[emailaddr] == null) return -1;
    if (tokendict[emailaddr].Code == code) {
        clearTimeout(tokendict[emailaddr].Cancel);
        delete tokendict[emailaddr];
        return 1;
    }
    if (++tokendict[emailaddr].Counter == MAXATTEMPT) {
        delete tokendict[emailaddr]; //Spam
        return -1;
    }
    return 0;
}

/**
 *close all timer
 */
export function close() {
    for (var key in tokendict) clearTimeout(tokendict[key].Cancel);
}

/**
 *code format
 */
function padDigits(number: number) {
    return Array(Math.max(CODELENGTH - String(number).length + 1, 0)).join('0') + number;
}


interface CodeRecord {
    Code: string;
    Counter: number;
    Cancel: NodeJS.Timeout;
}
