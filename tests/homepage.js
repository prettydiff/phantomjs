/*global console, phantom, require*/

(function () {
    "use strict";
    var webpage  = require("webpage"),
        index    = 0,
        timeout  = 50,
        startTime = 0,
        logging  = "none",
        posarray = [
            {
                name: "RBC",
                url: "https://travelrbcrewardscom.sandbox.dev.sb.karmalab.net/",
                id: "70205"
            },
            {
                name: "BAC",
                url: "https://travelcenterbankofamericacom.sandbox.dev.sb.karmalab.net/",
                id: "70204"
            },
            {
                name: "BACCASH",
                url: "https://travelcenter2bankofamericacom.sandbox.dev.sb.karmalab.net/",
                id: "70211"
            },
            {
                name: "BACFIA",
                url: "https://travelcenterfiacardservicescom.sandbox.dev.sb.karmalab.net/",
                id: "70213"
            },
            {
                name: "BACML",
                url: "https://travelcentermlcom.sandbox.dev.sb.karmalab.net/",
                id: "70212"
            }
        ],
        time     = function (finished) {
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
                finalTime = hourString + minuteString + secondString;
                console.log(finalMem + " of memory consumed");
                console.log(finalTime + "total time");
                console.log("");
            } else {
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
            }
        },
        next     = function (array, func) {
            console.log("");
            index += 1;
            if (index === array.length) {
                func(array[index]);
            } else {
                console.log(time(true));
                phantom.exit();
            }
        },
        perform  = function performtests(pos) {
            var page     = webpage.create(),
                duration = 0,
                load     = function loading(callback) {
                    var readyState = page.evaluate(function () {
                        return document.readyState;
                    });
                    if (readyState === "complete") {
                        callback();
                    } else if (duration + 10 === timeout) {
                        console.log("Page not loaded within timeout. Moving to next POS");
                        next(posarray, performtests);
                    } else {
                        duration += 20;
                        setTimeout(10000, function () {
                            console.log("Page hasn't finished loading.  Waiting 10 seconds.");
                            loading(callback);
                        });
                    }
                };
            console.log("\u001b[33m" + pos.name + "\u001b[39m, opening page...");
            page.onAlert = function (msg) {
                if (logging === "all" || logging === "alert") {
                    return console.log("\u001b[36mALERT\u001b[39m: " + msg);
                }
                return {};
            };
            page.onError = function (msg) {
                if (logging === "all" || logging === "error") {
                    return console.log("\u001b[31mERROR\u001b[39m: " + msg);
                }
                return {};
            };
            page.onConsoleMessage = function (msg) {
                if (logging === "all" || logging === "console") {
                    return console.log("\u001b[33mCONSOLE\u001b[39m: " + msg);
                }
                return {};
            };
            page.open(pos.url, function (status) {
                duration = 0;
                console.log(status + " opening " +pos.url);
                if (status === "success") {
                    load(function () {
                        var name       = "Presence of package tab",
                            validation = (pos.name === "RBC")
                                ? document.getElementById("tab-package-tab") !== null
                                : document.getElementById("tab-package-tab") === null,
                            passfail   = (validation === true)
                                ? "\u001b[32mPass\u001b[39m"
                                : "\u001b[31mFail\u001b[39m";
                        console.log(time(false) + " " + passfail + ": \u001b[36m" + name + "\u001b[39m for POS \u001b[33m" + pos.name + "\u001b[39m");
                        next(posarray, performtests);
                    });
                }
            });
        };
    startTime = Date.now();
    console.log("");
    perform(posarray[index]);
}());
