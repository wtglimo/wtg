document.addEventListener("DOMContentLoaded", function () {
    toggleCustomQuoteFields();
    toggleTripTypeFields();

    const quoteTypeRadios = document.getElementsByName("quote-type");
    const tripTypeRadios = document.getElementsByName("trip-type");
    const additionalHoursCheckbox = document.getElementById("include-additional-hours");
    const byobCheckbox = document.getElementById("include-byob");

    quoteTypeRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            toggleCustomQuoteFields();
        });
    });

    tripTypeRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            toggleTripTypeFields();
        });
    });

    additionalHoursCheckbox.addEventListener("change", function () {
        toggleAdditionalHoursFields();
    });

    byobCheckbox.addEventListener("change", function () {
        toggleBYOBFields();
    });
});

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
        baseRateField.style.display = "none"; // Hide base rate input for hourly trips
        hoursField.parentElement.style.display = "block"; // Show hours input for hourly trips
    } else if (tripType === "one-way" || tripType === "two-way") {
        customQuoteFields.style.display = "block"; // Show custom fields for one-way and two-way trips
        customQuoteHoursBYOB.style.display = "none"; // Hide BYOB fields
        includeMinHoursPolicy.style.display = "none"; // Hide min hours policy
        baseRateField.style.display = "block"; // Show base rate input for one-way and two-way trips
        hoursField.value = ""; // Clear hours input value
        hoursField.parentElement.style.display = "none"; // Hide hours input for one-way and two-way trips
    }
}



