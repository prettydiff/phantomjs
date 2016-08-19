/*global alertMenuRequestIds, module*/
(function () {
    "use strict";
    var group = [
        {
            id   : "70204",
            name : "BAC",
            units: [
                "id tab-package-tab is absent",
                "id hotel-add-flight-checkbox is absent",
                "id tab-cruise-tab is absent",
                "id tab-activity-tab is absent",
                "id tab-homeaway-tab is absent",
                "interaction click() on id tab-flight-tab and wait for flight",
                "id flight-add-car-checkbox is absent",
                "id flight-add-hotel-checkbox is absent",
                "move to flightSearchResults and wait for function(){return location.href.indexOf(\"Flights-Search\")>0&&document.readyState===\"complete\";}",
                "id crossSellOfferList is absent"
            ],
            url  : "https://travelcenterbankofamericacom.sandbox.dev.sb.karmalab.net/"
        }/*, {
            id   : "70211",
            name : "BACCASH",
            units: [
                "id tab-package-tab is absent",
                "id hotel-add-flight-checkbox is absent",
                "id tab-cruise-tab is absent",
                "id tab-activity-tab is absent",
                "id tab-homeaway-tab is absent",
                "interaction click() on id tab-flight-tab and wait for flight",
                "id flight-add-hotel-checkbox is absent",
                "id flight-add-car-checkbox is absent",
                //toFlightSearchResults,
                "id crossSellOfferList is absent"
            ],
            url  : "https://travelcenter2bankofamericacom.sandbox.dev.sb.karmalab.net/"
        }, {
            id   : "70213",
            name : "BACFIA",
            units: [
                "id tab-package-tab is absent",
                "id hotel-add-flight-checkbox is absent",
                "id tab-cruise-tab is absent",
                "id tab-activity-tab is absent",
                "id tab-homeaway-tab is absent",
                "interaction click() on id tab-flight-tab and wait for flight",
                "id flight-add-hotel-checkbox is absent",
                "id flight-add-car-checkbox is absent",
                //toFlightSearchResults,
                "id crossSellOfferList is absent"
            ],
            url  : "https://travelcenterfiacardservicescom.sandbox.dev.sb.karmalab.net/"
        }, {
            id   : "70212",
            name : "BACML",
            units: [
                "id tab-package-tab is absent",
                "id hotel-add-flight-checkbox is absent",
                "id tab-cruise-tab is absent",
                "id tab-activity-tab is absent",
                "id tab-homeaway-tab is absent",
                "interaction click() on id tab-flight-tab and wait for flight",
                "id flight-add-hotel-checkbox is absent",
                "id flight-add-car-checkbox is absent",
                //toFlightSearchResults,
                "id crossSellOfferList is absent"
            ],
            url  : "https://travelcentermlcom.sandbox.dev.sb.karmalab.net/"
        }, {
            id   : "70205",
            name : "RBC",
            units: [
                "id tab-package-tab is present",
                "id hotel-add-flight-checkbox is present",
                "id tab-cruise-tab is absent",
                "id tab-activity-tab is absent",
                "id tab-homeaway-tab is absent",
                "interaction click() on id tab-flight-tab and wait for flight",
                "id flight-add-hotel-checkbox is present",
                "id flight-add-car-checkbox is absent",
                //toFlightSearchResults,
                "id crossSellOfferList is absent"
            ],
            url  : "https://travelrbcrewardscom.sandbox.dev.sb.karmalab.net/"
        }*/
    ];
    module.exports = group;
}());
