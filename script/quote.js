document.addEventListener("DOMContentLoaded", function () {
    toggleCustomQuoteFields();
    toggleTripTypeFields();

    const formElements = document.querySelectorAll("#date, #time, #name, #vehicle-available, #vehicle, #preset-hours, #include-min-hours-policy, #include-alcohol-policy, #include-alcohol-policy-custom, #hours, #custom-base-rate, #custom-gas-fee, #include-additional-hours, #custom-additional-hours, #custom-rate-additional, #include-byob, #custom-byob-hours, #custom-rate-byob");

    formElements.forEach(element => {
        element.addEventListener("input", calculateQuote);
    });

    const quoteTypeRadios = document.getElementsByName("quote-type");
    const tripTypeRadios = document.getElementsByName("trip-type");

    quoteTypeRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            toggleCustomQuoteFields();
            calculateQuote();
        });
    });

    tripTypeRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            toggleTripTypeFields();
            calculateQuote();
        });
    });

    document.getElementById("include-additional-hours").addEventListener("change", function () {
        toggleAdditionalHoursFields();
        calculateQuote();
    });

    document.getElementById("include-byob").addEventListener("change", function () {
        toggleBYOBFields();
        calculateQuote();
    });

    document.getElementById("include-alcohol-policy").addEventListener("change", calculateQuote);
    document.getElementById("include-alcohol-policy-custom").addEventListener("change", calculateQuote);
    document.getElementById("vehicle").addEventListener("change", updateRates);
    document.getElementById("date").addEventListener("change", updateRates);
    document.getElementById("time").addEventListener("change", updateRates);
    updateRates(); // Initial call to set rates on page load
});

