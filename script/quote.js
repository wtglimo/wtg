document.addEventListener("DOMContentLoaded", function () {
  toggleCustomQuoteFields();
  toggleTripTypeFields();

  const formElements = document.querySelectorAll(
    "#date, #fixed-gratuity, #fixed-gratuity-option-two, #time, #time-option-two, #name, #slider, #vehicle-available, #vehicle, #vehicle-option-two, #include-min-hours-policy, #include-alcohol-policy, #include-alcohol-policy-custom, #hours, #hours-option-two, #custom-base-rate, #custom-base-rate-option-two, #custom-gas-fee, #custom-gas-fee-option-two, #include-multiple-opitons, #multiple-vehile-fields, #additional-hours-fields, #custom-additional-hours, #custom-rate-additional, #include-byob, #custom-byob-hours, #custom-rate-byob"
  );

  formElements.forEach((element) => {
    element.addEventListener("input", calculateQuote);
  });

  const slider = document.getElementById("slider");

  slider.addEventListener("input", function () {
    preserBaseRate = parseInt(this.value, 10);

    console.log("preserBaseRate is now: " + preserBaseRate);
    calculateQuote(); // Recalculate the quote when slider changes
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

  document
    .getElementById("include-additional-hours")
    .addEventListener("change", function () {
      toggleAdditionalHoursFields();
      calculateQuote();
    });
  document
    .getElementById("include-multiple-opitons")
    .addEventListener("change", function () {
      toggleMultipleTripsFields();
      calculateQuote();
    });

  document
    .getElementById("include-byob")
    .addEventListener("change", function () {
      toggleBYOBFields();
      calculateQuote();
    });

  document
    .getElementById("include-alcohol-policy")
    .addEventListener("change", calculateQuote);
  document
    .getElementById("include-alcohol-policy-custom")
    .addEventListener("change", calculateQuote);
  document.getElementById("vehicle").addEventListener("change", updateRates);
  document.getElementById("date").addEventListener("change", updateRates);
  document.getElementById("time").addEventListener("change", updateRates);

  updateRates(); // Initial call to set rates on page load

  // Add event listener to the date input for live filtering
  document.getElementById("filter-date").addEventListener("input", () => {
    const selectedDate = document.getElementById("filter-date").value;

    // If no date is selected, fetch all quotes
    if (!selectedDate) {
      fetchQuotes(); // Fetch all quotes
    } else {
      fetchQuotes(selectedDate); // Fetch quotes for the selected date
    }
  });

  // Add the fetchQuotes() call here
  fetchQuotes();
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
  const date = new Date(dateInput + "T12:00:00"); // Setting time to noon to avoid any timezone issues
  const dayOfWeek = date.getUTCDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const time = new Date(`1970-01-01T${timeInput}:00Z`).getUTCHours(); // Get hour in UTC to determine time of day

  const rates = {
    trolley_midnight_36: {
      weekday: {
        day: { min: 1695, max: 1695 },
        night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1875, max: 1975 },
        night: { min: 1875, max: 1975, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 2175, max: 2393.75 },
        night: { min: 2175, max: 2393.75, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    trolley_fusion_30: {
      weekday: {
        day: { min: 1695, max: 1695 },
        night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1795, max: 1875 },
        night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 2075, max: 2175 },
        night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    trolley_bliss_30: {
      weekday: {
        day: { min: 1695, max: 1695 },
        night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1795, max: 1875 },
        night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 2075, max: 2175 },
        night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    trolley_classic_30: {
      weekday: {
        day: { min: 1695, max: 1695 },
        night: { min: 1695, max: 1695, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1795, max: 1875 },
        night: { min: 1795, max: 1875, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 2075, max: 2175 },
        night: { min: 2075, max: 2175, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    trolley_festive_24: {
      weekday: {
        day: { min: 1595, max: 1595 },
        night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1695, max: 1795 },
        night: { min: 1695, max: 1795, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 1875, max: 1975 },
        night: { min: 1875, max: 1975, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    coach_bus_super: {
      weekday: {
        day: { min: 1495, max: 1495 },
        night: { min: 1495, max: 1495 },
      },
      friday: {
        day: { min: 1595, max: 1687.5 },
        night: { min: 1595, max: 1687.5 },
      },
      saturday: {
        day: { min: 1595, max: 1687.5 },
        night: { min: 1595, max: 1687.5 },
      },
    },
    coach_bus_rentals: {
      weekday: {
        day: { min: 1495, max: 1495 },
        night: { min: 1495, max: 1495 },
      },
      friday: {
        day: { min: 1595, max: 1687.5 },
        night: { min: 1595, max: 1687.5 },
      },
      saturday: {
        day: { min: 1595, max: 1687.5 },
        night: { min: 1595, max: 1687.5 },
      },
    },
    coach_bus_corporate: {
      weekday: {
        day: { min: 1295, max: 1295 },
        night: { min: 1295, max: 1295 },
      },
      friday: {
        day: { min: 1295, max: 1395 },
        night: { min: 1295, max: 1395 },
      },
      saturday: {
        day: { min: 1395, max: 1495 },
        night: { min: 1395, max: 1495 },
      },
    },
    coach_bus_crystal: {
      weekday: {
        day: { min: 1195, max: 1195 },
        night: { min: 1195, max: 1195 },
      },
      friday: {
        day: { min: 1195, max: 1295 },
        night: { min: 1195, max: 1295 },
      },
      saturday: {
        day: { min: 1195, max: 1295 },
        night: { min: 1195, max: 1295 },
      },
    },
    partybus_dove_40: {
      weekday: {
        day: { min: 1595, max: 1595 },
        night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1795, max: 1895 },
        night: { min: 1795, max: 1895, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 1995, max: 2195 },
        night: { min: 1995, max: 2195, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    partybus_nightrider_30: {
      weekday: {
        day: { min: 1295, max: 1295 },
        night: { min: 1295, max: 1295, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1595, max: 1695 },
        night: { min: 1595, max: 1695, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 1795, max: 1895 },
        night: { min: 1795, max: 1895, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    partybus_eagle_25: {
      weekday: {
        day: { min: 1295, max: 1295 },
        night: { min: 1295, max: 1295, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1495, max: 1595 },
        night: { min: 1495, max: 1595, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 1695, max: 1795 },
        night: { min: 1695, max: 1795, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    partybus_whitehawk_20: {
      weekday: {
        day: { min: 1195, max: 1195 },
        night: { min: 1195, max: 1195, special: { "3hr": 300, "4hr": 250 } },
      },
      friday: {
        day: { min: 1495, max: 1495 },
        night: { min: 1495, max: 1495, special: { "3hr": 300, "4hr": 250 } },
      },
      saturday: {
        day: { min: 1595, max: 1595 },
        night: { min: 1595, max: 1595, special: { "3hr": 300, "4hr": 250 } },
      },
    },
    ford_transit_limo: {
      weekday: {
        day: { min: 795, max: 795 },
        night: { min: 795, max: 795 },
      },
      friday: {
        day: { min: 795, max: 895 },
        night: { min: 795, max: 895 },
      },
      saturday: {
        day: { min: 895, max: 995 },
        night: { min: 895, max: 995 },
      },
    },
    sprinter_shuttle_van: {
      weekday: {
        day: { min: 695, max: 695 },
        night: { min: 695, max: 695 },
      },
      friday: {
        day: { min: 795, max: 795 },
        night: { min: 795, max: 795 },
      },
      saturday: {
        day: { min: 795, max: 895 },
        night: { min: 795, max: 895 },
      },
    },
    pink_hummer_h2: {
      weekday: {
        day: { min: 995, max: 995 },
        night: { min: 995, max: 995 },
      },
      friday: {
        day: { min: 1095, max: 1195 },
        night: { min: 1095, max: 1195 },
      },
      saturday: {
        day: { min: 1295, max: 1375 },
        night: { min: 1295, max: 1375 },
      },
    },
    pink_chrysler_300: {
      weekday: {
        day: { min: 795, max: 795 },
        night: { min: 795, max: 795 },
      },
      friday: {
        day: { min: 875, max: 875 },
        night: { min: 875, max: 875 },
      },
      saturday: {
        day: { min: 875, max: 995 },
        night: { min: 875, max: 995 },
      },
    },
    christmas_trolley: {
      weekday: {
        day: { min: 1595, max: 1595 },
        night: { min: 1595, max: 1595 },
      },
      friday: {
        day: { min: 1595, max: 1695 },
        night: { min: 1595, max: 1695 },
      },
      saturday: {
        day: { min: 1595, max: 1695 },
        night: { min: 1595, max: 1695 },
      },
    },
  };

  const vehicleRates = rates[vehicleType] || {};
  let dayType = "weekday";
  if (dayOfWeek === 5) {
    // Friday
    dayType = "friday";
  } else if (dayOfWeek === 6) {
    // Saturday
    dayType = "saturday";
  }

  let timeOfDay = "day";
  let timePeriod = "before 6pm";
  if (time >= 18 || time < 4) {
    timeOfDay = "night";
    timePeriod = "after 6pm";
  }

  const selectedRates = (vehicleRates[dayType] &&
    vehicleRates[dayType][timeOfDay]) || { min: 0, max: 0 };
  const specialRates = selectedRates.special || null;
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const selectedDay = dayNames[dayOfWeek];

  document.getElementById(
    "selected-day"
  ).textContent = `${selectedDay} (${timePeriod})`;

  if (timeOfDay === "night" && specialRates) {
    document.getElementById("min-max-rates").innerHTML = `
            <p>3hr: $${specialRates["3hr"]}/hr</p>
            <p>4hr: $${specialRates["4hr"]}/hr</p>
        `;
  } else {
    document.getElementById("min-max-rates").innerHTML = `
            <p>High: <span id="max-rate">$${selectedRates.max.toFixed(
              2
            )}</span></p>
            <p>Low: <span id="min-rate">$${selectedRates.min.toFixed(
              2
            )}</span></p>
        `;
  }
}

function formatNumber(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Rest of your existing functions here

function toggleCustomQuoteFields() {
  const customQuoteFields = document.getElementById("custom-quote-fields");
  const customQuoteHoursBYOB = document.getElementById(
    "custom-quote-hours-byob"
  );
  const presetQuoteAlcoholPolicy = document.getElementById(
    "preset-quote-alcohol-policy"
  );
  const byobSwitchContainer = document.querySelector(".form-group.byob-switch");
  const byobSwitch = document.getElementById("includeByobAlchol");
  const tripType = document.querySelector(".trip-type");
  const quoteType = document.querySelector(
    'input[name="quote-type"]:checked'
  ).value;
  const customMultipleQuote = document.getElementById(
    "multiple-vehicle-switch-fields"
  );

  const byobfield = document.getElementById("includeByob");

  const additionalHours = document.getElementById(
    "additional-hours-fields-wrapper"
  );

  const sliderPreset = document.getElementById("slider-perset");
  if (quoteType === "custom") {
    customQuoteFields.style.display = "block";
    customQuoteHoursBYOB.style.display = "block";
    customMultipleQuote.style.display = "block";
    byobSwitchContainer.style.display = "none";
    presetQuoteAlcoholPolicy.style.display = "none";
    sliderPreset.style.display = "none";
    tripType.style.display = "flex";
    byobfield.style.display = "block";
    additionalHours.style.display = "block";
    byobSwitch.style.display = "none";
  } else {
    customQuoteFields.style.display = "none";
    customQuoteHoursBYOB.style.display = "block";
    tripType.style.display = "none";
    customMultipleQuote.style.display = "none";
    byobSwitchContainer.style.display = "block";
    presetQuoteAlcoholPolicy.style.display = "none";
    sliderPreset.style.display = "block";
    byobfield.style.display = "none";
    additionalHours.style.display = "none";
    byobSwitch.style.display = "none";
  }
}

function toggleTripTypeFields() {
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked'
  ).value;
  const customQuoteFields = document.getElementById("custom-quote-fields");
  const customQuoteHoursBYOB = document.getElementById(
    "custom-quote-hours-byob"
  );
  const time = document.getElementById("time-wrapper");
  const customMultipleQuote = document.getElementById(
    "multiple-vehicle-switch-fields"
  );
  const fleetSelected = document.querySelector(".fleetAndRates");
  const vehicleAvailability = document.querySelector(".vehicle-availability");
  const includeMinHoursPolicy = document.getElementById(
    "include-min-hours-policy-div"
  );
  const baseRateField = document.getElementById("base-rate");
  const hoursField = document.getElementById("hours");
  const weddingPackageGroup = document.getElementById("wedding-package-group");

  if (tripType === "hourly") {
    customQuoteFields.style.display = "block";
    time.style.display = "block";
    customQuoteHoursBYOB.style.display = "block";
    includeMinHoursPolicy.style.display = "block";
    vehicleAvailability.style.display = "block";
    baseRateField.style.display = "block";
    fleetSelected.style.display = "block";
    hoursField.parentElement.style.display = "block";
    weddingPackageGroup.style.display = "none";
    customMultipleQuote.style.display = "block";
  } else if (tripType === "one-way" || tripType === "two-way") {
    customQuoteFields.style.display = "block";
    time.style.display = "block";
    customQuoteHoursBYOB.style.display = "none";
    includeMinHoursPolicy.style.display = "none";
    vehicleAvailability.style.display = "block";
    baseRateField.style.display = "block";
    fleetSelected.style.display = "block";
    hoursField.value = "";
    hoursField.parentElement.style.display = "none";
    weddingPackageGroup.style.display = "none";
    customMultipleQuote.style.display = "none";
  } else if (tripType === "wedding") {
    fleetSelected.style.display = "none";
    time.style.display = "none";
    customQuoteHoursBYOB.style.display = "none";
    vehicleAvailability.style.display = "none";
    includeMinHoursPolicy.style.display = "none";
    baseRateField.style.display = "block";
    hoursField.value = "";
    hoursField.parentElement.style.display = "none";
    weddingPackageGroup.style.display = "block"; // Show the wedding package options
    customMultipleQuote.style.display = "none";
  }
}

document
  .getElementById("wedding-package")
  .addEventListener("change", function () {
    const selectedPackage = this.value;
    let baseRate, gasFee;

    if (selectedPackage === "small") {
      baseRate = 2595;
      gasFee = 350;
    } else if (selectedPackage === "medium") {
      baseRate = 2895;
      gasFee = 375;
    } else if (selectedPackage === "large") {
      baseRate = 4295;
      gasFee = 595;
    }

    // Update the input fields
    document.getElementById("custom-base-rate").value = baseRate;
    document.getElementById("custom-gas-fee").value = gasFee;

    // Recalculate the quote and update the display
    calculateQuote();
  });

function toggleMultipleTripsFields() {
  const multipleOptionsFields = document.getElementById(
    "multiple-vehile-fields"
  );

  const multipleOptionsCheckbox = document.getElementById(
    "include-multiple-opitons"
  );

  if (multipleOptionsCheckbox.checked) {
    multipleOptionsFields.style.display = "block";
  } else {
    multipleOptionsFields.style.display = "none";
  }
}

function toggleAdditionalHoursFields() {
  const additionalHoursFields = document.getElementById(
    "additional-hours-fields"
  );
  const additionalHoursCheckbox = document.getElementById(
    "include-additional-hours"
  );

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

const customSteps = [195, 210, 227, 243, 259, 275, 290, 307, 323, 339, 355];

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("slider");
  const stepsContainer = document.getElementById("slider-steps");

  // Create labels for the custom steps
  customSteps.forEach((step) => {
    const stepLabel = document.createElement("span");
    stepLabel.textContent = step;
    stepsContainer.appendChild(stepLabel);
  });

  // Update the output text based on slider value
  slider.addEventListener("input", function () {
    const stepIndex = parseInt(this.value, 10); // The slider's value corresponds to the index in the customSteps array
    const stepValue = customSteps[stepIndex]; // Get the corresponding step value
    preserBaseRate = stepValue; // Update your base rate or other logic here
    console.log("preserBaseRate is now: " + preserBaseRate);
    calculateQuote(); // Recalculate the quote when slider changes
  });
});

let totalAmountGlobal = 0; // Define this outside of the function, at the top
let totalAmountGlobal2 = 0; // Define this outside of the function, at the top
let preserBaseRate = 195;
let presetGasFee = 175;
let presetMinHours = 5;

function calculateQuote() {
  const name = document.getElementById("name").value || "Customer";
  const vehicleAvailable = document.getElementById("vehicle-available").checked;
  const includeAlcoholPolicy = document.getElementById(
    "include-alcohol-policy"
  ).checked;
  const includeAlcoholPolicyCustom = document.getElementById(
    "include-alcohol-policy-custom"
  ).checked;
  const multipleOptionsCheckbox = document.getElementById(
    "include-multiple-opitons"
  ).checked;
  const includeMinHoursPolicy = document.getElementById(
    "include-min-hours-policy"
  ).checked;

  const hours2 =
    parseFloat(document.getElementById("hours-option-two").value) || 0;
  const vehicleType = document.getElementById("vehicle").value;
  const vehicleTypeOptionTwo =
    document.getElementById("vehicle-option-two").value;
  let hours = parseFloat(document.getElementById("hours").value) || 0; // Default to 0 if undefined
  const includeAlcohol = document.getElementById("include-alcohol").checked;
  const quoteType = document.querySelector(
    'input[name="quote-type"]:checked'
  ).value;
  const includeAdditionalHours = document.getElementById(
    "include-additional-hours"
  ).checked;
  const includeBYOB = document.getElementById("include-byob").checked;
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked'
  ).value;

  const dateInput = document.getElementById("date").value || "Not specified";
  let formattedDate = "Not specified";
  let dayOfWeek = "";
  if (dateInput !== "Not specified") {
    const date = new Date(dateInput + "T12:00:00"); // Set time to midday to avoid timezone issues
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    // Get the day of the week (0: Sunday, 1: Monday, etc.)
    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    dayOfWeek = daysOfWeek[date.getDay()];

    formattedDate = `${month}/${day}/${year}`;
  }

  let time = document.getElementById("time").value || "Not specified";
  let time2 =
    document.getElementById("time-option-two").value || "Not specified";

  // Convert 24-hour time to 12-hour format for time
  if (time !== "Not specified") {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    time = `${hour}:${minute} ${ampm}`;
  }

  // Convert 24-hour time to 12-hour format for time2
  if (time2 !== "Not specified") {
    let [hour2, minute2] = time2.split(":");
    hour2 = parseInt(hour2, 10);
    const ampm2 = hour2 >= 12 ? "PM" : "AM";
    hour2 = hour2 % 12 || 12; // Convert hour2 to 12-hour format
    time2 = `${hour2}:${minute2} ${ampm2}`;
  }

  let baseRate = 0;
  let baseRate2 = 0;
  let minHours = 4;
  let gasFee = 0;
  let gasFee2 = 0;
  let additionalHourRate = 300;
  let stcPercentage = 10;
  let gratuityPercentage = 15;
  let fixedGratuity = 0;
  let fixedGratuity2 = 0;
  let securityGuardFee = 0;
  let vehicleName = "";
  let vehicleName2 = "";
  let paxNumber = 0;
  let paxNumber2 = 0;
  let displayBaseRate = "";
  let displayBaseRate2 = "";
  let imageUrl = "";
  let imageUrl2 = "";
  let vehicleLink = "";
  let hasRearBalcony = false;
  let hasRestroom = false;
  let vehicleDetails = "";
  let quoteIncludes = "";
  // Initialize custom additional hours and rate variables
  let customAdditionalHours = 0;
  let customRateAdditional = 0;
  let perHourRate = 0;
  let perHourRate2 = 0;

  const weddingImage = "https://wtglimo.com/img/wedding/trolley-shuttleBus.png";

  let weddingSmall = {
    trolleyDetails:
      "seating capacity 24, premium sound system with bluetooth connection, climate controlled, Charging ports, comfortable perimeter seats, rear balcony.",
    shuttleBusDetials:
      "seating capacity 40, basic radio, bluetooth, charging ports, climate controlled, individual face-forward seating, seat belts, rear storage.",
    packageIncludes:
      "24-trolley for 5-hours AND a 40-shuttle bus for 8-hours, unlimited stops & mileage, gratuity, all fees, fuel and service charges.",
    VehilceName: "24-Trolley & 40-Bus",
    quoteSpec: "(5-hour Trolley & 8-hour Bus)",
  };
  let weddingMedium = {
    trolleyDetails:
      "seating capacity 30, premium sound system with bluetooth connection, climate controlled, Charging ports, comfortable perimeter seats, rear balcony.",
    shuttleBusDetials:
      "seating capacity 50, basic radio, bluetooth, charging ports, climate controlled, individual face-forward seating, seat belts, rear storage.",
    packageIncludes:
      "30-trolley for 5-hours AND a 50-shuttle bus for 8-hours, unlimited stops & mileage, gratuity, all fees, fuel and service charges.",
    VehilceName: "30-Trolley & 50-Bus",
    quoteSpec: "(5-hour Trolley & 8-hour Bus)",
  };
  let weddingLarge = {
    trolleyDetails:
      "36-trolley OR a 40-party bus, premium sound system with bluetooth connection, charging ports, climate controlled, comfortable perimeter seats, rear balcony.",
    shuttleBusDetials:
      "seating capacity 50 per bus, basic radio, bluetooth, charging ports, climate controlled, individual face-forward seating, seat belts, rear storage.",
    packageIncludes:
      "36-trolley OR a 40-party bus for 5 hours AND 2 of the 50-shuttle buses for 8-hours each, unlimited stops & mileage, gratuity, all fees, fuel and service charges.",
    VehilceName: "Trolley or Party bus & 2 Buses ",
    quoteSpec: "(5-hour Trolley or Party Bus & 8-hour 2-Buses)",
  };

  // Fetch vehicle data regardless of quote type

  switch (vehicleType) {
    case "trolley_midnight_36":
      baseRate = 1795;
      gasFee = 250;
      vehicleName = "Trolley Midnight";
      vehicleName2 = "Trolley Midnight";
      paxNumber = 36;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
      vehicleLink = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
      hasRearBalcony = true;
      vehicleDetails =
        "36 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "trolley_fusion_30":
      baseRate = 1695;
      gasFee = 175;
      vehicleName = "Trolley Fusion";
      paxNumber = 30;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
      vehicleLink = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
      hasRearBalcony = true;
      vehicleDetails =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "trolley_bliss_30":
      baseRate = 1695;
      gasFee = 175;
      vehicleName = "Trolley Bliss";
      paxNumber = 30;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
      vehicleLink = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
      vehicleDetails =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      hasRearBalcony = true;
      break;
    case "trolley_classic_30":
      baseRate = 1695;
      gasFee = 175;
      vehicleName = "Trolley Classic";
      paxNumber = 30;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      vehicleDetails =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
      vehicleLink =
        "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
      break;
    case "trolley_festive_24":
      baseRate = 1495;
      gasFee = 125;
      vehicleName = "Trolley Festive";
      paxNumber = 24;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      vehicleDetails =
        "24 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
      vehicleLink = "https://wtglimo.com/Chicago-trolley-rental.php";
      hasRearBalcony = true;
      break;
    case "partybus_dove_40":
      baseRate = 1795;
      gasFee = 250;
      vehicleName = "Party Bus - Dove";
      paxNumber = 40;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      vehicleDetails =
        "40 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
      vehicleLink = "https://wtglimo.com/chicago-party-bus-rental.php";
      break;
    case "partybus_nightrider_30":
      baseRate = 350 * minHours;
      gasFee = 125;
      additionalHourRate = 300;
      vehicleName = "Party Bus - Night Rider";
      paxNumber = 30;
      vehicleDetails =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
      vehicleLink = "https://wtglimo.com/libertyville-party-bus-rental.php";
      break;
    case "partybus_eagle_25":
      baseRate = 350 * minHours;
      gasFee = 125;
      additionalHourRate = 300;
      vehicleName = "Party Bus - Eagle";
      vehicleDetails =
        "25 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      paxNumber = 25;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
      vehicleLink = "https://wtglimo.com/Palatine-party-bus-rental.php";
      break;
    case "partybus_whitehawk_20":
      baseRate = 295 * minHours;
      gasFee = 120;
      additionalHourRate = 250;
      vehicleName = "Party Bus - White Hawk";
      vehicleDetails =
        "20 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      paxNumber = 20;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png";
      vehicleLink =
        "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php";
      break;
    case "pink_hummer_h2":
      baseRate = 295 * minHours;
      gasFee = 120;
      additionalHourRate = 250;
      vehicleName = "Pink Hummer H2";
      vehicleDetails =
        "18 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      paxNumber = 18;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.webp";
      vehicleLink = "https://wtglimo.com/hummer_pink_panther.php";
      break;
    case "pink_chrysler_300":
      baseRate = 295 * minHours;
      gasFee = 120;
      additionalHourRate = 250;
      vehicleName = "Pink Chrysler 300";
      paxNumber = 10;
      vehicleDetails =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png";
      vehicleLink = "https://wtglimo.com/pink-limo-rental-Chicago.php";
      break;
    case "christmas_trolley":
      baseRate = 1495;
      gasFee = 150;
      vehicleName = "Christmas Trolley";
      paxNumber = "30";
      vehicleDetails =
        "30 Passengers, Rear Balcony, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png";
      vehicleLink = "https://wtglimo.com/Christmas-trolley-tours-Chicago.php";
      hasRearBalcony = true;
      break;
    case "ford_transit_limo":
      baseRate = 295 * minHours;
      gasFee = 120;
      additionalHourRate = 250;
      vehicleName = "Ford Transit Limo";
      vehicleDetails =
        "15 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      paxNumber = 15;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png";
      vehicleLink =
        "https://wtglimo.com/15-Passenger-Van-Rental-Chicago-Ford-Transit-Black.php";
      break;
    case "sprinter_shuttle_van":
      baseRate = 250 * minHours;
      gasFee = 100;
      additionalHourRate = 200;
      vehicleName = "Sprinter Shuttle Van";
      vehicleDetails =
        "14 Passengers, Bluetooth Connection, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      paxNumber = 14;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png";
      vehicleLink = "https://wtglimo.com/sprinter_shuttle_van.php";
      break;
    case "hummer_h2_stretch_limo":
      baseRate = 350 * minHours;
      gasFee = 150;
      additionalHourRate = 300;
      vehicleName = "Hummer H2 Stretch Limo";
      vehicleDetails =
        "20 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      paxNumber = 20;
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png";
      vehicleLink =
        "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php";
      break;
    case "chrysler_300_limo":
      baseRate = 250 * minHours;
      gasFee = 100;
      additionalHourRate = 200;
      vehicleName = "Chrysler 300 Limo";
      paxNumber = 10;
      vehicleDetails =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png";
      vehicleLink =
        "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php";
      break;
    case "lincoln_mkt_limo":
      baseRate = 250 * minHours;
      gasFee = 100;
      additionalHourRate = 200;
      vehicleName = "Lincoln MKT Limo";
      paxNumber = 10;
      vehicleDetails =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png";
      vehicleLink =
        "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php";
      break;
    case "lincoln_navigator":
      baseRate = 200 * minHours;
      gasFee = 80;
      additionalHourRate = 150;
      vehicleName = "Lincoln Navigator";
      paxNumber = 6;
      vehicleDetails =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png";
      vehicleLink = "https://wtglimo.com/lincoln-navigator-limo.php";
      break;
    case "cadillac_escalade":
      baseRate = 250 * minHours;
      gasFee = 100;
      additionalHourRate = 200;
      vehicleName = "Cadillac Escalade";
      paxNumber = 6;
      vehicleDetails =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png";
      vehicleLink = "https://wtglimo.com/cadillac-escalade-limo.php";
      break;
    case "chevrolet_suburban":
      baseRate = 200 * minHours;
      gasFee = 80;
      additionalHourRate = 150;
      vehicleName = "Chevrolet Suburban";
      paxNumber = 6;
      vehicleDetails =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png";
      vehicleLink = "https://wtglimo.com/suv-limo-rental.php";
      break;
    case "lincoln_mkz":
      baseRate = 150 * minHours;
      gasFee = 50;
      additionalHourRate = 100;
      vehicleName = "Lincoln MKZ";
      paxNumber = 3;
      vehicleDetails =
        "3 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      displayBaseRate = `$${formatNumber(baseRate)}/hr`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png";
      vehicleLink = "https://wtglimo.com/limo-car-service.php";
      break;
    case "coach_bus_super":
      baseRate = 1200;
      minHours = 5;
      gasFee = 500;
      vehicleName = "Coach Bus - Super";
      hasRestroom = true;
      paxNumber = 50;
      vehicleDetails =
        "50 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png";
      vehicleLink = "https://wtglimo.com/chicago-Super-Coach-Bus.php";
      break;
    case "coach_bus_rentals":
      baseRate = 1000;
      minHours = 5;
      gasFee = 400;
      vehicleName = "Motor Coach - Everywhere";
      vehicleDetails =
        "56 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Underbody Storage.";
      hasRestroom = true;
      paxNumber = 56;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png";
      vehicleLink = "https://wtglimo.com/chicago_coach_bus.php";
      break;
    case "coach_bus_corporate":
      baseRate = 1500;
      minHours = 5;
      gasFee = 600;
      vehicleName = "Coach Bus - Corporate";
      paxNumber = 40;
      vehicleDetails =
        "40 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png";
      vehicleLink = "https://wtglimo.com/executive_shuttle_bus.php";
      break;
    case "coach_bus_crystal":
      baseRate = 1300;
      minHours = 4;
      gasFee = 500;
      vehicleName = "Coach Bus - Crystal";
      paxNumber = 25;
      vehicleDetails =
        "25 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      displayBaseRate = `$${formatNumber(baseRate)}`;
      imageUrl =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBusCrystal-main.png";
      vehicleLink = "https://wtglimo.com/executive_bus_crystal.php";
      break;
    default:
      alert("Invalid vehicle type selected.");
      return;
  }
  switch (vehicleTypeOptionTwo) {
    case "trolley_midnight_36":
      vehicleName2 = "Trolley Midnight";
      paxNumber2 = 36;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png";
      vehicleLink2 = "https://wtglimo.com/Naperville-trolley-bus-rental.php";
      vehicleDetails2 =
        "36 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "trolley_fusion_30":
      vehicleName2 = "Trolley Fusion";
      paxNumber2 = 30;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png";
      vehicleLink2 = "https://wtglimo.com/Chicago-trolley-bus-rental.php";
      vehicleDetails2 =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "trolley_bliss_30":
      vehicleName2 = "Trolley Bliss";
      paxNumber2 = 30;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png";
      vehicleLink2 = "https://wtglimo.com/white-wedding-trolleys-Chicago.php";
      vehicleDetails2 =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "trolley_classic_30":
      vehicleName2 = "Trolley Classic";
      paxNumber2 = 30;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png";
      vehicleLink2 =
        "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php";
      vehicleDetails2 =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "trolley_festive_24":
      vehicleName2 = "Trolley Festive";
      paxNumber2 = 24;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png";
      vehicleLink2 = "https://wtglimo.com/Chicago-trolley-rental.php";
      vehicleDetails2 =
        "24 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Rear Balcony, Ice & Water.";
      break;
    case "partybus_dove_40":
      vehicleName2 = "Party Bus - Dove";
      paxNumber2 = 40;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg";
      vehicleLink2 = "https://wtglimo.com/chicago-party-bus-rental.php";
      vehicleDetails2 =
        "40 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "partybus_nightrider_30":
      vehicleName2 = "Party Bus - Night Rider";
      paxNumber2 = 30;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png";
      vehicleLink2 = "https://wtglimo.com/libertyville-party-bus-rental.php";
      vehicleDetails2 =
        "30 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "partybus_eagle_25":
      vehicleName2 = "Party Bus - Eagle";
      paxNumber2 = 25;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png";
      vehicleLink2 = "https://wtglimo.com/Palatine-party-bus-rental.php";
      vehicleDetails2 =
        "25 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "partybus_whitehawk_20":
      vehicleName2 = "Party Bus - White Hawk";
      paxNumber2 = 20;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png";
      vehicleLink2 =
        "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php";
      vehicleDetails2 =
        "20 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "pink_hummer_h2":
      vehicleName2 = "Pink Hummer H2";
      paxNumber2 = 18;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.webp";
      vehicleLink2 = "https://wtglimo.com/hummer_pink_panther.php";
      vehicleDetails2 =
        "18 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "pink_chrysler_300":
      vehicleName2 = "Pink Chrysler 300";
      paxNumber2 = 10;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png";
      vehicleLink2 = "https://wtglimo.com/pink-limo-rental-Chicago.php";
      vehicleDetails2 =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "christmas_trolley":
      vehicleName2 = "Christmas Trolley";
      paxNumber2 = "24-36";
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png";
      vehicleLink2 = "https://wtglimo.com/Christmas-trolley-tours-Chicago.php";
      vehicleDetails2 =
        "24-36 Passengers, Rear Balcony, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "ford_transit_limo":
      vehicleName2 = "Ford Transit Limo";
      paxNumber2 = 15;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png";
      vehicleLink2 =
        "https://wtglimo.com/15-Passenger-Van-Rental-Chicago-Ford-Transit-Black.php";
      vehicleDetails2 =
        "15 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "sprinter_shuttle_van":
      vehicleName2 = "Sprinter Shuttle Van";
      paxNumber2 = 14;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png";
      vehicleLink2 = "https://wtglimo.com/sprinter_shuttle_van.php";
      vehicleDetails2 =
        "14 Passengers, Bluetooth Connection, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      break;
    case "hummer_h2_stretch_limo":
      vehicleName2 = "Hummer H2 Stretch Limo";
      paxNumber2 = 20;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png";
      vehicleLink2 =
        "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php";
      vehicleDetails2 =
        "20 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "chrysler_300_limo":
      vehicleName2 = "Chrysler 300 Limo";
      paxNumber2 = 10;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png";
      vehicleLink2 =
        "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php";
      vehicleDetails2 =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "lincoln_mkt_limo":
      vehicleName2 = "Lincoln MKT Limo";
      paxNumber2 = 10;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png";
      vehicleLink2 =
        "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php";
      vehicleDetails2 =
        "10 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Comfortable Perimeter Seats, Ice & Water.";
      break;
    case "lincoln_navigator":
      vehicleName2 = "Lincoln Navigator";
      paxNumber2 = 6;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png";
      vehicleLink2 = "https://wtglimo.com/lincoln-navigator-limo.php";
      vehicleDetails2 =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      break;
    case "cadillac_escalade":
      vehicleName2 = "Cadillac Escalade";
      paxNumber2 = 6;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png";
      vehicleLink2 = "https://wtglimo.com/cadillac-escalade-limo.php";
      vehicleDetails2 =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      break;
    case "chevrolet_suburban":
      vehicleName2 = "Chevrolet Suburban";
      paxNumber2 = 6;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png";
      vehicleLink2 = "https://wtglimo.com/suv-limo-rental.php";
      vehicleDetails2 =
        "6 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      break;
    case "lincoln_mkz":
      vehicleName2 = "Lincoln MKZ";
      paxNumber2 = 3;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png";
      vehicleLink2 = "https://wtglimo.com/limo-car-service.php";
      vehicleDetails2 =
        "3 Passengers, Premium Sound System with Bluetooth Connection, Climate Controlled, Water.";
      break;
    case "coach_bus_super":
      vehicleName2 = "Coach Bus - Super";
      paxNumber2 = 50;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png";
      vehicleLink2 = "https://wtglimo.com/chicago-Super-Coach-Bus.php";
      vehicleDetails2 =
        "50 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      break;
    case "coach_bus_rentals":
      vehicleName2 =
        "56 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Underbody Storage";
      paxNumber2 = 56;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png";
      vehicleLink2 = "https://wtglimo.com/chicago_coach_bus.php";
      vehicleDetails2 = "56 Passengers, Climate Controlled, Water.";
      break;
    case "coach_bus_corporate":
      vehicleName2 = "Coach Bus - Corporate";
      paxNumber2 = 40;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png";
      vehicleLink2 = "https://wtglimo.com/executive_shuttle_bus.php";
      vehicleDetails2 =
        "40 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      break;
    case "coach_bus_crystal":
      vehicleName2 = "Coach Bus - Crystal";
      paxNumber2 = 25;
      imageUrl2 =
        "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBusCrystal-main.png";
      vehicleLink2 = "https://wtglimo.com/executive_bus_crystal.php";
      vehicleDetails2 =
        "25 Passengers, Basic Radio, Bluetooth, Charging Ports, Climate Controlled, Individual Face-Forward Seating, Seat belts, Rear Storage.";
      break;
    default:
      alert("Invalid vehicle type selected.");
      return;
  }

  let totalAdditionalCost = 0;
  let totalBYOBCost = 0;
  let totalHours = hours;
  let totalHours2 = hours2;

  if (quoteType === "custom") {
    if (tripType === "hourly") {
      baseRate =
        parseFloat(document.getElementById("custom-base-rate").value) || 0;
      baseRate2 =
        parseFloat(
          document.getElementById("custom-base-rate-option-two").value
        ) || 0;
      fixedGratuity = parseFloat(document.getElementById("fixed-gratuity").value) || 0;
      fixedGratuity2 = parseFloat(document.getElementById("fixed-gratuity-option-two").value) || 0;
      gasFee = parseFloat(document.getElementById("custom-gas-fee").value) || 0;
      gasFee2 =
        parseFloat(
          document.getElementById("custom-gas-fee-option-two").value
        ) || 0;

      if (includeAdditionalHours) {
        customAdditionalHours =
          parseFloat(
            document.getElementById("custom-additional-hours").value
          ) || 0;
        customRateAdditional =
          parseFloat(document.getElementById("custom-rate-additional").value) ||
          0;
        totalAdditionalCost = customAdditionalHours * customRateAdditional;
        totalHours += customAdditionalHours;
      }

      if (includeBYOB) {
        const customBYOBHours =
          parseFloat(document.getElementById("custom-byob-hours").value) || 0;
        const customRateBYOB =
          parseFloat(document.getElementById("custom-rate-byob").value) || 0;
        totalBYOBCost = customBYOBHours * customRateBYOB;
      }

      baseRate *= hours;
      baseRate2 *= hours2;
      perHourRate = baseRate / hours;
      perHourRate2 = baseRate2 / hours2;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      displayBaseRate2 = `$${formatNumber(baseRate2)}`;
    } else if (tripType === "wedding") {
      baseRate =
        parseFloat(document.getElementById("custom-base-rate").value) || 0;
      gasFee = parseFloat(document.getElementById("custom-gas-fee").value) || 0;
      fixedGratuity = parseFloat(document.getElementById("fixed-gratuity").value) || 0;

      displayBaseRate = `$${formatNumber(baseRate)}`;
    } else if (tripType === "one-way" || tripType === "two-way") {
      baseRate =
        parseFloat(document.getElementById("custom-base-rate").value) || 0;
      gasFee = parseFloat(document.getElementById("custom-gas-fee").value) || 0;
      fixedGratuity = parseFloat(document.getElementById("fixed-gratuity").value) || 0;
      twoWaysDisplayRate = baseRate;
      displayBaseRate = `$${formatNumber(baseRate)}`;
      minHours = 0;
      totalAdditionalCost = 0; // No additional hours for one-way or two-way trips
      if (tripType === "two-way") {
        baseRate *= 2; // Double the base rate for two-way trips
      }

      totalAdditionalCost = 0; // No additional hours for one-way or two-way trips
      displayBaseRate = `$${formatNumber(baseRate)}`;
      minHours = 0;
    }
  } else if ("preset") {
    console.log(preserBaseRate);

    const presetVehicleRates = {
      trolley_midnight_36: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      trolley_fusion_30: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      trolley_bliss_30: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      trolley_classic_30: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      trolley_festive_24: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      partybus_dove_40: {
        baseRate: preserBaseRate,
        hours: presetMinHours,
        gasFee: presetGasFee,
      },
      partybus_nightrider_30: {
        baseRate: 350,
        minHours: 4,
        gasFee: 125,
        additionalHourRate: 300,
      },
      partybus_eagle_25: {
        baseRate: 350,
        minHours: 4,
        gasFee: 125,
        additionalHourRate: 300,
      },
      partybus_whitehawk_20: {
        baseRate: 295,
        minHours: 4,
        gasFee: 120,
        additionalHourRate: 250,
      },
      pink_hummer_h2: {
        baseRate: 295,
        minHours: 4,
        gasFee: 120,
        additionalHourRate: 250,
      },
      pink_chrysler_300: {
        baseRate: 295,
        minHours: 4,
        gasFee: 120,
        additionalHourRate: 250,
      },
      christmas_trolley: { baseRate: 1495, minHours: 4, gasFee: 150 },
      ford_transit_limo: {
        baseRate: 295,
        minHours: 4,
        gasFee: 120,
        additionalHourRate: 250,
      },
      sprinter_shuttle_van: {
        baseRate: 250,
        minHours: 4,
        gasFee: 100,
        additionalHourRate: 200,
      },
      hummer_h2_stretch_limo: {
        baseRate: 350,
        minHours: 4,
        gasFee: 150,
        additionalHourRate: 300,
      },
      chrysler_300_limo: {
        baseRate: 250,
        minHours: 4,
        gasFee: 100,
        additionalHourRate: 200,
      },
      lincoln_mkt_limo: {
        baseRate: 250,
        minHours: 4,
        gasFee: 100,
        additionalHourRate: 200,
      },
      lincoln_navigator: {
        baseRate: 200,
        minHours: 4,
        gasFee: 80,
        additionalHourRate: 150,
      },
      cadillac_escalade: {
        baseRate: 250,
        minHours: 4,
        gasFee: 100,
        additionalHourRate: 200,
      },
      chevrolet_suburban: {
        baseRate: 200,
        minHours: 4,
        gasFee: 80,
        additionalHourRate: 150,
      },
      lincoln_mkz: {
        baseRate: 150,
        minHours: 4,
        gasFee: 50,
        additionalHourRate: 100,
      },
      coach_bus_super: { baseRate: 1200, minHours: 5, gasFee: 500 },
      coach_bus_rentals: { baseRate: 1000, minHours: 5, gasFee: 400 },
      coach_bus_corporate: { baseRate: 1500, minHours: 5, gasFee: 600 },
      coach_bus_crystal: { baseRate: 1300, minHours: 4, gasFee: 500 },
    };

    const vehicleDetails = presetVehicleRates[vehicleType];

    if (vehicleDetails) {
      baseRate = vehicleDetails.baseRate;
      minHours = vehicleDetails.hours;
      gasFee = vehicleDetails.gasFee;

      console.log;

      baseRate *= minHours;
      const stc = (baseRate * stcPercentage) / 100;
      const gratuity = (baseRate * gratuityPercentage) / 100;
      const total = baseRate + stc + gratuity + gasFee + securityGuardFee;

      displayBaseRate = `$${formatNumber(baseRate)}`;

      perHourRate = baseRate / minHours;
      hours = minHours;
      totalHours = minHours;
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
  const totalBaseRate2 = baseRate2;
  const stc = (totalBaseRate * stcPercentage) / 100;
  const stc2 = (totalBaseRate2 * stcPercentage) / 100;
  const gratuity = (totalBaseRate * gratuityPercentage) / 100;
  const gratuity2 = (totalBaseRate2 * gratuityPercentage) / 100;
  const total =
    totalBaseRate +
    stc +
    fixedGratuity +
    gasFee +
    securityGuardFee +
    totalAdditionalCost +
    totalBYOBCost;
  const total2 =
    totalBaseRate2 +
    stc2 +
    fixedGratuity2 +
    gasFee2 +
    securityGuardFee +
    totalAdditionalCost +
    totalBYOBCost;

  totalAmountGlobal = total; // Store the total amount in the global variable
  totalAmountGlobal2 = total2; // Store the total amount in the global variable

  const weddingPackage = document.getElementById("wedding-package").value;
  let weddingPackagePrint = "";
  if (weddingPackage === "small") {
    weddingPackagePrint = "Small Group";
  } else if (weddingPackage === "medium") {
    weddingPackagePrint = "Medium Group";
  } else if (weddingPackage === "large") {
    weddingPackagePrint = "Large Group";
  }

  let availabilityMessage = "";
  let wedding = tripType === "wedding";
  if (vehicleAvailable) {
    if (multipleOptionsCheckbox) {
      availabilityMessage = `The <strong> ${vehicleName}</strong> & the <strong>${vehicleName2}</strong> are available.`;
    } else if (wedding) {
      availabilityMessage = `The <strong> ${weddingPackagePrint} Package</strong> is available.`;
    } else {
      availabilityMessage = `The <strong> ${vehicleName}</strong> is available.`;
    }
  } else {
    availabilityMessage =
      "The requested vehicle is not available. However, we do have a similar vehicle that can meet your expectations.";
  }

  let packageLabel = "";
  let trolleyDetails = "";
  let shuttleBusDetails = "";
  let headingVehicleNames = "";
  let quoteSpec = "";
  // Define the label based on tripType
  if (tripType === "wedding") {
    packageLabel = weddingPackagePrint;
    if (weddingPackage === "small") {
      quoteIncludes = weddingSmall.packageIncludes;
      trolleyDetails = weddingSmall.trolleyDetails;
      shuttleBusDetails = weddingSmall.shuttleBusDetials;
      headingVehicleNames = weddingSmall.VehilceName;
      quoteSpec = weddingSmall.quoteSpec;
    } else if (weddingPackage === "medium") {
      quoteIncludes = weddingMedium.packageIncludes;
      trolleyDetails = weddingMedium.trolleyDetails;
      shuttleBusDetails = weddingMedium.shuttleBusDetials;
      headingVehicleNames = weddingMedium.VehilceName;
      quoteSpec = weddingMedium.quoteSpec;
    } else if (weddingPackage === "large") {
      quoteIncludes = weddingLarge.packageIncludes;
      trolleyDetails = weddingLarge.trolleyDetails;
      shuttleBusDetails = weddingLarge.shuttleBusDetials;
      headingVehicleNames = weddingLarge.VehilceName;
      quoteSpec = weddingLarge.quoteSpec;
    }
  } else if (tripType === "hourly") {
    packageLabel = `${totalHours} Hour Package`;
    quoteIncludes =
      "Unlimited stops & mileage, gratuity, all fees, fuel and service charges.";
  } else if (tripType === "one-way") {
    packageLabel = "Transfer <span class='byob-text'>(one-way)</span>";
    quoteIncludes =
      "One way trip, gratuity, all fees, fuel and service charges.";
  } else if (tripType === "two-way") {
    packageLabel = "Round Trip <span class='byob-text'>(to/from)</span>";
    quoteIncludes = "Round trip, gratuity, all fees, fuel and service charges.";
  }

  let vehicleNamePax = "";
  if (wedding) {
    vehicleNamePax = "";
  } else {
    vehicleNamePax = `<p class="vehicle-name-quote-price">${vehicleName} <span class="byob-text">(${paxNumber} Passengers)</span></p>`;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <div id="quote-content">
          <p class="intro-para">
            Hello <strong>${name}</strong>,<br><br>
            Thank you for choosing <strong>WAYTOGO Trolley & Charter Bus</strong>. ${availabilityMessage} Please review the quote below and make your <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">reservation online.</a>
          </p>
          
          ${
            wedding
              ? `<p><strong>Package Includes:</strong> ${quoteIncludes}</p><br>`
              : ""
          }
          <h2 class="vehicle-name">${
            wedding
              ? `${weddingPackagePrint}: <span class="unbold-heading">${headingVehicleNames}</span>`
              : vehicleName
          } ${
    wedding ? "" : `<span class="byob-text">(${paxNumber} Passengers)</span>`
  }<span class="vehicle-recommeded"> ${
    !vehicleAvailable ? "(Recommended Vehicle)" : ""
  }</span></h2>

   ${
            wedding
              ? `<p><strong>${
                  weddingPackage === "large"
                    ? "Trolley OR Party Bus Details:"
                    : "Trolley Details:"
                } </strong> ${trolleyDetails}</p>
            <p><strong>Shuttle Bus Details: </strong> ${shuttleBusDetails}</p>`
              : `<p><strong>Vehicle Details: </strong>${vehicleDetails}</p>`
          }

          <div class="image-container">
          ${
            wedding
              ? `<img src="${weddingImage}" alt="${weddingPackagePrint}" />`
              : `<img src="${imageUrl}" alt="${vehicleName}" />`
          }
          </div>
          ${
            wedding
              ? ""
              : `<div class="vehicle-name-link">
              <p><a href="${vehicleLink}" target="_blank">(View More Pictures)</a></p>
          </div>`
          }
          <div class="details">
         
            
              ${
                includeMinHoursPolicy && tripType === "hourly"
                  ? `<div id="min-hours-requirement" class="minimum-requirements">
                 <p><strong>Minimum Hours:</strong> There is a minimum ${minHours}-hour requirement for vehicles with 15+ passengers.</p>
               </div>`
                  : ""
              }

              <div class="quote-price">
              <div class="quote-vehicle-name"> ${vehicleNamePax} </div>

                  ${
                    wedding
                      ? `<div style="
                          line-height: normal;">
                    <p class="quote-heading"><strong>${
                      weddingPackage === "large"
                        ? "Trolley or Party Bus & 2 Buses"
                        : "Trolley & Bus"
                    }</strong></p>
                  <div class="quote-datetime">
                      <p><small>${dayOfWeek} ${formattedDate}</small></p>
                  </div></div>`
                      : `<div style="
                          line-height: normal;">
                  <div class="quote-datetime">
                      <p><small>${dayOfWeek} ${formattedDate}</small></p>
                      <p><small>&nbsp;/ ${time}</small></p>
                  </div></div>
                  
                  `
                  }
                    <p class="quote-heading">
                    <strong>QUOTE: ${packageLabel} <span class="byob-text">
                    ${
                      includeMinHoursPolicy && tripType === "hourly"
                        ? "(Minimum Required)"
                        : ""
                    }
                    </span></strong>
                  </p>
                  ${
                    wedding
                      ? `<p class="quoteSpec"><i>${quoteSpec}</i></p>`
                      : ""
                  }
                      
                      <p>Base Rate: ${displayBaseRate} ${
    tripType === "hourly"
      ? `<span class="byob-text">(${hours.toFixed(2)} hrs @ $${formatNumber(
          perHourRate
        )} per hour)</span>`
      : tripType === "two-way"
      ? `<span class='byob-text'>(${formatNumber(
          twoWaysDisplayRate
        )} each way)</span>`
      : ""
  }</p>
                        <ul>
                      <li>STC: ${stcPercentage.toFixed(2)}%</li>
                      <li>Gratuity: $${formatNumber(fixedGratuity)}</li>
                      <li>Gas Fee: $${formatNumber(gasFee)}</li>
                      ${
                        securityGuardFee > 0
                          ? `<li>BYOB Security Guard Fee: $${formatNumber(
                              securityGuardFee
                            )}</li>`
                          : ""
                      }
                      ${
                        totalBYOBCost > 0
                          ? `<li>BYOB Security Cost: $${formatNumber(
                              totalBYOBCost
                            )} <span class="byob-text">(Chicago Trips Only)</span></li>`
                          : ""
                      }
                      ${
                        totalAdditionalCost > 0
                          ? `<li>Additional Hours Cost: $${formatNumber(
                              totalAdditionalCost
                            )} <span class="byob-text">(${customAdditionalHours.toFixed(
                              2
                            )} hrs @ $${formatNumber(
                              customRateAdditional
                            )})</span></li>`
                          : ""
                      }
                  </ul>
                  <p class="total"><strong>Total: $${formatNumber(
                    total
                  )}<span class="byob-text"> (Chicago BYOB add'l $150)</span></strong></p>
                  <p class="quote-expiry">(The quote expires in 14 days. Act Fast. <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>)</p>
                  ${
                  wedding
                    ? ""
                    : `<p><strong>Quote Includes:</strong> ${quoteIncludes}</p>`
                }
              </div>


               ${
                 includeAlcoholPolicy
                   ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>`
                   : ""
               }
              ${
                includeAlcoholPolicyCustom
                  ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>`
                  : ""
              }
               <p class="paragraph-reserve"><strong>How Do I Reserve?</strong> A 20% deposit is required to make the reservation. The remaining balance is due 14 days prior to the event.</p>
          <div class="reserve-btn">
              <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve ${
                wedding ? weddingPackagePrint : vehicleName
              } Now</a>
          </div>


          ${
            multipleOptionsCheckbox
              ? `
            <h2 class="vehicle-name">${vehicleName2} <span class="byob-text">(${paxNumber2} Passengers)</span><span class="vehicle-recommeded"> ${
                  !vehicleAvailable ? "(Recommended Vehicle)" : ""
                }</span></h2>

                 <p><strong>Vehicle Details: </strong>${vehicleDetails2}</p>

          <div class="image-container">
              <img src="${imageUrl2}" alt="${vehicleName2}" />
          </div>
          <div class="vehicle-name-link">
              <p><a href="${vehicleLink2}" target="_blank">(View More Pictures)</a></p>
          </div>
          <div class="details">
             

              

              
            
            <div class="quote-price">
            <p class="vehicle-name-quote-price">${vehicleName2} <span class="byob-text">(${paxNumber2} Passengers)</span></p>
                  <div class="quote-datetime">
                      <p><small>${dayOfWeek} ${formattedDate}</small></p>
                      <p><small>&nbsp;/ ${time2}</small></p>
                  </div>
                    <p class="quote-heading">
                    <strong>QUOTE: ${totalHours2} Hour Package <span class="byob-text">
                    ${
                      includeMinHoursPolicy && tripType === "hourly"
                        ? "(Minimum Required)"
                        : ""
                    }
                    </span></strong>
                  </p>
                      <p>Base Rate: ${displayBaseRate2} ${
                  tripType === "hourly"
                    ? `<span class="byob-text">(${hours2.toFixed(
                        2
                      )} hrs @ $${formatNumber(perHourRate2)} per hour)</span>`
                    : tripType === "two-way"
                    ? `<span class='byob-text'>(${formatNumber(
                        twoWaysDisplayRate
                      )} each way)</span>`
                    : ""
                }</p>
                        <ul>
                      <li>STC: ${stcPercentage.toFixed(2)}%</li>
                      <li>Gratuity: ${gratuityPercentage.toFixed(2)}%</li>
                      <li>Gas Fee: $${formatNumber(gasFee2)}</li>
                      ${
                        securityGuardFee > 0
                          ? `<li>BYOB Security Guard Fee: $${formatNumber(
                              securityGuardFee
                            )}</li>`
                          : ""
                      }
                      ${
                        totalBYOBCost > 0
                          ? `<li>BYOB Security Cost: $${formatNumber(
                              totalBYOBCost
                            )} <span class="byob-text">(Chicago Trips Only)</span></li>`
                          : ""
                      }
                      ${
                        totalAdditionalCost > 0
                          ? `<li>Additional Hours Cost: $${formatNumber(
                              totalAdditionalCost
                            )} <span class="byob-text">(${customAdditionalHours.toFixed(
                              2
                            )} hrs @ $${formatNumber(
                              customRateAdditional
                            )})</span></li>`
                          : ""
                      }
                  </ul>
                  <p class="total"><strong>Total: $${formatNumber(
                    total2
                  )}<span class="byob-text"> (Chicago BYOB add'l $150)</span></strong></p>
                  <p class="quote-expiry">(The quote expires in 14 days. Act Fast. <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve Now</a>)</p>
              
                  <p><strong>Quote Includes:</strong> ${quoteIncludes}</p>
                  </div>


               ${
                 includeAlcoholPolicy
                   ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>`
                   : ""
               }
              ${
                includeAlcoholPolicyCustom
                  ? `<div class="minimum-requirements">
              <p><strong>Alcohol Policy</strong> <span class="byob-text">(Security Guard Needed For Chicago Trips Only)</span><br> For 15+ passengers, a security guard is needed if there is alcohol on board within the city limits of Chicago. Security guard charge is an additional $50.00 per hour.</p>
            </div>`
                  : ""
              }
            

               <p class="paragraph-reserve"><strong>How Do I Reserve?</strong> A 20% deposit is required to make the reservation. The remaining balance is due 14 days prior to the event.</p>
          <div class="reserve-btn">
              <a href="https://www.wtglimo.com/reservation-limo.php" target="_blank">Reserve ${
                wedding ? weddingPackagePrint : vehicleName2
              }</a>
          </div>`
              : ""
          }
         
          
         
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

function saveQuote() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value; // New line to capture email
  const vehicleAvailable = document.getElementById("vehicle-available").checked;
  const vehicleType = document.getElementById("vehicle").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const hours = parseFloat(document.getElementById("hours").value) || 0;
  const includeAlcoholPolicy = document.getElementById(
    "include-alcohol-policy"
  ).checked;
  const includeMinHoursPolicy = document.getElementById(
    "include-min-hours-policy"
  ).checked;
  const includeAdditionalHours = document.getElementById(
    "include-additional-hours"
  ).checked;
  const includeBYOB = document.getElementById("include-byob").checked;
  const tripType = document.querySelector(
    'input[name="trip-type"]:checked'
  ).value;
  const quoteType = document.querySelector(
    'input[name="quote-type"]:checked'
  ).value;

  // Ensure a quote has been generated first
  if (!name || !email || !vehicleType || !date || !time) {
    alert("Please fill in all required fields and generate a quote first.");
    return;
  }

  // Use the correct total amount from the global variable
  let totalAmount = totalAmountGlobal;
  let totalAmount2 = totalAmountGlobal2;

  // Send data to the backend server to save the quote
  fetch("http://localhost:3000/save-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_name: name,
      customer_email: email, // Include the email here
      vehicle_type: vehicleType,
      quote_date: date,
      quote_time: time,
      total_amount: totalAmount,
      vehicle_available: vehicleAvailable,
      hours: hours,
      include_alcohol_policy: includeAlcoholPolicy,
      include_min_hours_policy: includeMinHoursPolicy,
      include_additional_hours: includeAdditionalHours,
      include_byob: includeBYOB,
      trip_type: tripType,
      quote_type: quoteType,
      // Add any other fields you need to save
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Success message from the server
      alert("Quote saved successfully!");
    })
    .catch((err) => {
      console.error("Error saving quote:", err);
      alert("Failed to save quote. Please try again.");
    });
}

const vehicles = {
  trolley_midnight_36: {
    vehicleName: "Trolley Midnight (36 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png",
    vehicleLink: "https://wtglimo.com/Naperville-trolley-bus-rental.php",
  },
  trolley_fusion_30: {
    vehicleName: "Trolley Fusion (30 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png",
    vehicleLink: "https://wtglimo.com/Chicago-trolley-bus-rental.php",
  },
  trolley_bliss_30: {
    vehicleName: "Trolley Bliss (30 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png",
    vehicleLink: "https://wtglimo.com/white-wedding-trolleys-Chicago.php",
  },
  trolley_classic_30: {
    vehicleName: "Trolley Classic (30 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png",
    vehicleLink: "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php",
  },
  trolley_festive_24: {
    vehicleName: "Trolley Festive (24 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png",
    vehicleLink: "https://wtglimo.com/Chicago-trolley-rental.php",
  },
  partybus_dove_40: {
    vehicleName: "Party Bus Dove (40 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg",
    vehicleLink: "https://wtglimo.com/chicago-party-bus-rental.php",
  },
  partybus_nightrider_30: {
    vehicleName: "Party Bus Night Rider (30 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png",
    vehicleLink: "https://wtglimo.com/libertyville-party-bus-rental.php",
  },
  partybus_eagle_25: {
    vehicleName: "Party Bus Eagle (25 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png",
    vehicleLink: "https://wtglimo.com/Palatine-party-bus-rental.php",
  },
  partybus_whitehawk_20: {
    vehicleName: "Party Bus White Hawk (20 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png",
    vehicleLink: "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php",
  },
  pink_hummer_h2: {
    vehicleName: "Pink Hummer H2 (18 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.png",
    vehicleLink: "https://wtglimo.com/hummer_pink_panther.php",
  },
  pink_chrysler_300: {
    vehicleName: "Pink Chrysler 300 (10 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png",
    vehicleLink: "https://wtglimo.com/pink-limo-rental-Chicago.php",
  },
  christmas_trolley: {
    vehicleName: "Christmas Trolley",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png",
    vehicleLink: "https://wtglimo.com/Christmas-trolley-tours-Chicago.php",
  },
  ford_transit_limo: {
    vehicleName: "Ford Transit Limo (15 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png",
    vehicleLink:
      "https://wtglimo.com/15-Passenger-Van-Rental-Chicago-Ford-Transit-Black.php",
  },
  sprinter_shuttle_van: {
    vehicleName: "Sprinter Shuttle Van (14 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png",
    vehicleLink: "https://wtglimo.com/sprinter_shuttle_van.php",
  },
  hummer_h2_stretch_limo: {
    vehicleName: "Hummer H2 Stretch Limo (20 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png",
    vehicleLink: "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php",
  },
  chrysler_300_limo: {
    vehicleName: "Chrysler 300 Limo (10 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png",
    vehicleLink: "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php",
  },
  lincoln_mkt_limo: {
    vehicleName: "Lincoln MKT Limo (10 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png",
    vehicleLink: "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php",
  },
  lincoln_navigator: {
    vehicleName: "Lincoln Navigator (6 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png",
    vehicleLink: "https://wtglimo.com/lincoln-navigator-limo.php",
  },
  cadillac_escalade: {
    vehicleName: "Cadillac Escalade (6 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png",
    vehicleLink: "https://wtglimo.com/cadillac-escalade-limo.php",
  },
  chevrolet_suburban: {
    vehicleName: "Chevrolet Suburban (6 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png",
    vehicleLink: "https://wtglimo.com/suv-limo-rental.php",
  },
  lincoln_mkz: {
    vehicleName: "Lincoln MKZ (3 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png",
    vehicleLink: "https://wtglimo.com/limo-car-service.php",
  },
  coach_bus_super: {
    vehicleName: "Coach Bus - Super (50 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png",
    vehicleLink: "https://wtglimo.com/chicago-Super-Coach-Bus.php",
  },
  coach_bus_rentals: {
    vehicleName: "Charter Bus - Everywhere (56 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png",
    vehicleLink: "https://wtglimo.com/chicago_coach_bus.php",
  },
  coach_bus_corporate: {
    vehicleName: "Coach Bus - Corporate (42 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png",
    vehicleLink: "https://wtglimo.com/executive_shuttle_bus.php",
  },
  coach_bus_crystal: {
    vehicleName: "Coach Bus Crystal (25 Passengers)",
    imageUrl:
      "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBusCrystal-main.png",
    vehicleLink: "https://wtglimo.com/executive_bus_crystal.php",
  },
};

function fetchQuotes(startDate, endDate) {
  // Construct the query parameters
  let url = "http://localhost:3000/quotes";
  const params = new URLSearchParams();

  if (startDate) {
    params.append("start_date", startDate);
  }
  if (endDate) {
    params.append("end_date", endDate);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Quotes:", data);
      displayQuotes(data);
    })
    .catch((err) => {
      console.error("Error fetching quotes:", err);
    });
}

function displayQuotes(quotes) {
  const quotesContainer = document.getElementById("quotes-container");
  quotesContainer.innerHTML = ""; // Clear previous quotes

  if (quotes.length === 0) {
    quotesContainer.innerHTML =
      "<p>No quotes found for the selected date(s).</p>";
    return;
  }

  quotes.forEach((quote) => {
    console.log("Quote:", quote);

    // Get vehicle info
    const vehicleKey = quote.vehicle_type;
    const vehicleInfo = vehicles[vehicleKey] || {
      vehicleName: "Unknown Vehicle",
      imageUrl: "https://example.com/default.jpg",
      vehicleLink: "#",
    };

    // Format dates and amounts
    const formattedQuoteDate = new Date(quote.quote_date).toLocaleDateString(
      "en-US"
    );
    const formattedAmount = parseFloat(quote.total_amount).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    );
    // Format the created_at date
    const formattedCreatedAt = new Date(quote.created_at).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

    const quoteElement = document.createElement("div");
    quoteElement.classList.add("quote-card"); // Add a class for styling

    quoteElement.innerHTML = `
      <div class="quote-card-content">
    
        <div class="quote-card-body">
        <h3>${vehicleInfo.vehicleName}</h3>
          <p class="quote-created-at">${formattedCreatedAt}</p>
          <p><strong>Customer Name:</strong> ${quote.customer_name}</p>
          <p><strong>Email:</strong> ${quote.customer_email || "N/A"}</p>
          <p><strong>Date:</strong> ${formattedQuoteDate}</p>
          <p><strong>Total Amount:</strong> ${formattedAmount}</p>
          <!-- Toggle Button -->
          <button class="toggle-details-btn">
            <i class="fas fa-chevron-down"></i> Show Details
          </button>
          <!-- Hidden Details -->
          <div class="quote-details" style="display: none;">
            <p><strong>Time:</strong> ${quote.quote_time}</p>
            <p><strong>Vehicle Available:</strong>
              <span class="availability ${
                quote.vehicle_available ? "available" : "unavailable"
              }">
                ${quote.vehicle_available ? "Yes" : "No"}
              </span>
            </p>
            <p><strong>Hours:</strong> ${quote.hours || "N/A"}</p>
            <p><strong>Trip Type:</strong> ${quote.trip_type || "N/A"}</p>
            <p><strong>Quote Type:</strong> ${quote.quote_type || "N/A"}</p>
            <p><strong>Include Alcohol Policy:</strong> ${
              quote.include_alcohol_policy ? "Yes" : "No"
            }</p>
            <p><strong>Include Min Hours Policy:</strong> ${
              quote.include_min_hours_policy ? "Yes" : "No"
            }</p>
            <p><strong>Include Additional Hours:</strong> ${
              quote.include_additional_hours ? "Yes" : "No"
            }</p>
            <p><strong>Include BYOB:</strong> ${
              quote.include_byob ? "Yes" : "No"
            }</p>
          </div>
          <div class="quote-card-actions">
            <button class="delete-quote-btn"><i class="fas fa-trash-alt"></i> Delete</button>
            <button class="copy-follow-up-btn"><i class="fas fa-copy"></i> Copy Follow Up</button>
            <button class="copy-text-message-btn"><i class="fas fa-sms"></i> Copy Text Message</button>
          </div>
        </div>
        <div class="quote-card-image">
          <img src="${vehicleInfo.imageUrl}" alt="${vehicleInfo.vehicleName}">
        </div>
      </div>
    `;

    quotesContainer.appendChild(quoteElement);

    // Add event listener for toggle button
    const toggleBtn = quoteElement.querySelector(".toggle-details-btn");
    const detailsDiv = quoteElement.querySelector(".quote-details");
    toggleBtn.addEventListener("click", function () {
      if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
        toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
      } else {
        detailsDiv.style.display = "none";
        toggleBtn.innerHTML =
          '<i class="fas fa-chevron-down"></i> Show Details';
      }
    });

    // Add event listener for delete button
    const deleteBtn = quoteElement.querySelector(".delete-quote-btn");
    deleteBtn.addEventListener("click", function () {
      deleteQuote(quote.id);
    });

    // Add event listener for copy follow up button
    const copyFollowUpBtn = quoteElement.querySelector(".copy-follow-up-btn");
    copyFollowUpBtn.addEventListener("click", function () {
      copyFollowUp(quote);
    });

    // Add event listener for the new text message button
    const copyTextMessageBtn = quoteElement.querySelector(
      ".copy-text-message-btn"
    );
    copyTextMessageBtn.addEventListener("click", function () {
      copyTextMessage(quote);
    });
  });
}

function copyTextMessage(quote) {
  const name = quote.customer_name;
  const vehicleKey = quote.vehicle_type;
  const price = parseFloat(quote.total_amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const vehicleInfo = vehicles[vehicleKey] || {
    vehicleName: "Unknown Vehicle",
    imageUrl: "https://example.com/default.jpg",
    vehicleLink: "#",
  };

  const message = `Hi ${name},\nYour ${vehicleInfo.vehicleName} quote of $${price} is expiring soon. Act fast and book online!`;

  // Copy the message to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    // Use the modern Clipboard API
    navigator.clipboard.writeText(message).then(
      function () {
        // Success: No alert needed
      },
      function (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy the text message. Please try again.");
      }
    );
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = message;

    // Avoid scrolling to the bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (!successful) {
        alert("Failed to copy the text message. Please try again.");
      }
      // Success: No alert needed
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy the text message. Please try again.");
    }

    document.body.removeChild(textArea);
  }
}

function copyFollowUp(quote) {
  const name = quote.customer_name;
  const vehicleKey = quote.vehicle_type;
  const price = parseFloat(quote.total_amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const vehicleInfo = vehicles[vehicleKey] || {
    vehicleName: "Unknown Vehicle",
    imageUrl: "https://example.com/default.jpg",
    vehicleLink: "#",
  };

  const reserveLink = "https://wtglimo.com/reservation-limo.php";

  const message = `
   <style>
    html, body{
  font-family: Arial, sans-serif;
}
  h1, h2 {
    color: #333;
    text-align: center;
    margin-top: 0;
  }
  
  label, select, input {
    font-size: 16px;
    margin: 5px 0;
    display: block;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  select, input[type="text"], input[type="number"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[type="submit"] {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: #4CAF50;
    color: white;
    border-radius: 4px;
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  input[type="submit"]:hover {
    background-color: #45a049;
  }

  #output {
  font-size: 16px;
  white-space: normal;
  max-width: 600px;
  font-family: Arial, sans-serif;
}
.btm-mrg-none{
margin-bottom: 0;}
.top-mrg-none{
margin-top: 0;}
.btm-mrg{
  margin-bottom: 10px;
}
.btm-mrg-xl{
  margin-bottom: 20px;
}

.btm-mrg-xxl{
  margin-top: 20px;
}
  .highlight {
  
    font-weight: bold;
    font-size: 15px;
  }

  .book-now {
    display: inline;
    background-color: #008000;
    color: white;
    padding: 8px 15px;
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 5px;

  }

  .book-now:hover {
    background-color: #006d00;
  }

  .vehicleName{
    color: black;
    text-decoration: none;
  }


  .btn-copy {
    background-color: #007BFF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: block;
    margin-top: 30px;
  }
  
  .btn-copy:hover {
    background-color: #0056b3;
  }
  
  hr {
    border: 0;
    border-top: 1px solid #ccc;
    margin: 30px 0 0 0;
    max-width: 40px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 50px;
}

.form-section, .output-section {
  width: 48%; /* Adjust as needed */
}

.form-section {
  display: flex;
  flex-direction: column;
}

.output-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}





  </style>
    <p>Hi ${name},</p>
    <p class="btm-mrg">The quote of <span class="highlight">$${price}</span> is <span class="highlight">expiring soon.</span> Therefore, I'm reaching out to see if you're still interested in the <a href="${vehicleInfo.vehicleLink}" class="highlight vehicleName" target="_blank">${vehicleInfo.vehicleName}</a> or have any questions.</p>
    <p><img src="${vehicleInfo.imageUrl}" alt="${vehicleKey}" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); width: 100%; height: auto; object-fit: cover;"></p>
    <p><a href="${vehicleInfo.vehicleLink}" class="highlight btm-mrg-xl" target="_blank">View More</a></p>
    <p class="btm-mrg-none">A 20% deposit is required to hold the vehicle. The availability is limited.</p>
    <p class="btm-mrg-xl top-mrg-none">Secure your vehicle now!</p>
    <p><a href="${reserveLink}" class="book-now" target="_blank">RESERVE NOW</a></p>
    <hr>
  `;

  // Use the Clipboard API to write HTML content
  const blobInput = new Blob([message], { type: "text/html" });
  const clipboardItemInput = new ClipboardItem({ "text/html": blobInput });

  navigator.clipboard.write([clipboardItemInput]).then(
    function () {
      // Success: No alert needed
    },
    function (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy the follow-up message. Please try again.");
    }
  );
}

function deleteQuote(quoteId) {
  if (confirm("Are you sure you want to delete this quote?")) {
    fetch(`http://localhost:3000/delete-quote/${quoteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the quote");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message); // Show success message from the server
        fetchQuotes(); // Reload the quotes after deletion
      })
      .catch((err) => {
        console.error("Error deleting quote:", err);
        alert("Failed to delete the quote. Please try again.");
      });
  }
}

document.getElementById("filter-button").addEventListener("click", () => {
  const startDate = document.getElementById("filter-start-date").value;
  const endDate = document.getElementById("filter-end-date").value;

  if (!startDate && !endDate) {
    alert("Please select at least one date to filter.");
    return;
  }

  fetchQuotes(startDate, endDate);
});
