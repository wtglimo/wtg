const vehicles = window.VEHICLES_DATA || {};

function getVehicleDisplayName(vehicleInfo, fallbackLabel) {
  if (!vehicleInfo) {
    return fallbackLabel || "Unknown Vehicle";
  }

  return vehicleInfo.pax
    ? `${vehicleInfo.quoteName} (${vehicleInfo.pax} Passengers)`
    : vehicleInfo.quoteName;
}

function generateMessage() {
  const name = document.getElementById('name').value;
  const vehicleSelect = document.getElementById('vehicle');
  const vehicleKey = vehicleSelect.options[vehicleSelect.selectedIndex].value;
  const vehicleLabel = vehicleSelect.options[vehicleSelect.selectedIndex].text;
  const price = parseFloat(document.getElementById('price').value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const reserveLink = "https://wtglimo.com/reservation-limo.php";
  const vehicleInfo = vehicles[vehicleKey] || null;
  const vehicleName = getVehicleDisplayName(vehicleInfo, vehicleLabel);
  const vehicleImageUrl = vehicleInfo?.imageUrl || "https://example.com/default.jpg";
  const vehicleLink = vehicleInfo?.vehicleLink || "";
  const vehicleNameMarkup = vehicleLink
    ? `<a href="${vehicleLink}" class="highlight vehicleName" target="_blank">${vehicleName}</a>`
    : `<span class="highlight vehicleName">${vehicleName}</span>`;
  const vehicleLinkMarkup = vehicleLink
    ? `<p><a href="${vehicleLink}" class="highlight btm-mrg-xl" target="_blank">View More</a></p>`
    : "";

  const message = `
    <p>Hi ${name},</p><br>
    <p class="btm-mrg">The quote of <span class="highlight">$${price}</span> for ${vehicleNameMarkup} is <strong>expiring soon.</strong> Please make your reservation online and get <strong>5% OFF.</strong> Coupon Code: WTGONL5</p>
    <p><img src="${vehicleImageUrl}" alt="${vehicleName}" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); width: 100%; height: auto; object-fit: cover;"></p>
    ${vehicleLinkMarkup}
    <p class="btm-mrg-xxl">A 20% deposit is required to hold the vehicle. The availability is limited. </p>
    <p class="btm-mrg-xl">Secure your vehicle now!.</p>
    <p><a href="${reserveLink}" class="book-now" target="_blank">RESERVE NOW</a></p>
    <hr>
  `;

  document.getElementById('output').innerHTML = message;
}

function copyMessage() {
  const outputDiv = document.getElementById('output');
  const range = document.createRange();
  range.selectNodeContents(outputDiv);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  selection.removeAllRanges();
}
