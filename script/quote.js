function calculateQuote() {
    const name = document.getElementById('name').value || "Customer";
    const vehicleType = document.getElementById('vehicle').value;
    const hours = parseInt(document.getElementById('hours').value);

    let baseRate = 0;
    let minHours = 4;
    let gasFee = 0;
    let additionalHourRate = 300;
    let stcPercentage = 10;
    let gratuityPercentage = 15;
    let vehicleName = "";
    let displayBaseRate = '';
    let imageUrl = '';
    let videoThumbnail = '';
    let videoUrl = '';
    let vehicleLink = '';
    let hasRearBalcony = false;

    switch (vehicleType) {
        case 'trolley_midnight_36':
            baseRate = 1795;
            gasFee = 250;
            vehicleName = "Trolley Midnight 36 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
            videoThumbnail = "https://img.youtube.com/vi/Eh7lsDRmXrM/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=Eh7lsDRmXrM";
            vehicleLink = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case 'trolley_fusion_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Fusion 30 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
            hasRearBalcony = true;
            break;
        case 'trolley_bliss_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Bliss 30 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
            videoThumbnail = "https://img.youtube.com/vi/Eh7lsDRmXrM/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=Eh7lsDRmXrM";
            vehicleLink = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
            hasRearBalcony = true;
            break;
        case 'trolley_classic_30':
            baseRate = 1695;
            gasFee = 175;
            vehicleName = "Trolley Classic 30 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
            vehicleLink = "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
            break;
        case 'trolley_festive_24':
            baseRate = 1495;
            gasFee = 125;
            vehicleName = "Trolley Festive 24 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
            videoThumbnail = "https://img.youtube.com/vi/0yIzkD9YpFg/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=0yIzkD9YpFg";
            vehicleLink = "https://wtglimo.com/Chicago-trolley-rental.php";
            hasRearBalcony = true;
            break;
        case 'partybus_dove_40':
            baseRate = 1795;
            minHours = 5;
            gasFee = 250;
            vehicleName = "Party Bus - Dove 40 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
            videoThumbnail = "https://img.youtube.com/vi/k9SZ9-sPp6U/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=k9SZ9-sPp6U";
            vehicleLink = "https://wtglimo.com/chicago-party-bus-rental.php";
            break;
        case 'partybus_snowwhite_40':
            baseRate = 1795;
            minHours = 5;
            gasFee = 250;
            vehicleName = "Party Bus - Snow White 40 Pax";
            displayBaseRate = `$${baseRate.toFixed(2)}`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/snowWhite-main.png";
            videoThumbnail = "https://img.youtube.com/vi/Gm9ke7D-Tlg/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=Gm9ke7D-Tlg";
            vehicleLink = "https://wtglimo.com/naperville-party-bus-rental.php";
            break;
        case 'partybus_nightrider_30':
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Night Rider 30 Pax";
            displayBaseRate = `$350/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
            videoThumbnail = "https://img.youtube.com/vi/_AkcW5SWvcw/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=_AkcW5SWvcw";
            vehicleLink = "https://wtglimo.com/libertyville-party-bus-rental.php";
            break;
        case 'partybus_eagle_25':
            baseRate = 350 * minHours;
            gasFee = 125;
            additionalHourRate = 300;
            vehicleName = "Party Bus - Eagle 25 Pax";
            displayBaseRate = `$350/hr`;
            imageUrl = "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
            videoThumbnail = "https://img.youtube.com/vi/_AkcW5SWvcw/0.jpg";
            videoUrl = "https://www.youtube.com/watch?v=_AkcW5SWvcw";
            vehicleLink = "https://wtglimo.com/Palatine-party-bus-rental.php";
            break;
        case 'partybus_whitehawk_20':
            baseRate = 295 * minHours;
            gasFee = 120;
            additionalHourRate = 250;
            vehicleName = "Party Bus - White Hawk 20 Pax";
            displayBaseRate = `$295/hr`;
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

    const additionalHours = hours > minHours ? hours - minHours : 0;
    const additionalCost = additionalHours * additionalHourRate;
    const totalBaseRate = baseRate; // Base rate covers the minimum hours

    const stc = (totalBaseRate * stcPercentage) / 100;
    const gratuity = (totalBaseRate * gratuityPercentage) / 100;
    const total = totalBaseRate + stc + gratuity + gasFee + additionalCost; // Adding additional hours cost to the total

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div id="quote-content">
            <p class="intro-para">Hi ${name}, Great Choice. ${vehicleName} is available at the time of this quote.</p>
            <div class="vehicle-name-link"><h2 class="vehicle-name">${vehicleName}</h2>
            <p><a href="${vehicleLink}" target="_blank">(View this Vehicle)</a></p></div>
            <div class="details">
                <p class="paragraph-padding"><strong>Vehicle Details:</strong> Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats${hasRearBalcony ? ', Rear Balcony' : ''}, Ice & Water.</p>
                <p><strong>Quote Includes:</strong> Unlimited stops & mileage, gratuity, all fees, fuel and service charges.</p>
                <div class="quote-info">
                    <p><strong>Quote: ${hours} Hour Package</strong></p>
                    <p>Base Rate: ${displayBaseRate} upto ${minHours} hours</p>
                    ${additionalHours > 0 ? `<p>Additional Hours: ${additionalHours} hour(s) @ $${additionalHourRate}/hour</p>` : ''}
                    <p>STC: ${stcPercentage}%</p>
                    <p>Gratuity: ${gratuityPercentage}%</p>
                    <p>Gas Fee: $${gasFee.toFixed(2)}</p>
                    <p class="total"><strong>Total: $${total.toFixed(2)}</strong></p>
                </div>
                <div class="paragraph-padding">
                    <p><strong>Alcohol Policy </strong><span id="security-guard">(Security Guard Needed For Chicago Trips Only)</span><p>
                    <p>For vehicles over 15 passengers, a security guard is needed if there is alcohol on board. Security guard charge is an <strong>additional $250.00 (4hr required minimum).</strong> Each additional hour is $35.00</p>
                </div>
                <p class="paragraph-padding"><strong>Availability:</strong> The requested vehicle is available at the time of this quote. Act Fast. The quote is good for 14 days.</p>
                <p><strong>How Do I Reserve?</strong> A 20% deposit is required to make the reservation. The deposit amount will be credited towards the final payment. The remaining balance is due 14 days prior to the event. Credit card processing fee is 3.75%.</p>
            </div>
            <div class="reserve-btn">
                <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>
            </div>
            <div class="image-container">
                <img src="${imageUrl}" alt="${vehicleName}" />
            </div>
            ${videoThumbnail ? `
            <div class="video-container">
                <a href="${videoUrl}" target="_blank">
                    <img src="${videoThumbnail}" alt="Watch ${vehicleName} video" />
                    <div class="play-button"></div>
                </a>
            </div>` : ''}
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
