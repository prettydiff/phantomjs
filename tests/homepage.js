/*global console, document, phantom, require*/

(function () {
    "use strict";
    var webpage   = require("webpage"),
        index     = 0,
        timeout   = 50,
        startTime = 0,
        logging   = "error",
        fail      = 0,
        pass      = 0,
        tests     = [
            {
                id   : "70204",
                name : "BAC",
                units: [
                    "id tab-package-tab is absent",
                    "id flight-add-car-checkbox is absent",
                    "id flight-add-hotel-checkbox is absent",
                    "id tab-cruise-tab is absent",
                    "id tab-activity-tab is absent",
                    "id tab-homeaway-tab is absent",
                    "interaction click() on id tab-flight-tab and wait for flight",
                    "id flight-add-hotel-checkbox is absent"
                ],
                url  : "https://travelcenterbankofamericacom.sandbox.dev.sb.karmalab.net/"
            }, {
                id   : "70211",
                name : "BACCASH",
                units: [
                    "id tab-package-tab is absent",
                    "id flight-add-car-checkbox is absent",
                    "id flight-add-hotel-checkbox is absent",
                    "id tab-cruise-tab is absent",
                    "id tab-activity-tab is absent",
                    "id tab-homeaway-tab is absent",
                    "interaction click() on id tab-flight-tab and wait for flight",
                    "id flight-add-hotel-checkbox is absent"
                ],
                url  : "https://travelcenter2bankofamericacom.sandbox.dev.sb.karmalab.net/"
            }, {
                id   : "70213",
                name : "BACFIA",
                units: [
                    "id tab-package-tab is absent",
                    "id flight-add-car-checkbox is absent",
                    "id flight-add-hotel-checkbox is absent",
                    "id tab-cruise-tab is absent",
                    "id tab-activity-tab is absent",
                    "id tab-homeaway-tab is absent",
                    "interaction click() on id tab-flight-tab and wait for flight",
                    "id flight-add-hotel-checkbox is absent"
                ],
                url  : "https://travelcenterfiacardservicescom.sandbox.dev.sb.karmalab.net/"
            }, {
                id   : "70212",
                name : "BACML",
                units: [
                    "id tab-package-tab is absent",
                    "id flight-add-car-checkbox is absent",
                    "id flight-add-hotel-checkbox is absent",
                    "id tab-cruise-tab is absent",
                    "id tab-activity-tab is absent",
                    "id tab-homeaway-tab is absent",
                    "interaction click() on id tab-flight-tab and wait for flight",
                    "id flight-add-hotel-checkbox is absent"
                ],
                url  : "https://travelcentermlcom.sandbox.dev.sb.karmalab.net/"
            }, {
                id   : "70205",
                name : "RBC",
                units: [
                    "id tab-package-tab is present",
                    "id flight-add-car-checkbox is absent",
                    "id hotel-add-flight-checkbox is present",
                    "id tab-cruise-tab is absent",
                    "id tab-activity-tab is absent",
                    "id tab-homeaway-tab is absent",
                    "interaction click() on id tab-flight-tab and wait for flight",
                    "id flight-add-hotel-checkbox is present"
                ],
                url  : "https://travelrbcrewardscom.sandbox.dev.sb.karmalab.net/"
            }
        ],
        log       = function (msg) {
            console.log(msg);
        },
        time      = function (finished) {
            var minuteString = "",
                hourString   = "",
                secondString = "",
                finalTime    = "",
                minutes      = 0,
                hours        = 0,
                elapsed      = 0,
                plural       = function core__proctime_plural(x, y) {
                    var a = "";
                    if (x !== 1) {
                        a = x + y + "s ";
                    } else {
                        a = x + y + " ";
                    }
                    return a;
                },
                minute       = function core__proctime_minute() {
                    minutes      = parseInt((elapsed / 60), 10);
                    minuteString = (finished === true)
                        ? plural(minutes, " minute")
                        : (minutes < 10)
                            ? "0" + minutes
                            : "" + minutes;
                    minutes      = elapsed - (minutes * 60);
                    secondString = (finished === true)
                        ? (minutes === 1)
                            ? " 1 second "
                            : minutes.toFixed(3) + " seconds "
                        : minutes.toFixed(3);
                };
            elapsed      = (Date.now() - startTime) / 1000;
            secondString = elapsed.toFixed(3);
            if (elapsed >= 60 && elapsed < 3600) {
                minute();
            } else if (elapsed >= 3600) {
                hours      = parseInt((elapsed / 3600), 10);
                elapsed    = elapsed - (hours * 3600);
                hourString = (finished === true)
                    ? plural(hours, " hour")
                    : (hours < 10)
                        ? "0" + hours
                        : "" + hours;
                minute();
            } else {
                secondString = (finished === true)
                    ? plural(secondString, " second")
                    : secondString;
            }
            if (finished === true) {
                return hourString + minuteString + secondString + "total time";
            }
            if (hourString === "") {
                hourString = "00";
            }
            if (minuteString === "") {
                minuteString = "00";
            }
            if ((/^([0-9]\.)/).test(secondString) === true) {
                secondString = "0" + secondString;
            }
            return "\u001B[36m[" + hourString + ":" + minuteString + ":" + secondString + "]\u001B[39m ";
        },
        next      = function (array, func) {
            var plural = "";
            log("");
            index += 1;
            if (index < array.length) {
                return func(array[index]);
            }
            log(time(true));
            if (fail > 0) {
                if (fail > 1) {
                    plural = "s";
                }
                log("\u001b[31mFailed\u001b[39m " + fail + " task" + plural + " of " + (pass + fail) + " total tasks");
                phantom.exit(1);
            } else {
                log("\u001b[32mPassed\u001b[39m all " + (pass + fail) + " tasks");
                phantom.exit(0);
            }
        },
        perform   = function performtests(group) {
            var page     = webpage.create(),
                duration = 0,
                waitFor  = function (callback, timeout) {
                    var now   = Date.now(),
                        ready = "",
                        valid = {},
                        cycle = function cycle_self() {
                            var a        = 0,
                                grouplen = group.units.length,
                                action   = function actionfunc() {
                                    var item  = group.units[a],
                                        words = item.split(" "),
                                        query = "function(){return document.getElement",
                                        valid = "",
                                        delay = function delayfunc(thing) {
                                            var delaytest = page.evaluateJavaScript("function(){return document.getElementById(\"" + thing + "\");}").toString();
                                            if (delaytest === "") {
                                                return setTimeout(function () {
                                                    delayfunc(thing);
                                                }, 1000);
                                            }
                                            if (a < grouplen) {
                                                actionfunc();
                                            } else {
                                                next(tests, performtests);
                                            }
                                        };
                                    a += 1;
                                    if (words[0] === "interaction") {
                                        if (words[2] === "on") {
                                            words.splice(2, 1);
                                        }
                                        query = "function(){document.getElementById(\"" + words[3] + "\")." + words[1] + ";}";
                                        page.evaluateJavaScript(query);
                                        if (words[4] === "and") {
                                            words.splice(4, 1);
                                        }
                                        if (words[4] === "wait") {
                                            words.splice(4, 1);
                                        }
                                        if (words[4] === "for") {
                                            words.splice(4, 1);
                                        }
                                        delay(words[4]);
                                        return false;
                                    }
                                    if (words[2] === "is") {
                                        words.splice(2, 1);
                                    }
                                    if (words[0] === "id") {
                                        query = query + "ById(\"";
                                    } else if (words[0] === "element") {
                                        query = query + "sByTagName(\"";
                                    }
                                    query = query + words[1] + "\");}";
                                    valid = (words[2] === "absent")
                                        ? page.evaluateJavaScript(query).toString() === ""
                                        : page.evaluateJavaScript(query).toString() !== "";
                                    callback(item, valid);
                                    if (a === grouplen) {
                                        next(tests, performtests);
                                        return false;
                                    }
                                    return true;
                                };
                            ready = page.evaluate(function () {
                                return document.readyState;
                            });
                            if (ready !== "complete") {
                                if (typeof timeout === "number" && (Date.now() - now) + 1 > timeout && timeout > 0) {
                                    fail += 1;
                                    log("\u001b[31mFail:\u001b[39m page took too long load. Moving to next test.");
                                    return next(tests, performtests);
                                }
                                log("Page is loading... Waiting 2 seconds.");
                                return setTimeout(cycle_self, 2000);
                            }
                            do {
                                if (action() === false) {
                                    break;
                                }
                            } while (a < grouplen);
                        };
                    cycle();
                };
            log("\u001b[33m" + group.name + "\u001b[39m, opening page...");
            page.onAlert          = function (msg) {
                if (logging === "all" || logging === "alert") {
                    return log("\u001b[36mALERT\u001b[39m: " + msg);
                }
                return {};
            };
            page.onError          = function (msg) {
                if (logging === "all" || logging === "error") {
                    return log("\u001b[31mERROR\u001b[39m: " + msg);
                }
                return {};
            };
            page.onConsoleMessage = function (msg) {
                if (logging === "all" || logging === "console") {
                    return log("\u001b[33mCONSOLE\u001b[39m: " + msg);
                }
                return {};
            };
            page.open(group.url, function (status) {
                duration = 0;
                log(status + " opening " + group.url);
                if (status === "success") {
                    waitFor(function (name, validation) {
                        var passfail = (validation === true)
                            ? "\u001b[32mPass\u001b[39m"
                            : "\u001b[31mFail\u001b[39m";
                        if (validation === false) {
                            fail += 1;
                        } else {
                            pass += 1;
                        }
                        log(time(false) + " " + passfail + ": \u001b[36m" + name + "\u001b[39m for \u001b[33m" + group.name + "\u001b[39m");
                    }, 0);
                }
            });
        };
    startTime = Date.now();
    log("");
    perform(tests[index]);
}());