function calculateQuote() {
    const name = document.getElementById("name").value || "Customer";
    const vehicleAvailable = document.getElementById("vehicle-available").checked;
    const includeAlcoholPolicy = document.getElementById("include-alcohol-policy").checked;
    const includeAlcoholPolicyCustom = document.getElementById("include-alcohol-policy-custom").checked;
    const includeMinHoursPolicy = document.getElementById("include-min-hours-policy").checked;
    const vehicleType = document.getElementById("vehicle").value;
    const hours = parseInt(document.getElementById("hours").value) || 0; // Default to 0 if undefined
    const includeAlcohol = document.getElementById("include-alcohol").checked;
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;
    const includeAdditionalHours = document.getElementById("include-additional-hours").checked;
    const includeBYOB = document.getElementById("include-byob").checked;
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;

    const dateInput = document.getElementById("date").value || "Not specified";
    let formattedDate = "Not specified";
    if (dateInput !== "Not specified") {
        const date = new Date(dateInput);
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
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
            vehicleLink = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case "trolley_fusion_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Fusion";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case "trolley_bliss_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Bliss";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
            vehicleLink = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
            hasRearBalcony = true;
            break;
        case "trolley_classic_30":
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Classic";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
            break;
        case "trolley_festive_24":
            baseRate = 1495;
            gasFee = 125;
            vehicleName = "Trolley Festive";
            paxNumber = 24;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-rental.php";
            hasRearBalcony = true;
            break;
        case "partybus_dove_40":
            baseRate = 1795;
            minHours = 5;
            gasFee = 250;
            vehicleName = "Party Bus - Dove";
            paxNumber = 40;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
            vehicleLink = "https://wtglimo.com/chicago-party-bus-rental.php";
            break;
        case "partybus_nightrider_30":
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Night Rider";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
            vehicleLink = "https://wtglimo.com/libertyville-party-bus-rental.php";
            break;
        case "partybus_eagle_25":
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Eagle";
            paxNumber = 25;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
            vehicleLink = "https://wtglimo.com/Palatine-party-bus-rental.php";
            break;
        case "partybus_whitehawk_20":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Party Bus - White Hawk";
            paxNumber = 20;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png";
            vehicleLink = "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php";
            break;
        case "pink_hummer_h2":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Hummer H2";
            paxNumber = 18;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.png";
            vehicleLink = "https://wtglimo.com/hummer_pink_panther.php";
            break;
        case "pink_chrysler_300":
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Chrysler 300";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png";
            vehicleLink = "https://wtglimo.com/pink-limo-rental-Chicago.php";
            break;
        case "christmas_trolley":
            baseRate = 1495;
            gasFee = 150;
            vehicleName = "Christmas Trolley";
            paxNumber = "24-36";
            displayBaseRate = `$${baseRate.toLocaleString()}`;
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
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png";
            vehicleLink = "https://wtglimo.com/limo-van.php";
            break;
        case "sprinter_shuttle_van":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Sprinter Shuttle Van";
            paxNumber = 14;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png";
            vehicleLink = "https://wtglimo.com/sprinter_shuttle_van.php";
            break;
        case "hummer_h2_stretch_limo":
            baseRate = 350 * minHours;
            gasFee = 150;
            additionalHourRate = 300;
            vehicleName = "Hummer H2 Stretch Limo";
            paxNumber = 20;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png";
            vehicleLink = "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php";
            break;
        case "chrysler_300_limo":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Chrysler 300 Limo";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php";
            break;
        case "lincoln_mkt_limo":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Lincoln MKT Limo";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php";
            break;
        case "lincoln_navigator":
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Lincoln Navigator";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png";
            vehicleLink = "https://wtglimo.com/lincoln-navigator-limo.php";
            break;
        case "cadillac_escalade":
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Cadillac Escalade";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png";
            vehicleLink = "https://wtglimo.com/cadillac-escalade-limo.php";
            break;
        case "chevrolet_suburban":
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Chevrolet Suburban";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png";
            vehicleLink = "https://wtglimo.com/suv-limo-rental.php";
            break;
        case "lincoln_mkz":
            baseRate = 150 * minHours;
            gasFee = 50;
            additionalHourRate = 100;
            vehicleName = "Lincoln MKZ";
            paxNumber = 4;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png";
            vehicleLink = "https://wtglimo.com/limo-car-service.php";
            break;
        case "coach_bus_super":
            baseRate = 1200;
            minHours = 4;
            gasFee = 500;
            vehicleName = "Coach Bus - Super";
            hasRestroom = true;
            paxNumber = 50;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png";
            vehicleLink = "https://wtglimo.com/chicago-Super-Coach-Bus.php";
            break;
        case "coach_bus_rentals":
            baseRate = 1000;
            minHours = 4;
            gasFee = 400;
            vehicleName = "Motor Coach - Everywhere";
            hasRestroom = true;
            paxNumber = 56;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png";
            vehicleLink = "https://wtglimo.com/chicago_coach_bus.php";
            break;
        case "coach_bus_corporate":
            baseRate = 1500;
            minHours = 4;
            gasFee = 600;
            vehicleName = "Coach Bus - Corporate";
            paxNumber = 42;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png";
            vehicleLink = "https://wtglimo.com/executive_shuttle_bus.php";
            break;
        case "coach_bus_crystal":
            baseRate = 1300;
            minHours = 4;
            gasFee = 500;
            vehicleName = "Coach Bus - Crystal";
            paxNumber = 25;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
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
            if (hours < minHours) {
                alert(`Minimum hours for ${vehicleName} is ${minHours}.`);
                return;
            }
    
            // Get base rate and gas fee for hourly custom quote
            baseRate = parseInt(document.getElementById("custom-base-rate").value) || 0;
            gasFee = parseInt(document.getElementById("custom-gas-fee").value) || 0;
    
            // Calculate additional hours cost if included
            if (includeAdditionalHours) {
                customAdditionalHours = parseInt(document.getElementById("custom-additional-hours").value) || 0;
                customRateAdditional = parseInt(document.getElementById("custom-rate-additional").value) || 0;
                totalAdditionalCost = customAdditionalHours * customRateAdditional;
                totalHours += customAdditionalHours;
            }
    
            // Calculate BYOB cost if included
            if (includeBYOB) {
                const customBYOBHours = parseInt(document.getElementById("custom-byob-hours").value) || 0;
                const customRateBYOB = parseInt(document.getElementById("custom-rate-byob").value) || 0;
                totalBYOBCost = customBYOBHours * customRateBYOB;
            }
    
            // Calculate base rate based on the number of hours
            baseRate *= hours;
            perHourRate = baseRate / hours;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
        } else if (tripType === "one-way" || tripType === "two-way") {
            // Specific logic for one-way trip calculation
            baseRate = parseInt(document.getElementById("custom-base-rate").value) || 0;
            gasFee = parseInt(document.getElementById("custom-gas-fee").value) || 0;
            totalAdditionalCost = 0; // No additional hours for one-way trip
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            minHours = 0;
        }
    } else {
        // Existing logic for preset quotes...
        // Assuming we have predefined data for preset quotes
    
        // Example vehicle data structure
        const presetVehicleRates = {
            "trolley_midnight_36": { baseRate: 1800, minHours: 4, gasFee: 250 },
            "trolley_fusion_30": { baseRate: 1600, minHours: 4, gasFee: 175 },
            // Add more vehicles as needed
        };
    
        // Fetching details for the selected vehicle
        const vehicleDetails = presetVehicleRates[vehicleType];
    
        if (vehicleDetails) {
            baseRate = vehicleDetails.baseRate;
            minHours = vehicleDetails.minHours;
            gasFee = vehicleDetails.gasFee;
    
            if (hours < minHours) {
                alert(`Minimum hours for ${vehicleName} is ${minHours}.`);
                return;
            }
    
            // Calculate total base rate
            baseRate *= hours;
    
            // Calculate other costs like STC, gratuity, etc.
            const stc = (baseRate * stcPercentage) / 100;
            const gratuity = (baseRate * gratuityPercentage) / 100;
            const total = baseRate + stc + gratuity + gasFee + securityGuardFee; // Add other fees as necessary
    
            // Display the calculated quote details
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            perHourRate = baseRate / hours;
        } else {
            alert("Invalid vehicle type selected.");
            return;
        }
    }
    

    // Calculate security guard fee if alcohol is included and the vehicle has more than 15 passengers
    if (includeAlcohol && paxNumber > 15 && quoteType !== "custom") {
        securityGuardFee = 250; // Base fee for 4 hours
        if (totalHours > 4) {
            securityGuardFee += (totalHours - 4) * 35; // Additional fee for extra hours
        }
    }

    if (hours < minHours) {
        alert(`Minimum hours for ${vehicleName} is ${minHours}.`);
        return;
    }

    // Calculate total cost
    const totalBaseRate = baseRate; // Base rate covers the specified hours
    const stc = (totalBaseRate * stcPercentage) / 100;
    const gratuity = (totalBaseRate * gratuityPercentage) / 100;
    const total = totalBaseRate + stc + gratuity + gasFee + securityGuardFee + totalAdditionalCost + totalBYOBCost; // Include additional custom hours cost

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <div id="quote-content">
          <p class="intro-para">
            Hello <strong>${name}</strong>,<br><br>
            Thank you for choosing <strong>WAYTOGO Trolley & Charter Bus</strong>. ${availabilityMessage} Please review the quote below and make your reservation online.
          </p>
          <h2 class="vehicle-name">${vehicleName} <span class="vehicle-recommeded"> ${
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
                    tripType === "one-way" ? "One Way Trip" :
                    "Two Ways Trip"
                  } <span class="byob-text">${
                    includeMinHoursPolicy && tripType === "hourly" ? `(Minimum Required)` : ''
                  }</span></strong></p>
                  <p>Base Rate: ${displayBaseRate} ${
                    tripType === "hourly" ? `<span class="byob-text">(${hours} hrs @ $${perHourRate.toFixed(2)} per hour)</span>` : ''
                  }</p>
                  <ul>
                      <li>STC: ${stcPercentage}%</li>
                      <li>Gratuity: ${gratuityPercentage}%</li>
                      <li>Gas Fee: $${gasFee.toFixed(2)}</li>
                      ${
                        securityGuardFee > 0
                          ? `<li>BYOB Security Guard Fee: $${securityGuardFee.toLocaleString()}</li>`
                          : ""
                      }
                      ${
                        totalBYOBCost > 0
                          ? `<li>BYOB Security Cost: $${totalBYOBCost.toLocaleString()} <span class="byob-text">(Chicago Trips Only)</span></li>`
                          : ""
                      }
                      ${
                        totalAdditionalCost > 0
                          ? `<li>Additional Hours Cost: $${totalAdditionalCost.toLocaleString()} <span class="byob-text">(${customAdditionalHours} hrs @ $${customRateAdditional})</span></li>`
                          : ""
                      }
                  </ul>
                  <p class="total"><strong>Total: $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}<span class="byob-text"> (All Inclusive)</span></strong></p>
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
    // Create a range object and set it to the content to be copied
    const range = document.createRange();
    range.selectNode(quoteContent);

    // Clear any existing selection and add the new range to the selection
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Copy the selected content to the clipboard
    try {
      document.execCommand("copy");
      alert("Quote copied to clipboard!");
    } catch (err) {
      alert("Failed to copy the quote. Please try again.");
    }

    // Remove the selection
    selection.removeAllRanges();
  } else {
    alert("No quote available to copy.");
  }
}
