function calculateQuote() {
    const name = document.getElementById('name').value || "Customer";
    const vehicleType = document.getElementById('vehicle').value;
    const hours = parseInt(document.getElementById('hours').value);
    const includeAlcohol = document.getElementById('include-alcohol').checked;

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
        default:
            alert("Invalid vehicle type selected.");
            return;
    }

    if (hours < minHours) {
        alert(`Minimum hours for ${vehicleName} is ${minHours}.`);
        return;
    }

    // Calculate security guard fee if alcohol is included and the vehicle has more than 15 passengers
    if (includeAlcohol && paxNumber > 15) {
        securityGuardFee = 250; // Base fee for 4 hours
        if (hours > 4) {
            securityGuardFee += (hours - 4) * 35; // Additional fee for extra hours
        }
    }

    const additionalHours = hours > minHours ? hours - minHours : 0;
    const additionalCost = additionalHours * additionalHourRate;
    const totalBaseRate = baseRate; // Base rate covers the minimum hours

    const stc = (totalBaseRate * stcPercentage) / 100;
    const gratuity = (totalBaseRate * gratuityPercentage) / 100;
    const total = totalBaseRate + stc + gratuity + gasFee + additionalCost + securityGuardFee; // Adding additional hours cost and security guard fee to the total

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div id="quote-content">
            <p class="intro-para">Hi ${name}, Great Choice. ${vehicleName} is available at the time of this quote.</p>
            <h2 class="vehicle-name">${vehicleName}</h2>
            <div class="image-container">
                <img src="${imageUrl}" alt="${vehicleName}" />
            </div>
            <div class="vehicle-name-link">
                <p><a href="${vehicleLink}" target="_blank">(View this Vehicle)</a></p>
            </div>
            <div class="details">
                <p class="paragraph-padding"><strong>Vehicle Details:</strong> ${paxNumber} Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats${hasRearBalcony ? ', Rear Balcony' : ''}, Ice & Water.</p>
                <p><strong>Quote Includes:</strong> Unlimited stops & mileage, gratuity, all fees, fuel and service charges.</p>
                <div class="quote-info">
                    <p class="quote-heading"><strong>Quote: ${hours} Hour Package</strong></p>
                    <p>Base Rate: ${displayBaseRate} upto ${minHours} hours</p>
                    ${additionalHours > 0 ? `<p>Additional Hours: ${additionalHours} hour(s) @ $${additionalHourRate.toLocaleString()}/hour</p>` : ''}
                    <p>STC: ${stcPercentage}%</p>
                    <p>Gratuity: ${gratuityPercentage}%</p>
                    <p>Gas Fee: $${gasFee.toFixed(2)}</p>
                    ${securityGuardFee > 0 ? `<p>BYOB Security Guard Fee: $${securityGuardFee.toLocaleString()}</p>` : ''}
                    <p class="total"><strong>Total: $${total.toLocaleString()}</strong></p>
                </div>
                <p class="paragraph-padding"><strong>Availability:</strong> The requested vehicle is available at the time of this quote. Act Fast. The quote is good for 14 days.</p>
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
    window.getSelection().removeAllRanges(); // Clear any existing selection
    window.getSelection().addRange(range);   // Select the text within the quoteContent
    document.execCommand('copy');            // Copy the selected text to the clipboard
    window.getSelection().removeAllRanges(); // Clear the selection
    alert("Quote copied to clipboard!");
}
