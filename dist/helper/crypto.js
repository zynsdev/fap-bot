"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.saveDB = exports.isVaild = exports.sendCode = exports.load = void 0;
var sodium = require("libsodium-wrappers");
var fs = require("fs");
var sendgrid = require("@sendgrid/mail");
var randomNumber = require("random-number-csprng");
var TIMEOUT = 5 * 60 * 1000; //code's time to live
var MAXATTEMPT = 3; // maximum false testings
var CODELENGTH = 7;
var publickey = process.env.DB_PUBLIC_KEY || "7VtK31xkHDNyegAq46ElRsdzNvXWEMa7zBFV9OBwA1Y";
var tokendict = {};
/**
 *load encrypted json obj
 */
function load(path, privatekey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _a.sent();
                    sendgrid.setApiKey(process.env.SENDGRID_APIKEY ||
                        "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" //Email API Key
                    );
                    if (path != null)
                        try {
                            return [2 /*return*/, JSON.parse(sodium.crypto_box_seal_open(fs.readFileSync(path), sodium.from_base64(publickey), sodium.from_base64(privatekey), "text"))];
                        }
                        catch (error) {
                            console.error(error);
                        }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.load = load;
/**
 *send code to user
 */
function sendCode(emailaddr) {
    return __awaiter(this, void 0, void 0, function () {
        var code, _a, msg, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _b.sent();
                    _a = padDigits;
                    return [4 /*yield*/, randomNumber(0, Math.pow(10, CODELENGTH))];
                case 2:
                    code = _a.apply(void 0, [(_b.sent()) - 1]);
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    msg = {
                        to: emailaddr,
                        from: process.env.SENDER_EMAIL || "noreply@joenzm.me",
                        subject: "Your verification code is: " + code,
                        text: code,
                        html: "<strong>" + code + "</strong>",
                    };
                    return [4 /*yield*/, sendgrid.send(msg)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error(error_1);
                    if (error_1.response) {
                        console.error(error_1.response.body);
                    }
                    return [2 /*return*/, false];
                case 6:
                    console.log("Sended to " + emailaddr);
                    tokendict[emailaddr] = {
                        Code: code,
                        Counter: 0,
                        Cancel: setTimeout(function () {
                            delete tokendict[emailaddr];
                            console.log("Deleted the code of " + emailaddr);
                        }, TIMEOUT),
                    };
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.sendCode = sendCode;
/**
 *check code is vaild, 0 is no, 1 is yes, -1 is not exist or spam
 */
function isVaild(emailaddr, code) {
    if (tokendict[emailaddr] == null)
        return -1;
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
exports.isVaild = isVaild;
/**
 *save json obj
 */
function saveDB(datast, path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sodium.ready];
                case 1:
                    _a.sent();
                    fs.writeFile(path, sodium.crypto_box_seal(JSON.stringify(datast), sodium.from_base64(publickey)), function (error) {
                        if (error)
                            console.error(error);
                        else
                            console.log("Saved");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveDB = saveDB;
/**
 *close all timer
 */
function close() {
    for (var key in tokendict)
        clearTimeout(tokendict[key].Cancel);
}
exports.close = close;
/**
 *code format
 */
function padDigits(number) {
    return Array(Math.max(CODELENGTH - String(number).length + 1, 0)).join("0") + number;
}
