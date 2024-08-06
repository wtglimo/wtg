function generateMessage() {
    const name = document.getElementById('name').value;
    const vehicleSelect = document.getElementById('vehicle');
    const vehicleKey = vehicleSelect.options[vehicleSelect.selectedIndex].value;
    const price = document.getElementById('price').value;
  
    const vehicles = {
      "trolley_midnight_36": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyMidnight-main.png",
        vehicleLink: "https://wtglimo.com/Naperville-trolley-bus-rental.php"
      },
      "trolley_fusion_30": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFusion-main.png",
        vehicleLink: "https://wtglimo.com/Chicago-trolley-bus-rental.php"
      },
      "trolley_bliss_30": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyBliss-main.png",
        vehicleLink: "https://wtglimo.com/white-wedding-trolleys-Chicago.php"
      },
      "trolley_classic_30": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyClassic-main.png",
        vehicleLink: "https://wtglimo.com/Chicago-wedding-trolley-bus-rental.php"
      },
      "trolley_festive_24": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/trolleyFestive-main.png",
        vehicleLink: "https://wtglimo.com/Chicago-trolley-rental.php"
      },
      "partybus_dove_40": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBus-Dove-main.jpg",
        vehicleLink: "https://wtglimo.com/chicago-party-bus-rental.php"
      },
      "partybus_nightrider_30": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/nightRider-main.png",
        vehicleLink: "https://wtglimo.com/libertyville-party-bus-rental.php"
      },
      "partybus_eagle_25": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/eagle-main.png",
        vehicleLink: "https://wtglimo.com/Palatine-party-bus-rental.php"
      },
      "partybus_whitehawk_20": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/whiteHawk-main.png",
        vehicleLink: "https://wtglimo.com/Arlington-Heights-Party-Bus-Rental.php"
      },
      "pink_hummer_h2": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkHummer-main.png",
        vehicleLink: "https://wtglimo.com/hummer_pink_panther.php"
      },
      "pink_chrysler_300": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/pinkChrysler-main.png",
        vehicleLink: "https://wtglimo.com/pink-limo-rental-Chicago.php"
      },
      "christmas_trolley": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/christmasTrolleyMain.png",
        vehicleLink: "https://wtglimo.com/Christmas-trolley-tours-Chicago.php"
      },
      "ford_transit_limo": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/tranitBlack-main.png",
        vehicleLink: "https://wtglimo.com/limo-van.php"
      },
      "sprinter_shuttle_van": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/sprinter-main.png",
        vehicleLink: "https://wtglimo.com/sprinter_shuttle_van.php"
      },
      "hummer_h2_stretch_limo": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/hummerWhite-main.png",
        vehicleLink: "https://wtglimo.com/suv_stretch_limousine_hummer_galaxy.php"
      },
      "chrysler_300_limo": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/chrysler300-main.png",
        vehicleLink: "https://wtglimo.com/sedan_stretch_limo_chrysler_300_limo.php"
      },
      "lincoln_mkt_limo": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKT-main.png",
        vehicleLink: "https://wtglimo.com/sedan_stretch_limo_lincoln_MKT_limo.php"
      },
      "lincoln_navigator": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/navigator-main.png",
        vehicleLink: "https://wtglimo.com/lincoln-navigator-limo.php"
      },
      "cadillac_escalade": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/cadillac-main.png",
        vehicleLink: "https://wtglimo.com/cadillac-escalade-limo.php"
      },
      "chevrolet_suburban": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/suburban-main.png",
        vehicleLink: "https://wtglimo.com/suv-limo-rental.php"
      },
      "lincoln_mkz": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/lincolnMKZ-main.png",
        vehicleLink: "https://wtglimo.com/limo-car-service.php"
      },
      "coach_bus_super": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/superCoach-main.png",
        vehicleLink: "https://wtglimo.com/chicago-Super-Coach-Bus.php"
      },
      "coach_bus_rentals": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/coachBusEverywhere-main.png",
        vehicleLink: "https://wtglimo.com/chicago_coach_bus.php"
      },
      "coach_bus_corporate": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/exrcutiveBus-main.png",
        vehicleLink: "https://wtglimo.com/executive_shuttle_bus.php"
      },
      "coach_bus_crystal": {
        imageUrl: "https://wtglimo.com/img/lightbox/large/vehicle-main/partyBusCrystal-main.png",
        vehicleLink: "https://wtglimo.com/executive_bus_crystal.php"
      }
    };
  
    const reserveLink = "https://wtglimo.com/reservation-limo.php";
    const vehicleInfo = vehicles[vehicleKey] || { imageUrl: "https://example.com/default.jpg", vehicleLink: "#" };
  
    const message = `
    <p>Hi ${name},</p>
    <p>I'm reaching out to see if you're still interested in the <a href="${vehicleInfo.vehicleLink}" class="highlight" target="_blank">${vehicleKey.replace('_', ' ').toUpperCase()}</a> or have any questions.</p>
    <p><img src="${vehicleInfo.imageUrl}" alt="${vehicleKey}" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); width: 100%; height: auto; object-fit: cover;"></p>
    <p><a href="${vehicleInfo.vehicleLink}" class="highlight" target="_blank">View Vehicle Page</a></p>
    <p>The quote of <span class="highlight">$${price}</span> is expiring soon, and the vehicle is still available.</p>
    <p>Secure your booking now by clicking <a href="${reserveLink}" class="book-now" target="_blank">RESERVE NOW</a></p>
  `;
  
  
    document.getElementById('output').innerHTML = message;
  }
  