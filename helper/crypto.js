import sodium from "libsodium-wrappers";
import * as fs from "fs";
import sendgrid from "@sendgrid/mail";
import { clearTimeout } from "timers";
import randomNumber from "random-number-csprng";

const TIMEOUT = 5 * 60 * 1000; //code's time to live
const MAXATTEMPT = 3; // maximum false testings
const CODELENGTH = 7;
const publickey =
  process.env.DB_PUBLIC_KEY || "7VtK31xkHDNyegAq46ElRsdzNvXWEMa7zBFV9OBwA1Y";
const tokendict = new Object();

//load encrypted json obj
export async function load(path, privatekey) {
  await sodium.ready;
  sendgrid.setApiKey(
    process.env.SENDGRID_APIKEY ||
      "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" //Email API Key
  );
  if (path != null)
    try {
      return JSON.parse(
        sodium.crypto_box_seal_open(
          fs.readFileSync(path),
          sodium.from_base64(publickey),
          sodium.from_base64(privatekey),
          "text"
        )
      );
    } catch (error) {
      console.error(error);
    }
  return null;
}

//send code to user
export async function sendCode(emailaddr) {
  await sodium.ready;
  const code = padDigits((await randomNumber(0, parseInt(Math.pow(10, CODELENGTH)))) - 1);
  try {
    const msg = {
      to: emailaddr,
      from: process.env.SENDER_EMAIL || "noreply@joenzm.me",
      subject: "Your verification code is: " + code,
      text: code,
      html: `<strong>${code}</strong>`,
    };
    await sendgrid.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
  console.log("Sended to " + emailaddr);
  tokendict[emailaddr] = {
    code: code,
    Counter: 0,
    Cancel: setTimeout(function () {
      delete tokendict[emailaddr];
      console.log("Deleted the code of " + emailaddr);
    }, TIMEOUT),
  };
  return true;
}

//check code is vaild, 0 is no, 1 is yes, -1 is not exist or spam
export function isVaild(emailaddr, code) {
  if (tokendict[emailaddr] == null) return -1;
  if (tokendict[emailaddr].code == code) {
    clearTimeout(tokendict[emailaddr].Cancel);
    delete tokendict[emailaddr];
    return 1;
  }
  if (++tokendict[emailaddr].Counter == MAXATTEMPT) {
    tokendict[emailaddr] = null; //Spam
    return -1;
  }
  return 0;
}

//save json obj
export async function saveDB(datast, path) {
  await sodium.ready;
  fs.writeFile(
    path,
    sodium.crypto_box_seal(JSON.stringify(datast), sodium.from_base64(publickey)),
    function (error) {
      if (error) console.error(error);
      else console.log("Saved");
    }
  );
}

//close all timer
export function close() {
  for (var key in tokendict) clearTimeout(tokendict[key].Cancel);
}

//code format
function padDigits(number) {
  return Array(Math.max(CODELENGTH - String(number).length + 1, 0)).join(0) + number;
}
