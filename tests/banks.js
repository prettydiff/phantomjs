/*global console, document, phantom, require*/

(function runner() {
    "use strict";
    var webpage   = require("webpage"),
        index     = 0,
        timeout   = 50,
        startTime = 0,
        logging   = "error",
        fail      = 0,
        pass      = 0,
        pages     = require("/Users/echeney/phantomjs/tests/pages.js"),
        group     = require("/Users/echeney/phantomjs/tests/tests.js"),
        log       = function runner_log(msg) {
            console.log(msg);
        },
        stacktrace  = function runner_stacktrace(stack) {
            var funcy = (stack.function === "" || typeof stack.function !== "string")
                ? (anonymous)
                : stack.function;
            log("Line \u001b[33m" + stack.line + "\u001b[39m in function \u001b[31m" + funcy + "\u001b[39m of file \u001b[33m" + stack.file + "\u001b[39m");
        },
        time      = function runner_time(finished) {
            var minuteString = "",
                hourString   = "",
                secondString = "",
                minutes      = 0,
                hours        = 0,
                elapsed      = 0,
                plural       = function runner_time_plural(x, y) {
                    var a = "";
                    if (x !== 1) {
                        a = x + y + "s ";
                    } else {
                        a = x + y + " ";
                    }
                    return a;
                },
                minute       = function runner_time_minute() {
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
        next      = function runner_next(array, func) {
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
        perform   = function runner_perform(group) {
            var page     = webpage.create(),
                duration = 0,
                waitFor  = function runner_perform_waitFor(callback, timeout) {
                    var now   = Date.now(),
                        ready = "",
                        cycle = function runner_perform_waitFor_cycle() {
                            var a        = 0,
                                grouplen = group.units.length,
                                action   = function runner_perform_waitFor_cycle_action() {
                                    var item  = (typeof group.units[a] === "function")
                                            ? group.units[a]()
                                            : group.units[a],
                                        words = item.split(" "),
                                        query = "function(){return document.getElement",
                                        valid = false,
                                        start = 0,
                                        parse = function runner_perform_waitFor_cycle_action_parse(start) {
                                            var itema = item.slice(start).split(""),
                                                output = [],
                                                x = 0,
                                                y = itema.length,
                                                z = 0;
                                            for (x = 0; x < y; x += 1) {
                                                output.push(itema[x]);
                                                if (itema[x] === "{") {
                                                    z += 1;
                                                } else if (itema[x] === "}") {
                                                    z -= 1;
                                                    if (z < 1) {
                                                        break;
                                                    }
                                                }
                                            }
                                            if (start === words[0].length + 1) {
                                                words = item.slice(13 + output.length).split(" ");
                                                words.splice(0, 0, output.join(""));
                                                words.splice(0, 0, "interaction");
                                            } else {
                                                words[2] = output.join("");
                                            }
                                        },
                                        delay = function runner_perform_waitFor_cycle_action_delay(thing) {
                                            var delaytest = page.evaluateJavaScript(thing).toString();
                                            if (delaytest === "exit") {
                                                phantom.exit(1);
                                            }
                                            if (delaytest === "" || delaytest === "false") {
                                                return setTimeout(function runner_perform_waitFor_cycle_action_delay_setTimeout() {
                                                    runner_perform_waitFor_cycle_action_delay(thing);
                                                }, 100);
                                            }
                                            if (a < grouplen) {
                                                runner_perform_waitFor_cycle_action();
                                            } else {
                                                next(group, runner_perform);
                                            }
                                        };
                                    a += 1;
                                    if (words[0] === "move") {
                                        start = (words[0].length + 1);
                                        if (words[1] === "to") {
                                            words.splice(1, 1);
                                            start += 3;
                                        }
                                        page.name = pages[words[1]].name;
                                        pages[words[1]].load(page, group.name);
                                        delay(pages[words[1]].delay);
                                    } else if (words[0] === "interaction") {
                                        if (words[1].indexOf("function(") === 0 || (words[1] === "function" && words[2].indexOf("(") === 0)) {
                                            parse(words[0].length + 1);
                                        }
                                        if (words[2] === "on") {
                                            words.splice(2, 1);
                                        }
                                        if (words[1].indexOf("function") === 0) {
                                            query = words[1];
                                        }
                                        if (words[2] === "id") {
                                            words.splice(2, 1);
                                            query = "function(){document.getElementById(\"" + words[2] + "\")." + words[1] + ";}";
                                            words.splice(1, 1);
                                        }
                                        page.evaluateJavaScript(query);
                                        if (words[2] !== undefined) {
                                            start = words[0].length + words[1].length + 2;
                                            if (words[2] === "and") {
                                                words.splice(2, 1);
                                                start += 4;
                                            }
                                            if (words[2] === "wait") {
                                                words.splice(2, 1);
                                                start += 5;
                                            }
                                            if (words[2] === "for") {
                                                words.splice(2, 1);
                                                start += 4;
                                            }
                                            if (words[2].indexOf("function(") === 0 || (words[2] === "function" && words[3].indexOf("(") === 0)) {
                                                parse(start);
                                            } else {
                                                words[2] = "function(){return document.getElementById(\"" + words[2] + "\");}";
                                            }
                                            delay(words[2]);
                                        } else {
                                            if (a < grouplen) {
                                                runner_perform_waitFor_cycle_action();
                                            } else {
                                                next(group, runner_perform);
                                            }
                                        }
                                    } else {
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
                                        if (a < grouplen) {
                                            runner_perform_waitFor_cycle_action();
                                        } else {
                                            next(group, runner_perform);
                                        }
                                    }
                                };
                            ready = page.evaluate(function runner_perform_waitFor_cycle_evaluate() {
                                return document.readyState;
                            });
                            if (ready === "complete") {
                                action();
                            } else {
                                if (typeof timeout === "number" && (Date.now() - now) + 1 > timeout && timeout > 0) {
                                    fail += 1;
                                    log("\u001b[31mFail:\u001b[39m page took too long load. Moving to next test.");
                                    return next(group, runner_perform);
                                }
                                return setTimeout(runner_perform_waitFor_cycle, 100);
                            }
                        };
                    cycle();
                };
            log("\u001b[33m" + group.name + "\u001b[39m, starting up...");
            page.name             = "Homepage";
            page.onAlert          = function runner_perform_onAlert(msg) {
                if (logging === "all" || logging === "alert") {
                    return log("\u001b[36mPAGE ALERT\u001b[39m: " + msg);
                }
                return {};
            };
            page.onError          = function runner_perform_onError(msg, trace) {
                if (logging === "all" || logging === "error") {
                    log("\u001b[31mPAGE ERROR\u001b[39m: " + msg);
                    log("");
                    log("\u001b[31mSTACKTRACE\u001b[39m:");
                    trace.forEach(stacktrace);
                    return phantom.exit(1);
                }
                return {};
            };
            page.onConsoleMessage = function runner_perform_onConsoleMessage(msg) {
                if (logging === "all" || logging === "console") {
                    return log("\u001b[33mPAGE CONSOLE\u001b[39m: " + msg);
                }
                return {};
            };
            page.onUrlChanged = function runner_perform_onUrlChanged(target) {
                if (target !== "about:blank") {
                    log("Moving to " + page.name);
                }
            };
            page.open(group.url, function runner_perform_open(status) {
                duration = 0;
                if (status === "success") {
                    waitFor(function runner_perform_waitFor(name, validation) {
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
                } else {
                    log("\u001b[31m" + status + "\u001b[39m: Failed to open page " + group.url);
                }
            });
        };
    phantom.onError = function runner_onError(msg, trace) {
        log("\u001b[31mPHANTOM ERROR\u001b[39m: " + msg);
        log("");
        log("\u001b[31mSTACKTRACE\u001b[39m:");
        trace.forEach(stacktrace);
        phantom.exit(1);
    };
    startTime = Date.now();
    log("");
    perform(group[index]);
}());
