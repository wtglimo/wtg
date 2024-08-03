document.addEventListener('DOMContentLoaded', function() {
    const quoteTypeRadios = document.getElementsByName('quote-type');
    quoteTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleCustomQuoteFields();
        });
    });
});

function toggleCustomQuoteFields() {
    const customQuoteFields = document.getElementById('custom-quote-fields');
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;
    if (quoteType === 'custom') {
        customQuoteFields.style.display = 'block';
    } else {
        customQuoteFields.style.display = 'none';
    }
}

function calculateQuote() {
    const name = document.getElementById('name').value || "Customer";
    const vehicleType = document.getElementById('vehicle').value;
    const hours = parseInt(document.getElementById('hours').value);
    const includeAlcohol = document.getElementById('include-alcohol').checked;
    const quoteType = document.querySelector('input[name="quote-type"]:checked').value;

    let baseRate = 0;
    let minHours = 4;
    let gasFee = 0;
    let additionalHourRate = 300;
    let stcPercentage = 10;
    let gratuityPercentage = 15;
    let securityGuardFee = 0;
    let vehicleName = "";
    let paxNumber = 0;
    let displayBaseRate = '';
    let imageUrl = '';
    let vehicleLink = '';
    let hasRearBalcony = false;
    let hasRestroom = false;

    // Fetch vehicle data regardless of quote type
    switch (vehicleType) {
        case 'trolley_midnight_36':
            baseRate = 1795;
            gasFee = 250;
            vehicleName = "Trolley Midnight";
            paxNumber = 36;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
            vehicleLink = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case 'trolley_fusion_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Fusion";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case 'trolley_bliss_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Bliss";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
            vehicleLink = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
            hasRearBalcony = true;
            break;
        case 'trolley_classic_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Classic";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
            break;
        case 'trolley_festive_24':
            baseRate = 1495;
            gasFee = 125;
            vehicleName = "Trolley Festive";
            paxNumber = 24;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-rental.php";
            hasRearBalcony = true;
            break;
        case 'partybus_dove_40':
            baseRate = 1795;
            minHours = 5;
            gasFee = 250;
            vehicleName = "Party Bus - Dove";
            paxNumber = 40;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
            vehicleLink = "https://wtglimo.com/chicago-party-bus-rental.php";
            break;
        case 'partybus_snowwhite_40':
            baseRate = 1795;
            minHours = 5;
            gasFee = 250;
            vehicleName = "Party Bus - Snow White";
            paxNumber = 40;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/snowWhite-main.png";
            vehicleLink = "https://wtglimo.com/naperville-party-bus-rental.php";
            break;
        case 'partybus_nightrider_30':
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Night Rider";
            paxNumber = 30;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
            vehicleLink = "https://wtglimo.com/libertyville-party-bus-rental.php";
            break;
        case 'partybus_eagle_25':
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Eagle";
            paxNumber = 25;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
            vehicleLink = "https://wtglimo.com/Palatine-party-bus-rental.php";
            break;
        case 'partybus_whitehawk_20':
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Party Bus - White Hawk";
            paxNumber = 20;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png";
            vehicleLink = "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php";
            break;
        case 'pink_hummer_h2':
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Hummer H2";
            paxNumber = 18;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.png";
            vehicleLink = "https://wtglimo.com/hummer_pink_panther.php";
            break;
        case 'pink_chrysler_300':
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Pink Chrysler 300";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png";
            vehicleLink = "https://wtglimo.com/pink-limo-rental-Chicago.php";
            break;
        case 'christmas_trolley':
            baseRate = 1495;
            gasFee = 150;
            vehicleName = "Christmas Trolley";
            paxNumber = "24-36";
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png";
            vehicleLink = "https://wtglimo.com/Christmas-trolley-tours-Chicago.php";
            hasRearBalcony = true;
            break;
        case 'ford_transit_limo':
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Ford Transit Limo";
            paxNumber = 15;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png";
            vehicleLink = "https://wtglimo.com/limo-van.php";
            break;
        case 'sprinter_shuttle_van':
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Sprinter Shuttle Van";
            paxNumber = 14;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png";
            vehicleLink = "https://wtglimo.com/sprinter_shuttle_van.php";
            break;
        case 'hummer_h2_stretch_limo':
            baseRate = 350 * minHours;
            gasFee = 150;
            additionalHourRate = 300;
            vehicleName = "Hummer H2 Stretch Limo";
            paxNumber = 20;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png";
            vehicleLink = "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php";
            break;
        case 'chrysler_300_limo':
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Chrysler 300 Limo";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php";
            break;
        case 'lincoln_mkt_limo':
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Lincoln MKT Limo";
            paxNumber = 10;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png";
            vehicleLink = "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php";
            break;
        case 'lincoln_navigator':
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Lincoln Navigator";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png";
            vehicleLink = "https://wtglimo.com/lincoln-navigator-limo.php";
            break;
        case 'cadillac_escalade':
            baseRate = 250 * minHours;
            gasFee = 100;
            additionalHourRate = 200;
            vehicleName = "Cadillac Escalade";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png";
            vehicleLink = "https://wtglimo.com/cadillac-escalade-limo.php";
            break;
        case 'chevrolet_suburban':
            baseRate = 200 * minHours;
            gasFee = 80;
            additionalHourRate = 150;
            vehicleName = "Chevrolet Suburban";
            paxNumber = 7;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png";
            vehicleLink = "https://wtglimo.com/suv-limo-rental.php";
            break;
        case 'lincoln_mkz':
            baseRate = 150 * minHours;
            gasFee = 50;
            additionalHourRate = 100;
            vehicleName = "Lincoln MKZ";
            paxNumber = 4;
            displayBaseRate = `$${baseRate.toLocaleString()}/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png";
            vehicleLink = "https://wtglimo.com/limo-car-service.php";
            break;
        case 'coach_bus_super':
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
        case 'coach_bus_rentals':
            baseRate = 1000;
            minHours = 4;
            gasFee = 400;
            vehicleName = "Coach Bus - Everywhere";
            hasRestroom = true;
            paxNumber = 56;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png";
            vehicleLink = "https://wtglimo.com/chicago_coach_bus.php";
            break;
        case 'coach_bus_corporate':
            baseRate = 1500;
            minHours = 4;
            gasFee = 600;
            vehicleName = "Coach Bus - Corporate";
            paxNumber = 42;
            displayBaseRate = `$${baseRate.toLocaleString()}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png";
            vehicleLink = "https://wtglimo.com/executive_shuttle_bus.php";
            break;
        case 'coach_bus_crystal':
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
    let totalHours = hours;
    if (quoteType === 'custom') {
        minHours = 1; // Set minimum hours to 1 for custom quotes
        baseRate = parseInt(document.getElementById('custom-base-rate').value) || 0;
        gasFee = parseInt(document.getElementById('custom-gas-fee').value) || 0;
        const customAdditionalHours = parseInt(document.getElementById('custom-additional-hours').value) || 0;
        const customRateAdditional = parseInt(document.getElementById('custom-rate-additional').value) || 0;
        totalAdditionalCost = customAdditionalHours * customRateAdditional;
        baseRate *= hours; // Multiply base rate by the number of hours
        displayBaseRate = `$${baseRate.toLocaleString()}`;
        totalHours += customAdditionalHours; // Add additional hours to total hours
    }

    // Calculate security guard fee if alcohol is included and the vehicle has more than 15 passengers
    if (includeAlcohol && paxNumber > 15) {
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
    const total = totalBaseRate + stc + gratuity + gasFee + securityGuardFee + totalAdditionalCost; // Include additional custom hours cost

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div id="quote-content">
            <p class="intro-para">
                Hello <strong>${name}</strong>,<br><br>
                Thank you for choosing <strong>WAYTOGO</strong>. We're excited to inform you that the vehicle is <strong>available for the requested date</strong>. Please review the quote below and make your reservation online.
            </p>
            <h2 class="vehicle-name">${vehicleName}</h2>
            <div class="image-container">
                <img src="${imageUrl}" alt="${vehicleName}" />
            </div>
            <div class="vehicle-name-link">
                <p><a href="${vehicleLink}" target="_blank">(View More Pictures)</a></p>
            </div>
            <div class="details">
                <p class="paragraph-padding"><strong>Vehicle Details:</strong> ${paxNumber} Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled,${hasRestroom ? ' Restroom,' : ''} Comfortable Perimeter Seats${hasRearBalcony ? ', Rear Balcony' : ''}, Ice & Water.</p>
                <p><strong>Quote Includes:</strong> Unlimited stops & mileage, gratuity, all fees, fuel and service charges.</p>
                <div class="quote-info">
                    <p class="quote-heading"><strong>Quote: ${totalHours} Hour Package</strong></p>
                    <p>Base Rate: ${displayBaseRate} up to ${minHours} hours</p>
                    <ul>
                    <li>STC: ${stcPercentage}%</li>
                    <li>Gratuity: ${gratuityPercentage}%</li>
                    <li>Gas Fee: $${gasFee.toFixed(2)}</li>
                    ${securityGuardFee > 0 ? `<li>BYOB Security Guard Fee: $${securityGuardFee.toLocaleString()}</li>` : ''}
                    ${totalAdditionalCost > 0 ? `<li>Additional Hours Cost: $${totalAdditionalCost.toLocaleString()}</li>` : ''}
                    </ul>
                    <p class="total"><strong>Total: $${total.toLocaleString(undefined, {minimumFractionDigits: 2})}<span class="all-inclusive"> All Inclusive</span></strong></p>
                    <p class="quote-expiry">(The quote expires in 14 days. Act Fast)</p>
                </div>
                <p><strong>How Do I Reserve?</strong> A 20% deposit is required to make the reservation. The deposit amount will be credited towards the final payment. The remaining balance is due 14 days prior to the event. Credit card processing fee is 3.75%.</p>
            </div>
            <div class="reserve-btn">
                <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>
            </div>
            <hr>
        </div>
    `;
}

function copyToClipboard() {
    const quoteContent = document.getElementById('quote-content');
    const range = document.createRange();
    range.selectNode(quoteContent);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert("Quote copied to clipboard!");
}
