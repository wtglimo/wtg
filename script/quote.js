document.addEventListener("DOMContentLoaded", function () {
  toggleTripTypeFields();
  toggleMultipleTripsFields();

  const formElements = document.querySelectorAll(
    "#date, #fixed-gratuity, #fixed-gratuity-option-two, #time, #drop-off-time, #time-option-two, #name, #vehicle, #event-type, #vehicle-option-two, #hours, #hours-option-two, #custom-base-rate, #custom-base-rate-option-two, #custom-gas-fee, #custom-gas-fee-option-two, #include-multiple-opitons",
  );

  formElements.forEach((element) => {
    element.addEventListener("input", calculateQuote);
  });

  const tripTypeRadios = document.getElementsByName("trip-type");

  tripTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      toggleTripTypeFields();
      calculateQuote();
    });
  });

  document
    .getElementById("include-multiple-opitons")
    .addEventListener("change", function () {
      toggleMultipleTripsFields();
      calculateQuote();
    });

  const specialOfferButtons = document.querySelectorAll(".special-offer-btn");

  specialOfferButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
      this.setAttribute(
        "aria-pressed",
        this.classList.contains("active").toString(),
      );
      calculateQuote();
    });
  });
});

function formatNumber(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseCurrencyInput(id) {
  return parseFloat(document.getElementById(id)?.value) || 0;
}

function formatTimeForQuote(value) {
  if (!value) {
    return "Not specified";
  }

  const [hourText, minute] = value.split(":");
  const hour = parseInt(hourText, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;

  return `${twelveHour}:${minute} ${ampm}`;
}

function getQuoteDateParts(dateInput) {
  if (!dateInput) {
    return {
      formattedDate: "Not specified",
      dayOfWeek: "",
    };
  }

  const date = new Date(`${dateInput}T12:00:00`);
  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return {
    formattedDate: `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`,
    dayOfWeek: daysOfWeek[date.getDay()],
  };
}

function getVehicleInfo(vehicleType) {
  return vehicles[vehicleType] || null;
}

const SPECIAL_OFFERS = {
  discount5: {
    title: "5% OFF",
    text: "Use code WTGONL5.",
  },
  fifthHourFree: {
    title: "5th Hour FREE",
    text: "Use code WTG5FREE.",
  },
  nighttimeGuestShuttle: {
    title: "Nighttime Guest Shuttle",
    text: "Add two hours of shuttle service (10:30 PM - 12:30 AM) for $695 plus gratuity/fees.",
  },
};

function getQuoteMeta(tripType, hours) {
  if (tripType === "hourly") {
    return {
      packageLabel: `${hours} Hour Package`,
      quoteIncludes:
        "Unlimited stops & mileage, gratuity, all fees, fuel and service charges.",
    };
  }

  if (tripType === "one-way") {
    return {
      packageLabel: "Transfer <span class='byob-text'>(one-way)</span>",
      quoteIncludes:
        "One way trip, gratuity, all fees, fuel and service charges.",
    };
  }

  return {
    packageLabel: "Round Trip <span class='byob-text'>(to/from)</span>",
    quoteIncludes: "Round trip, gratuity, all fees, fuel and service charges.",
  };
}

function buildDateTimeMarkup(timeLines) {
  return timeLines.map((line) => `<p><small>${line}</small></p>`).join("");
}

function buildBaseRateNote(tripType, twoWaysDisplayRate) {
  if (tripType === "hourly") {
    return `<span class="byob-text">(Base Rate)</span>`;
  }

  if (tripType === "two-way") {
    return `<span class='byob-text'>(${formatNumber(twoWaysDisplayRate)} each way)</span>`;
  }

  return "";
}

function getSelectedSpecialOffers() {
  return Array.from(document.querySelectorAll(".special-offer-btn.active"))
    .map((button) => SPECIAL_OFFERS[button.dataset.offer])
    .filter(Boolean);
}

function buildSpecialOffersTermsMarkup(selectedSpecialOffers) {
  if (!selectedSpecialOffers.length) {
    return "";
  }

  const selectedOfferItems = selectedSpecialOffers
    .map(
      (offer) => `<li><strong>${offer.title}:</strong> ${offer.text}</li>`,
    )
    .join("");

  return `
    <div class="quote-summary-section">
      <p class="quote-section-heading"><strong>Special Offer:</strong> <span class="special-offer-expiry">Expires in 14 days</span></p>
      <ul class="quote-summary-list">
        ${selectedOfferItems}
      </ul>
    </div>
  `;
}

function buildQuoteOptionMarkup({
  vehicle,
  dayOfWeek,
  formattedDate,
  timeLines,
  packageLabel,
  displayBaseRate,
  fixedGratuity,
  gasFee,
  total,
  quoteIncludes,
  tripType,
  twoWaysDisplayRate,
  reserveLabel,
  specialOffersTermsMarkup,
}) {
  const baseRateNote = buildBaseRateNote(tripType, twoWaysDisplayRate);
  const vehiclePaxMarkup = `<span class="byob-text">(${vehicle.pax} PAX)</span>`;
  const vehicleLinkMarkup = vehicle.vehicleLink
    ? `
    <div class="vehicle-name-link">
      <p><a href="${vehicle.vehicleLink}" target="_blank">(View More Pictures)</a></p>
    </div>`
    : "";

  return `
    <h2 class="vehicle-name">${vehicle.quoteName} ${vehiclePaxMarkup}</h2>
    <p><strong>Vehicle Details: </strong>${vehicle.details}</p>
    <div class="image-container">
      <img src="${vehicle.imageUrl}" alt="${vehicle.quoteName}" />
    </div>
    ${vehicleLinkMarkup}
    <div class="details">
      <div class="quote-price">
        <div class="quote-vehicle-name">
          <p class="vehicle-name-quote-price">${vehicle.quoteName} ${vehiclePaxMarkup}</p>
        </div>
        <div style="line-height: normal;">
          <div class="quote-datetime">
            ${buildDateTimeMarkup([`${dayOfWeek} ${formattedDate}`, ...timeLines])}
          </div>
        </div>
        <p class="quote-heading"><strong>QUOTE: ${packageLabel}</strong></p>
        <p>Base Rate: ${displayBaseRate} ${baseRateNote}</p>
        <ul>
          <li>STC: 10.00%</li>
          <li>Gratuity: $${formatNumber(fixedGratuity)}</li>
          <li>Gas Fee: $${formatNumber(gasFee)}</li>
        </ul>
        <p class="total"><strong>Total: $${formatNumber(total)}</strong><span class="all-inclusive"> (All-inclusive)</span></p>
        <p class="quote-expiry">(The quote expires in 14 days. Act Fast. <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>)</p>
        </div>
        <div class="quote-summary">
          <div class="quote-summary-section">
            <p class="quote-section-heading"><strong>Quote Details</strong></p>
            <ul class="quote-summary-list">
              <li><strong>Inclusions:</strong> ${quoteIncludes}</li>
              <li><strong>Additional Hourly Rate:</strong> $300 per hour</li>
            </ul>
          </div>
          ${specialOffersTermsMarkup}
          <div class="quote-summary-section">
            <p class="quote-section-heading"><strong>Booking Terms</strong></p>
            <ul class="quote-summary-list">
              <li><strong>Deposit:</strong> A 20% deposit is required to secure your reservation. The remaining balance is due during the week of your service.</li>
              <li><strong>Chicago Trips Only:</strong> Per Chicago ordinance, all BYOB trips require a security guard. Based on your itinerary, we have added security to your booking; please note that additional charges apply for this service.</li>
              <li><strong>Payment Methods:</strong> Avoid the 3.75% credit card processing fee by paying via cash or Zelle.</li>
            </ul>
          </div>
        </div>
      <div class="reserve-btn">
        <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve ${reserveLabel} Now</a>
      </div>
    </div>
  `;
}

function toggleTripTypeFields() {
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked',
  ).value;
  const customQuoteFields = document.getElementById("custom-quote-fields");
  const time = document.getElementById("time-wrapper");
  const customMultipleQuote = document.getElementById(
    "multiple-vehicle-switch-fields",
  );
  const baseRateField = document.getElementById("base-rate");
  const hoursField = document.getElementById("hours");

  customQuoteFields.style.display = "block";
  time.style.display = "block";
  baseRateField.style.display = "block";

  if (tripType === "hourly") {
    hoursField.parentElement.style.display = "block";
    customMultipleQuote.style.display = "block";
    toggleMultipleTripsFields();
  } else {
    hoursField.value = "";
    hoursField.parentElement.style.display = "none";
    customMultipleQuote.style.display = "none";
  }
}

function toggleMultipleTripsFields() {
  const multipleOptionsFields = document.getElementById(
    "multiple-vehile-fields",
  );
  const multipleOptionsCheckbox = document.getElementById(
    "include-multiple-opitons",
  );
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked',
  ).value;

  multipleOptionsFields.style.display =
    tripType === "hourly" && multipleOptionsCheckbox.checked ? "block" : "none";
}

