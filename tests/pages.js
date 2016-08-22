(function () {
    "use strict";
    var pages = {
        flightSearchResults: function runner_interaction_flightSearchResults(page, pos) {
            var aa = new Date(),
                am = aa.getMonth(),
                ad = aa.getDate(),
                bm = 0,
                bd = 0,
                cd = 0,
                year = aa.getYear(),
                by = "",
                fromDate = "",
                toDate = "",
                pagenode = {};
            if (ad > 23) {
                bd = "04";
                cd = "08";
                am += 1;
            } else {
                bd = ad.toString();
                cd = (ad + 4).toString();
            }
            if (am > 9) {
                am = am - 10;
                year += 1;
            } else {
                am += 2;
            }
            bm = "0" + am.toString();
            if (bd.length < 2) {
                bd = "0" + bd;
            }
            if (cd.length < 2) {
                cd = "0" + cd;
            }
            by = "20" + year.toString().slice(1);
            if (pos.name === "RBC") {
                fromDate = bd + "/" + bm + "/" + by;
                toDate   = cd + "/" + bm + "/" + by;
            } else {
                fromDate = bm + "/" + bd + "/" + by;
                toDate   = bm + "/" + cd + "/" + by;
            }
            /*log("Filling in search criteria...");
            page.evaluateJavaScript("function(){document.getElementById(\"flight-departing\").click();document.getElementById(\"flight-departing\").value=\"" + fromDate + "\";}");
            page.evaluateJavaScript("function(){document.getElementById(\"flight-returning\").click();document.getElementById(\"flight-returning\").value=\"" + toDate + "\";}");
            page.evaluateJavaScript("function(){document.getElementById(\"flight-origin\").click();document.getElementById(\"flight-origin\").value=\"dfw\";}");
            page.evaluateJavaScript("function(){document.getElementById(\"flight-destination\").click();document.getElementById(\"flight-destination\").value=\"las\";}");
            pagenode = page.evaluateJavaScript("function(){return document.getElementById(\"typeahead-close\");}");
            if (pagenode !== null && pagenode !== "") {
                page.evaluateJavaScript("function(){document.getElementById(\"typeahead-close\").click();}");
            }
            setTimeout(function () {
                page.evaluateJavaScript("function(){document.getElementById(\"new-homepage-search-wizard\").click();document.getElementById(\"search-button\").click();}");
            }, 100);
            setTimeout(function () {
                pagenode = page.evaluateJavaScript("function(){return document.getElementById(\"flight-errors\");}");
                if (pagenode !== null && (pagenode.style === null || pagenode.style.display !== "none")) {
                    console.error("Flight search rejected by storefront wizard.");
                    phantom.exit(1);
                }
            }, 100);*/
            page.evaluateJavaScript("function(){location.href=\"https://travelcenterbankofamericacom.sandbox.dev.sb.karmalab.net/Flights-Search?trip=roundtrip&leg1=from:dfw,to:las,departure:" + fromDate + "TANYT&leg2=from:mco,to:dfw,departure:" + toDate + "TANYT&passengers=children:0,adults:1,seniors:0,infantinlap:Y&mode=search\";}");
        }
    };
    module.exports = pages;
}());