function updateRates() {
    const vehicleType = document.getElementById("vehicle").value;
    const dateInput = document.getElementById("date").value;
    const timeInput = document.getElementById("time").value;

    if (!dateInput || !timeInput) {
        document.getElementById("selected-day").textContent = "";
        document.getElementById("min-rate").textContent = "";
        document.getElementById("max-rate").textContent = "";
        return;
    }

    // Correctly parse date input without time zone interference
    const date = new Date(dateInput + 'T12:00:00'); // Setting time to noon to avoid any timezone issues
    const dayOfWeek = date.getUTCDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    const time = new Date(`1970-01-01T${timeInput}:00Z`).getUTCHours(); // Get hour in UTC to determine time of day

    const rates = {
        "trolley_midnight_36": {
            weekday: { 
                day: { min: 1695, max: 1695 }, 
                night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1875, max: 1975 }, 
                night: { min: 1875, max: 1975, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 2175, max: 2393.75 }, 
                night: { min: 2175, max: 2393.75, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "trolley_fusion_30": {
            weekday: { 
                day: { min: 1695, max: 1695 }, 
                night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1795, max: 1875 }, 
                night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 2075, max: 2175 }, 
                night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "trolley_bliss_30": {
            weekday: { 
                day: { min: 1695, max: 1695 }, 
                night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1795, max: 1875 }, 
                night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 2075, max: 2175 }, 
                night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "trolley_classic_30": {
            weekday: { 
                day: { min: 1695, max: 1695 }, 
                night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1795, max: 1875 }, 
                night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 2075, max: 2175 }, 
                night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "trolley_festive_24": {
            weekday: { 
                day: { min: 1595, max: 1595 }, 
                night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1695, max: 1795 }, 
                night: { min: 1695, max: 1795, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 1875, max: 1975 }, 
                night: { min: 1875, max: 1975, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "coach_bus_super": {
            weekday: { 
                day: { min: 1495, max: 1495 }, 
                night: { min: 1495, max: 1495 } 
            },
            friday: { 
                day: { min: 1595, max: 1687.5 }, 
                night: { min: 1595, max: 1687.5 } 
            },
            saturday: { 
                day: { min: 1595, max: 1687.5 }, 
                night: { min: 1595, max: 1687.5 } 
            }
        },
        "coach_bus_rentals": {
            weekday: { 
                day: { min: 1495, max: 1495 }, 
                night: { min: 1495, max: 1495 } 
            },
            friday: { 
                day: { min: 1595, max: 1687.5 }, 
                night: { min: 1595, max: 1687.5 } 
            },
            saturday: { 
                day: { min: 1595, max: 1687.5 }, 
                night: { min: 1595, max: 1687.5 } 
            }
        },
        "coach_bus_corporate": {
            weekday: { 
                day: { min: 1295, max: 1295 }, 
                night: { min: 1295, max: 1295 } 
            },
            friday: { 
                day: { min: 1295, max: 1395 }, 
                night: { min: 1295, max: 1395 } 
            },
            saturday: { 
                day: { min: 1395, max: 1495 }, 
                night: { min: 1395, max: 1495 } 
            }
        },
        "coach_bus_crystal": {
            weekday: { 
                day: { min: 1195, max: 1195 }, 
                night: { min: 1195, max: 1195 } 
            },
            friday: { 
                day: { min: 1195, max: 1295 }, 
                night: { min: 1195, max: 1295 } 
            },
            saturday: { 
                day: { min: 1195, max: 1295 }, 
                night: { min: 1195, max: 1295 } 
            }
        },
        "partybus_dove_40": {
            weekday: { 
                day: { min: 1595, max: 1595 }, 
                night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1795, max: 1895 }, 
                night: { min: 1795, max: 1895, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 1995, max: 2195 }, 
                night: { min: 1995, max: 2195, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "partybus_nightrider_30": {
            weekday: { 
                day: { min: 1295, max: 1295 }, 
                night: { min: 1295, max: 1295, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1595, max: 1695 }, 
                night: { min: 1595, max: 1695, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 1795, max: 1895 }, 
                night: { min: 1795, max: 1895, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "partybus_eagle_25": {
            weekday: { 
                day: { min: 1295, max: 1295 }, 
                night: { min: 1295, max: 1295, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1495, max: 1595 }, 
                night: { min: 1495, max: 1595, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 1695, max: 1795 }, 
                night: { min: 1695, max: 1795, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "partybus_whitehawk_20": {
            weekday: { 
                day: { min: 1195, max: 1195 }, 
                night: { min: 1195, max: 1195, special: { "3hr": 300, "4hr": 250 } } 
            },
            friday: { 
                day: { min: 1495, max: 1495 }, 
                night: { min: 1495, max: 1495, special: { "3hr": 300, "4hr": 250 } } 
            },
            saturday: { 
                day: { min: 1595, max: 1595 }, 
                night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } } 
            }
        },
        "ford_transit_limo": {
            weekday: { 
                day: { min: 795, max: 795 }, 
                night: { min: 795, max: 795 } 
            },
            friday: { 
                day: { min: 795, max: 895 }, 
                night: { min: 795, max: 895 } 
            },
            saturday: { 
                day: { min: 895, max: 995 }, 
                night: { min: 895, max: 995 } 
            }
        },
        "sprinter_shuttle_van": {
            weekday: { 
                day: { min: 695, max: 695 }, 
                night: { min: 695, max: 695 } 
            },
            friday: { 
                day: { min: 795, max: 795 }, 
                night: { min: 795, max: 795 } 
            },
            saturday: { 
                day: { min: 795, max: 895 }, 
                night: { min: 795, max: 895 } 
            }
        },
        "pink_hummer_h2": {
            weekday: { 
                day: { min: 995, max: 995 }, 
                night: { min: 995, max: 995 } 
            },
            friday: { 
                day: { min: 1095, max: 1195 }, 
                night: { min: 1095, max: 1195 } 
            },
            saturday: { 
                day: { min: 1295, max: 1375 }, 
                night: { min: 1295, max: 1375 } 
            }
        },
        "pink_chrysler_300": {
            weekday: { 
                day: { min: 795, max: 795 }, 
                night: { min: 795, max: 795 } 
            },
            friday: { 
                day: { min: 875, max: 875 }, 
                night: { min: 875, max: 875 } 
            },
            saturday: { 
                day: { min: 875, max: 995 }, 
                night: { min: 875, max: 995 } 
            }
        },
        "christmas_trolley": {
            weekday: { 
                day: { min: 1595, max: 1595 }, 
                night: { min: 1595, max: 1595 } 
            },
            friday: { 
                day: { min: 1595, max: 1695 }, 
                night: { min: 1595, max: 1695 } 
            },
            saturday: { 
                day: { min: 1595, max: 1695 }, 
                night: { min: 1595, max: 1695 } 
            }
        }
    };
    

    const vehicleRates = rates[vehicleType] || {};
    let dayType = "weekday";
    if (dayOfWeek === 5) { // Friday
        dayType = "friday";
    } else if (dayOfWeek === 6) { // Saturday
        dayType = "saturday";
    }

    let timeOfDay = "day";
    let timePeriod = "before 6pm";
    if (time >= 18 || time < 4) {
        timeOfDay = "night";
        timePeriod = "after 6pm";
    }

    const selectedRates = (vehicleRates[dayType] && vehicleRates[dayType][timeOfDay]) || { min: 0, max: 0 };
    const specialRates = selectedRates.special || null;
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const selectedDay = dayNames[dayOfWeek];

    document.getElementById("selected-day").textContent = `${selectedDay} (${timePeriod})`;

    if (timeOfDay === "night" && specialRates) {
        document.getElementById("min-max-rates").innerHTML = `
            <p>3hr: $${specialRates["3hr"]}/hr</p>
            <p>4hr: $${specialRates["4hr"]}/hr</p>
        `;
    } else {
        document.getElementById("min-max-rates").innerHTML = `
            <p>High: <span id="max-rate">$${selectedRates.max.toFixed(2)}</span></p>
            <p>Low: <span id="min-rate">$${selectedRates.min.toFixed(2)}</span></p>
        `;
    }
}

function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Rest of your existing functions here


function toggleCustomQuoteFields() {
    const customQuoteFields = document.getElementById("custom-quote-fields");
    const customQuoteHoursBYOB = document.getElementById("custom-quote-hours-byob");
    const presetQuoteAlcoholPolicy = document.getElementById("preset-quote-alcohol-policy");
    const byobSwitchContainer = document.querySelector(".form-group.byob-switch");
    const presetHoursField = document.querySelector(".preset-hours");
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;

    if (quoteType === "custom") {
        customQuoteFields.style.display = "block";
        customQuoteHoursBYOB.style.display = "block";
        byobSwitchContainer.style.display = "none";
        presetQuoteAlcoholPolicy.style.display = "none";
        presetHoursField.style.display = "none";
    } else {
        customQuoteFields.style.display = "none";
        customQuoteHoursBYOB.style.display = "none";
        byobSwitchContainer.style.display = "block";
        presetQuoteAlcoholPolicy.style.display = "block";
        presetHoursField.style.display = "block";
    }
}

function toggleTripTypeFields() {
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;
    const customQuoteFields = document.getElementById("custom-quote-fields");
    const customQuoteHoursBYOB = document.getElementById("custom-quote-hours-byob");
    const includeMinHoursPolicy = document.getElementById("include-min-hours-policy-div");
    const baseRateField = document.getElementById("base-rate");
    const hoursField = document.getElementById("hours");

    if (tripType === "hourly") {
        customQuoteFields.style.display = "block";
        customQuoteHoursBYOB.style.display = "block";
        includeMinHoursPolicy.style.display = "block";
        baseRateField.style.display = "block";
        hoursField.parentElement.style.display = "block";
    } else if (tripType === "one-way" || tripType === "two-way") {
        customQuoteFields.style.display = "block";
        customQuoteHoursBYOB.style.display = "none";
        includeMinHoursPolicy.style.display = "none";
        baseRateField.style.display = "block";
        hoursField.value = "";
        hoursField.parentElement.style.display = "none";
    }
}

function toggleAdditionalHoursFields() {
    const additionalHoursFields = document.getElementById("additional-hours-fields");
    const additionalHoursCheckbox = document.getElementById("include-additional-hours");

    if (additionalHoursCheckbox.checked) {
        additionalHoursFields.style.display = "block";
    } else {
        additionalHoursFields.style.display = "none";
    }
}

function toggleBYOBFields() {
    const byobFields = document.getElementById("byob-fields");
    const byobCheckbox = document.getElementById("include-byob");

    if (byobCheckbox.checked) {
        byobFields.style.display = "block";
    } else {
        byobFields.style.display = "none";
    }
}

function calculateQuote() {
    const name = document.getElementById("name").value || "Customer";
    const vehicleAvailable = document.getElementById("vehicle-available").checked;
    const includeAlcoholPolicy = document.getElementById("include-alcohol-policy").checked;
    const includeAlcoholPolicyCustom = document.getElementById("include-alcohol-policy-custom").checked;
    const includeMinHoursPolicy = document.getElementById("include-min-hours-policy").checked;
    const vehicleType = document.getElementById("vehicle").value;
    const hours = parseFloat(document.getElementById("hours").value) || 0; // Default to 0 if undefined
    const includeAlcohol = document.getElementById("include-alcohol").checked;
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;
    const includeAdditionalHours = document.getElementById("include-additional-hours").checked;
    const includeBYOB = document.getElementById("include-byob").checked;
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;

    const dateInput = document.getElementById("date").value || "Not specified";
    let formattedDate = "Not specified";
    if (dateInput !== "Not specified") {
        const date = new Date(dateInput + "T12:00:00"); // Set time to midday to avoid timezone issues
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        formattedDate = `${month}/${day}/${year}`;
    }

    let time = document.getElementById("time").value || "Not specified";

    // Convert 24-hour time to 12-hour format
    if (time !== "Not specified") {
        let [hour, minute] = time.split(":");
        hour = parseInt(hour, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12; // Convert hour to 12-hour format
        time = `${hour}:${minute} ${ampm}`;
    }

    let availabilityMessage = "";
    if (vehicleAvailable) {
        availabilityMessage = "We're excited to inform you that the <strong>requested vehicle is available.</strong>";
    } else {
        availabilityMessage = "The requested vehicle is not available. However, we do have a similar vehicle that can meet your expectations.";
    }

    let baseRate = 0;
    let minHours = 4;
    let gasFee = 0;
    let additionalHourRate = 300;
    let stcPercentage = 10;
    let gratuityPercentage = 15;
    let securityGuardFee = 0;
    let vehicleName = "";
    let paxNumber = 0;
    let displayBaseRate = "";
    let imageUrl = "";
    let vehicleLink = "";
    let hasRearBalcony = false;
    let hasRestroom = false;

    // Initialize custom additional hours and rate variables
    let customAdditionalHours = 0;
    let customRateAdditional = 0;
    let perHourRate = 0;

    // Fetch vehicle data regardless of quote type
    switch (vehicleType) {
        case "trolley_midnight_36":
            baseRate = 1795;
            gasFee = 250;
            vehicleName = "Trolley Midnight";
            paxNumber = 36;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
            vehicleLink = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case "trolley_fusion_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Fusion";
            paxNumber = 30;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case "trolley_bliss_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Bliss";
            paxNumber = 30;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
            vehicleLink = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
            hasRearBalcony = true;
            break;
        case "trolley_classic_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Classic";
            paxNumber = 30;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
            break;
        case "trolley_festive_24":
            baseRate = 1495;
            gasFee = 125;
            vehicleName = "Trolley Festive";
            paxNumber = 24;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-rental.php";
            hasRearBalcony = true;
            break;
        case "partybus_dove_40":
            baseRate = 1795;
            gasFee = 250;
            vehicleName = "Party Bus - Dove";
            paxNumber = 40;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
            vehicleLink = "https://wtglimo.com/chicago-party-bus-rental.php";
            break;
        case "partybus_nightrider_30":
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Night Rider";
            paxNumber = 30;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
            vehicleLink = "https://wtglimo.com/libertyville-party-bus-rental.php";
            break;
        case "partybus_eagle_25":
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Eagle";
            paxNumber = 25;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
            vehicleLink = "https://wtglimo.com/Palatine-party-bus-rental.php";
            break;
        case "partybus_whitehawk_20":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Party Bus - White Hawk";
            paxNumber = 20;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png";
            vehicleLink = "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php";
            break;
        case "pink_hummer_h2":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Hummer H2";
            paxNumber = 18;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.png";
            vehicleLink = "https://wtglimo.com/hummer_pink_panther.php";
            break;
        case "pink_chrysler_300":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Chrysler 300";
            paxNumber = 10;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png";
            vehicleLink = "https://wtglimo.com/pink-limo-rental-Chicago.php";
            break;
        case "christmas_trolley":
            baseRate = 1495;
            gasFee = 150;
            vehicleName = "Christmas Trolley";
            paxNumber = "24-36";
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png";
            vehicleLink = "https://wtglimo.com/Christmas-trolley-tours-Chicago.php";
            hasRearBalcony = true;
            break;
        case "ford_transit_limo":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Ford Transit Limo";
            paxNumber = 15;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png";
            vehicleLink = "https://wtglimo.com/limo-van.php";
            break;
        case "sprinter_shuttle_van":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Sprinter Shuttle Van";
            paxNumber = 14;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png";
            vehicleLink = "https://wtglimo.com/sprinter_shuttle_van.php";
            break;
        case "hummer_h2_stretch_limo":
            baseRate = 350 * minHours;
            gasFee = 150;
            additionalHourRate = 300;
            vehicleName = "Hummer H2 Stretch Limo";
            paxNumber = 20;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png";
            vehicleLink = "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php";
            break;
        case "chrysler_300_limo":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Chrysler 300 Limo";
            paxNumber = 10;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php";
            break;
        case "lincoln_mkt_limo":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Lincoln MKT Limo";
            paxNumber = 10;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php";
            break;
        case "lincoln_navigator":
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Lincoln Navigator";
            paxNumber = 7;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png";
            vehicleLink = "https://wtglimo.com/lincoln-navigator-limo.php";
            break;
        case "cadillac_escalade":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Cadillac Escalade";
            paxNumber = 7;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png";
            vehicleLink = "https://wtglimo.com/cadillac-escalade-limo.php";
            break;
        case "chevrolet_suburban":
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Chevrolet Suburban";
            paxNumber = 7;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png";
            vehicleLink = "https://wtglimo.com/suv-limo-rental.php";
            break;
        case "lincoln_mkz":
            baseRate = 150 * minHours;
            gasFee = 50;
            additionalHourRate = 100;
            vehicleName = "Lincoln MKZ";
            paxNumber = 4;
            displayBaseRate = `$${formatNumber(baseRate)}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png";
            vehicleLink = "https://wtglimo.com/limo-car-service.php";
            break;
        case "coach_bus_super":
            baseRate = 1200;
            minHours = 5;
            gasFee = 500;
            vehicleName = "Coach Bus - Super";
            hasRestroom = true;
            paxNumber = 50;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png";
            vehicleLink = "https://wtglimo.com/chicago-Super-Coach-Bus.php";
            break;
        case "coach_bus_rentals":
            baseRate = 1000;
            minHours = 5;
            gasFee = 400;
            vehicleName = "Motor Coach - Everywhere";
            hasRestroom = true;
            paxNumber = 56;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png";
            vehicleLink = "https://wtglimo.com/chicago_coach_bus.php";
            break;
        case "coach_bus_corporate":
            baseRate = 1500;
            minHours = 5;
            gasFee = 600;
            vehicleName = "Coach Bus - Corporate";
            paxNumber = 42;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png";
            vehicleLink = "https://wtglimo.com/executive_shuttle_bus.php";
            break;
        case "coach_bus_crystal":
            baseRate = 1300;
            minHours = 4;
            gasFee = 500;
            vehicleName = "Coach Bus - Crystal";
            paxNumber = 25;
            displayBaseRate = `$${formatNumber(baseRate)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBusCrystal-main.png";
            vehicleLink = "https://wtglimo.com/executive_bus_crystal.php";
            break;
        default:
            alert("Invalid vehicle type selected.");
            return;
    }


    let totalAdditionalCost = 0;
    let totalBYOBCost = 0;
    let totalHours = hours;

    if (quoteType === "custom") {
        if (tripType === "hourly") {
            baseRate = parseFloat(document.getElementById("custom-base-rate").value) || 0;
            gasFee = parseFloat(document.getElementById("custom-gas-fee").value) || 0;

            if (includeAdditionalHours) {
                customAdditionalHours = parseFloat(document.getElementById("custom-additional-hours").value) || 0;
                customRateAdditional = parseFloat(document.getElementById("custom-rate-additional").value) || 0;
                totalAdditionalCost = customAdditionalHours * customRateAdditional;
                totalHours += customAdditionalHours;
            }

            if (includeBYOB) {
                const customBYOBHours = parseFloat(document.getElementById("custom-byob-hours").value) || 0;
                const customRateBYOB = parseFloat(document.getElementById("custom-rate-byob").value) || 0;
                totalBYOBCost = customBYOBHours * customRateBYOB;
            }

            baseRate *= hours;
            perHourRate = baseRate / hours;
            displayBaseRate = `$${formatNumber(baseRate)}`;
        } else if (tripType === "one-way" || tripType === "two-way") {
            baseRate = parseFloat(document.getElementById("custom-base-rate").value) || 0;
            gasFee = parseFloat(document.getElementById("custom-gas-fee").value) || 0;
            
            twoWaysDisplayRate = baseRate;
            if (tripType === "two-way") {
                baseRate *= 2; // Double the base rate for two-way trips
            }

            totalAdditionalCost = 0; // No additional hours for one-way or two-way trips
            displayBaseRate = `$${formatNumber(baseRate)}`;
            minHours = 0;
        }
    } else {
        const presetVehicleRates = {
            "trolley_midnight_36": { baseRate: 1800, minHours: 4, gasFee: 250 },
            "trolley_fusion_30": { baseRate: 1600, minHours: 4, gasFee: 175 },
            // Add more vehicles as needed
        };
    
        const vehicleDetails = presetVehicleRates[vehicleType];
    
        if (vehicleDetails) {
            baseRate = vehicleDetails.baseRate;
            minHours = vehicleDetails.minHours;
            gasFee = vehicleDetails.gasFee;
    
            if (hours < minHours) {
                alert(`Minimum hours for ${vehicleName} is ${minHours}.`);
                return;
            }
    
            baseRate *= hours;
            const stc = (baseRate * stcPercentage) / 100;
            const gratuity = (baseRate * gratuityPercentage) / 100;
            const total = baseRate + stc + gratuity + gasFee + securityGuardFee;
    
            displayBaseRate = `$${formatNumber(baseRate)}`;
            
            perHourRate = baseRate / hours;
        } else {
            alert("Invalid vehicle type selected.");
            return;
        }
    }

    if (includeAlcohol && paxNumber > 15 && quoteType !== "custom") {
        securityGuardFee = 250; // Base fee for 4 hours
        if (totalHours > 4) {
            securityGuardFee += (totalHours - 4) * 35;
        }
    }

    const totalBaseRate = baseRate;
    const stc = (totalBaseRate * stcPercentage) / 100;
    const gratuity = (totalBaseRate * gratuityPercentage) / 100;
    const total = totalBaseRate + stc + gratuity + gasFee + securityGuardFee + totalAdditionalCost + totalBYOBCost;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <div id="quote-content">
          <p class="intro-para">
            Hello <strong>${name}</strong>,<br><br>
            Thank you for choosing <strong>WAYTOGO Trolley & Charter Bus</strong>. ${availabilityMessage} Please review the quote below and make your reservation online.
          </p>
          <h2 class="vehicle-name">${vehicleName} <span class="byob-text">(${paxNumber} Passengers)</span><span class="vehicle-recommeded"> ${
              !vehicleAvailable ? "(Recommended Vehicle)" : ""
          }</span></h2>
          <div class="image-container">
              <img src="${imageUrl}" alt="${vehicleName}" />
          </div>
          <div class="vehicle-name-link">
              <p><a href="${vehicleLink}" target="_blank">(View More Pictures)</a></p>
          </div>
          <div class="details">
              <p class="paragraph-padding"><strong>Vehicle Details:</strong> ${paxNumber} Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled,${
                  hasRestroom ? " Restroom," : ""
              } Comfortable Perimeter Seats${
                  hasRearBalcony ? ", Rear Balcony" : ""
              }, Ice & Water.</p>

              <p><strong>Quote Includes:</strong> Unlimited stops & mileage, gratuity, all fees, fuel and service charges.</p>
              ${includeMinHoursPolicy && tripType === "hourly" ? `<div id="min-hours-requirement" class="minimum-requirements">
                 <p><strong>Minimum Hours:</strong> There is a minimum ${minHours}-hour requirement for vehicles with 15+ passengers.</p>
               </div>` : ''}

              <div class="quote-price">
                  <div class="quote-datetime">
                      <p><small>${formattedDate}</small></p>
                      <p><small>&nbsp;/ ${time}</small></p>
                  </div>
                  <p class="quote-heading"><strong>Quote: ${
                    tripType === "hourly" ? `${totalHours} Hour Package` :
                    tripType === "one-way" ? "Transfer <span class='byob-text'>(one-way)</span>" :
                    "Round Trip <span class='byob-text'>(to/from)</span>"
                  } <span class="byob-text">${
                    includeMinHoursPolicy && tripType === "hourly" ? `(Minimum Required)` : ''
                  }</span></strong></p>
                  <p>Base Rate: ${displayBaseRate} ${
                    tripType === "hourly" ? `<span class="byob-text">(${hours.toFixed(2)} hrs @ $${formatNumber(perHourRate)} per hour)</span>` :
                    tripType === "two-way" ? `<span class='byob-text'>(${formatNumber(twoWaysDisplayRate)} each way)</span>` : ''
                  }</p>
                  <ul>
                      <li>STC: ${stcPercentage.toFixed(2)}%</li>
                      <li>Gratuity: ${gratuityPercentage.toFixed(2)}%</li>
                      <li>Gas Fee: $${formatNumber(gasFee)}</li>
                      ${
                        securityGuardFee > 0
                          ? `<li>BYOB Security Guard Fee: $${formatNumber(securityGuardFee)}</li>`
                          : ""
                      }
                      ${
                        totalBYOBCost > 0
                          ? `<li>BYOB Security Cost: $${formatNumber(totalBYOBCost)} <span class="byob-text">(Chicago Trips Only)</span></li>`
                          : ""
                      }
                      ${
                        totalAdditionalCost > 0
                          ? `<li>Additional Hours Cost: $${formatNumber(totalAdditionalCost)} <span class="byob-text">(${customAdditionalHours.toFixed(2)} hrs @ $${formatNumber(customRateAdditional)})</span></li>`
                          : ""
                      }
                  </ul>
                  <p class="total"><strong>Total: $${formatNumber(total)}<span class="byob-text"> (All Inclusive)</span></strong></p>
                  <p class="quote-expiry">(The quote expires in 14 days. Act Fast)</p>
              </div>
          </div>
          ${includeAlcoholPolicy ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>` : ''}
          ${includeAlcoholPolicyCustom ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>` : ''}
            
          <p class="paragraph-reserve"><strong>How Do I Reserve?</strong> A 20% deposit is required to make the reservation. The deposit amount will be credited towards the final payment. The remaining balance is due 14 days prior to the event. Credit card processing fee is 3.75%.</p>
          <div class="reserve-btn">
              <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>
          </div>
          <hr>
        </div>
    `;
}


function copyToClipboard() {
  const quoteContent = document.getElementById("quote-content");
  if (quoteContent) {
    const range = document.createRange();
    range.selectNode(quoteContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
    } catch (err) {
      alert("Failed to copy the quote. Please try again.");
    }

    selection.removeAllRanges();
  } else {
    alert("No quote available to copy.");
  }
}