function calculateQuote() {
  const name = document.getElementById("name").value || "Customer";
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked',
  ).value;
  const multipleTripsEnabled =
    tripType === "hourly" &&
    document.getElementById("include-multiple-opitons").checked;
  const secondaryHours =
    parseFloat(document.getElementById("hours-option-two").value) || 0;
  const vehicleType = document.getElementById("vehicle").value;
  const secondaryVehicleType = document.getElementById("vehicle-option-two").value;
  const hours = parseFloat(document.getElementById("hours").value) || 0;
  const eventTypeSelect = document.getElementById("event-type");
  const eventTypeText = toTitleCase(
    eventTypeSelect.options[eventTypeSelect.selectedIndex].text.trim(),
  );
  const { formattedDate, dayOfWeek } = getQuoteDateParts(
    document.getElementById("date").value,
  );
  const time = formatTimeForQuote(document.getElementById("time").value);
  const dropOffTime = formatTimeForQuote(
    document.getElementById("drop-off-time").value,
  );
  const secondaryTime = formatTimeForQuote(
    document.getElementById("time-option-two").value,
  );
  const primaryVehicle = getVehicleInfo(vehicleType);
  const secondaryVehicle = getVehicleInfo(secondaryVehicleType);
  const selectedSpecialOffers = getSelectedSpecialOffers();
  const specialOffersTermsMarkup = buildSpecialOffersTermsMarkup(
    selectedSpecialOffers,
  );

  if (!primaryVehicle || (multipleTripsEnabled && !secondaryVehicle)) {
    alert("Invalid vehicle type selected.");
    return;
  }

  const stcPercentage = 10;
  let baseRate = parseCurrencyInput("custom-base-rate");
  let secondaryBaseRate = multipleTripsEnabled
    ? parseCurrencyInput("custom-base-rate-option-two")
    : 0;
  let gasFee = 0;
  let secondaryGasFee = 0;
  let fixedGratuity = 0;
  let secondaryFixedGratuity = 0;
  const totalHours = tripType === "hourly" ? hours : 0;
  let twoWaysDisplayRate = 0;

  fixedGratuity = parseCurrencyInput("fixed-gratuity");
  secondaryFixedGratuity = multipleTripsEnabled
    ? parseCurrencyInput("fixed-gratuity-option-two")
    : 0;
  gasFee = parseCurrencyInput("custom-gas-fee");
  secondaryGasFee = multipleTripsEnabled
    ? parseCurrencyInput("custom-gas-fee-option-two")
    : 0;

  if (tripType === "two-way") {
    twoWaysDisplayRate = baseRate;
    baseRate *= 2;
  }

  const stc = (baseRate * stcPercentage) / 100;
  const secondaryStc = (secondaryBaseRate * stcPercentage) / 100;
  const total = baseRate + stc + fixedGratuity + gasFee;
  const secondaryTotal =
    secondaryBaseRate + secondaryStc + secondaryFixedGratuity + secondaryGasFee;
  const { packageLabel, quoteIncludes } = getQuoteMeta(tripType, totalHours);

  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = `
    <div id="message-content">
      <p class="intro-para">
        WAYTOGO TROLLEYS. Dear ${name}, your quote for the ${eventTypeText} Trolley on ${formattedDate} has been sent to your email.
        Please review and make your reservation online. Thank you.
      </p>
    </div>
  `;

  const introCopy = multipleTripsEnabled
    ? "Please review the quote options below and make your reservation online."
    : "Please review the quote below and make your reservation online.";

  const primaryQuoteMarkup = buildQuoteOptionMarkup({
    vehicle: primaryVehicle,
    dayOfWeek,
    formattedDate,
    timeLines: [
      `&nbsp;/ ${time}`,
      `&nbsp;- ${dropOffTime}`,
      `&nbsp;/ ${eventTypeText}`,
    ],
    packageLabel,
    displayBaseRate: `$${formatNumber(baseRate)}`,
    fixedGratuity,
    gasFee,
    total,
    quoteIncludes,
    tripType,
    twoWaysDisplayRate,
    reserveLabel: primaryVehicle.quoteName,
    specialOffersTermsMarkup,
  });

  const secondaryQuoteMarkup = multipleTripsEnabled
    ? buildQuoteOptionMarkup({
        vehicle: secondaryVehicle,
        dayOfWeek,
        formattedDate,
        timeLines: [`&nbsp;/ ${secondaryTime}`],
        packageLabel: `${secondaryHours} Hour Package`,
        displayBaseRate: `$${formatNumber(secondaryBaseRate)}`,
        fixedGratuity: secondaryFixedGratuity,
        gasFee: secondaryGasFee,
        total: secondaryTotal,
        quoteIncludes,
        tripType,
        twoWaysDisplayRate,
        reserveLabel: secondaryVehicle.quoteName,
        specialOffersTermsMarkup,
      })
    : "";

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div id="quote-content">
      <p class="intro-para">
        Hello ${name}, ${primaryVehicle.quoteName} is available. Please review the quote below and proceed with your online reservation.
      </p>
      ${primaryQuoteMarkup}
      ${secondaryQuoteMarkup}
      <hr>
    </div>
  `;
}

function copyById(id) {
  const el = document.getElementById(id);
  if (!el) return alert("No content available to copy.");

  const range = document.createRange();
  range.selectNode(el);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
  } catch {
    alert("Failed to copy. Please try again.");
  }

  selection.removeAllRanges();
}

function copyToClipboard() {
  copyById("quote-content");
}

function copyToClipboardMessage() {
  copyById("message-content");
}

const vehicles = window.VEHICLES_DATA || {};
