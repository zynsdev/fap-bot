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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_1 = require("playwright");
var fs_1 = __importDefault(require("fs"));
var URL_TIMETABLE = 'http://fap.fpt.edu.vn/Schedule/TimeTable.aspx';
var URL_FAP = 'http://fap.fpt.edu.vn/';
function crawler() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, mainPage, lsClass, lsGroup, lsCourse, _i, lsClass_1, el, lsCourseHTMLElement, _a, lsCourseHTMLElement_1, htmlEl, _b, courseInfo, group, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({
                        headless: true
                    })];
                case 1:
                    browser = _d.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _d.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    mainPage = _d.sent();
                    return [4 /*yield*/, mainPage.goto(URL_FAP)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, login(mainPage)
                        // Start Crawl    
                    ];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, getListClass(mainPage)];
                case 6:
                    lsClass = _d.sent();
                    lsGroup = [];
                    lsCourse = [];
                    _i = 0, lsClass_1 = lsClass;
                    _d.label = 7;
                case 7:
                    if (!(_i < lsClass_1.length)) return [3 /*break*/, 15];
                    el = lsClass_1[_i];
                    return [4 /*yield*/, mainPage.goto(el.url)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, mainPage.$$('#id')];
                case 9:
                    lsCourseHTMLElement = _d.sent();
                    _a = 0, lsCourseHTMLElement_1 = lsCourseHTMLElement;
                    _d.label = 10;
                case 10:
                    if (!(_a < lsCourseHTMLElement_1.length)) return [3 /*break*/, 14];
                    htmlEl = lsCourseHTMLElement_1[_a];
                    _c = getCourseInfo;
                    return [4 /*yield*/, context.newPage()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_d.sent(), htmlEl])];
                case 12:
                    _b = _d.sent(), courseInfo = _b[0], group = _b[1];
                    courseInfo.className = lsClass[0].name;
                    lsCourse.push(courseInfo);
                    lsGroup.push(group);
                    _d.label = 13;
                case 13:
                    _a++;
                    return [3 /*break*/, 10];
                case 14:
                    _i++;
                    return [3 /*break*/, 7];
                case 15:
                    fs_1.default.writeFile('./data/list-course.json', JSON.stringify(lsCourse), function (err) {
                        if (err)
                            throw err;
                    });
                    fs_1.default.writeFile('./data/list-group.json', JSON.stringify(lsGroup), function (err) {
                        if (err)
                            throw err;
                    });
                    return [4 /*yield*/, mainPage.close()
                        // ------------------------
                    ];
                case 16:
                    _d.sent();
                    // ------------------------
                    return [4 /*yield*/, context.close()];
                case 17:
                    // ------------------------
                    _d.sent();
                    return [4 /*yield*/, browser.close()];
                case 18:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = crawler;
function getCourseInfo(page, courseElement) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var name, lsTdElement, schedule, i, _b, _c, id, lsStudent, lsTd, i;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, courseElement.$eval('caption', function (el) { return el.textContent; })];
                case 1:
                    name = _d.sent();
                    return [4 /*yield*/, courseElement.$$eval('td', function (ls) { return ls.map(function (el) { return el.textContent; }); })];
                case 2:
                    lsTdElement = _d.sent();
                    schedule = [];
                    for (i = 0; 5 * i < lsTdElement.length; i++) {
                        schedule.push({
                            date: lsTdElement[i * 5],
                            slot: lsTdElement[i * 5 + 1],
                            room: lsTdElement[i * 5 + 2],
                            lecturer: lsTdElement[i * 5 + 3]
                        });
                    }
                    _c = (_b = page).goto;
                    return [4 /*yield*/, courseElement.$eval('td:nth-child(3) a', function (a) { return a.href; })];
                case 3: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, page.click('#ctl00_mainContent_divContent tbody tr:nth-child(3) a')];
                case 5:
                    _d.sent();
                    id = page.url().slice(-4);
                    lsStudent = [];
                    return [4 /*yield*/, page.$$eval('#id td', function (ls) { return ls.map(function (el) { return el.textContent; }); })];
                case 6:
                    lsTd = _d.sent();
                    for (i = 0; 7 * i < lsTd.length; i++) {
                        lsStudent.push({
                            id: lsTd[7 * i + 3],
                            name: lsTd[7 * i + 4] + " " + lsTd[7 * i + 5] + " " + lsTd[7 * i + 6],
                            email: ((_a = lsTd[7 * i + 2]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) + "@fpt.edu.vn"
                        });
                    }
                    return [4 /*yield*/, page.close()];
                case 7:
                    _d.sent();
                    return [2 /*return*/, [
                            {
                                id: id,
                                className: '',
                                name: name,
                                schedule: schedule,
                            },
                            {
                                id: id,
                                lsStudent: lsStudent
                            }
                        ]];
            }
        });
    });
}
function login(page) {
    return __awaiter(this, void 0, void 0, function () {
        var loginPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Select Campus
                return [4 /*yield*/, Promise.all([
                        page.waitForNavigation( /*{ url: 'http://fap.fpt.edu.vn/' }*/),
                        page.selectOption('select[id="ctl00_mainContent_ddlCampus"]', '5')
                    ])];
                case 1:
                    // Select Campus
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            page.waitForEvent('popup'),
                            page.click('div.abcRioButtonContentWrapper')
                        ])];
                case 2:
                    loginPage = (_a.sent())[0];
                    return [4 /*yield*/, loginPage.fill('#Email', process.env.EMAIL || '')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.click('#next')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.fill('#password', process.env.PASS || '')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.click('#submit')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.waitForNavigation()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getListClass(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.goto(URL_TIMETABLE)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$$eval('#ctl00_mainContent_divGroup a', function (ls) { return ls.map(function (el) { return ({
                            name: el.textContent,
                            url: el.href
                        }); }); })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
