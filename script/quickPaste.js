// script/quickPaste.js
// Quick Paste -> auto-fill form fields (includes drop-off time from hours)

(function () {
  function setValue(id, value, { trigger = true } = {}) {
    const el = document.getElementById(id);
    if (!el) return false;

    el.value = value;

    if (trigger) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  function findSelectOptionValueByText(selectEl, wantedText) {
    if (!selectEl) return null;
    const norm = (s) => (s || "").toString().trim().toLowerCase();
    const target = norm(wantedText);

    for (const opt of selectEl.options) {
      if (norm(opt.text) === target) return opt.value;
    }
    for (const opt of selectEl.options) {
      if (norm(opt.text).includes(target)) return opt.value;
    }
    return null;
  }

  function parseLeadText(text) {
    const out = {};
    const lines = (text || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const m = line.match(/^([^:]+)\s*:\s*(.+)$/);
      if (!m) continue;
      const key = m[1].trim().toLowerCase();
      const val = m[2].trim();
      out[key] = val;
    }
    return out;
  }

  function normalizeDateToInput(dateStr) {
    const s = (dateStr || "").trim();
    const mmddyyyy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (mmddyyyy) {
      const mm = mmddyyyy[1].padStart(2, "0");
      const dd = mmddyyyy[2].padStart(2, "0");
      const yyyy = mmddyyyy[3];
      return `${yyyy}-${mm}-${dd}`;
    }
    const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) return s;
    return "";
  }

  function normalizeTimeToInput(timeStr) {
    const s = (timeStr || "").trim();
    const hm24 = s.match(/^(\d{1,2}):(\d{2})$/);
    if (hm24) {
      const h = String(
        Math.min(23, Math.max(0, parseInt(hm24[1], 10))),
      ).padStart(2, "0");
      const m = hm24[2];
      return `${h}:${m}`;
    }

    const ampm = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampm) {
      let h = parseInt(ampm[1], 10);
      const m = (ampm[2] || "00").padStart(2, "0");
      const ap = ampm[3].toUpperCase();
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${m}`;
    }

    return "";
  }

  function extractHours(raw) {
    if (!raw) return 0;
    const s = String(raw).toLowerCase();
    // accept: "3 Hour", "3 Hours", "3.5", "3.5 hours", etc.
    const m = s.match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  }

  function addHoursToTimeHHMM(timeHHMM, hoursToAdd) {
    // timeHHMM: "17:30"
    // hoursToAdd: 3.5
    const m = String(timeHHMM || "").match(/^(\d{2}):(\d{2})$/);
    if (!m) return "";

    const startH = parseInt(m[1], 10);
    const startM = parseInt(m[2], 10);

    const totalStartMinutes = startH * 60 + startM;
    const addMinutes = Math.round(hoursToAdd * 60);

    let total = totalStartMinutes + addMinutes;
    // wrap around 24h
    total = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);

    const endH = Math.floor(total / 60);
    const endM = total % 60;

    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }

  function applyLeadToForm(lead) {
    // Name
    if (lead["name"]) setValue("name", lead["name"]);

    // Email (optional)
    if (lead["email"]) setValue("email", lead["email"], { trigger: false });

    // Phone Number (optional)
    if (lead["phone number"]) setValue("phone", lead["phone number"], { trigger: false });

    // Event Date -> #date
    if (lead["event date"]) {
      const d = normalizeDateToInput(lead["event date"]);
      if (d) setValue("date", d);
    }

    // Pick up time -> #time
    const pickupRaw = lead["pick up time"] || lead["pickup time"];
    if (pickupRaw) {
      const t = normalizeTimeToInput(pickupRaw);
      if (t) setValue("time", t);
    }

    // Hours -> #hours
    const hoursRaw = lead["number of hours"] || lead["hours"];
    const hoursNum = extractHours(hoursRaw);
    if (hoursNum) setValue("hours", String(hoursNum));

    // Drop off time:
    // Priority:
    // 1) If pasted explicitly, use it
    // 2) Else compute from pickup time + hours
    const dropRaw = lead["drop off time"] || lead["dropoff time"];
    if (dropRaw) {
      const t = normalizeTimeToInput(dropRaw);
      if (t) setValue("drop-off-time", t);
    } else {
      const pickupEl = document.getElementById("time");
      const dropEl = document.getElementById("drop-off-time");
      const pickupVal = pickupEl ? pickupEl.value : "";
      if (dropEl && pickupVal && hoursNum) {
        const computed = addHoursToTimeHHMM(pickupVal, hoursNum);
        if (computed) setValue("drop-off-time", computed);
      }
    }

    // Event Type (match by option TEXT)
    if (lead["event type"]) {
      const select = document.getElementById("event-type");
      const val = findSelectOptionValueByText(select, lead["event type"]);
      if (val) setValue("event-type", val);
    }

    // Vehicle Type (match by option TEXT)
    if (lead["vehicle type"]) {
      const select = document.getElementById("vehicle");
      const val = findSelectOptionValueByText(select, lead["vehicle type"]);
      if (val) setValue("vehicle", val);
    }
  }

  function init() {
    const ta = document.getElementById("quick-paste");
    const applyBtn = document.getElementById("quick-paste-apply");
    const clearBtn = document.getElementById("quick-paste-clear");

    if (!ta || !applyBtn || !clearBtn) return;

    const apply = () => {
      const lead = parseLeadText(ta.value);
      applyLeadToForm(lead);

      if (typeof window.calculateQuote === "function") window.calculateQuote();
      if (typeof window.updateRates === "function") window.updateRates();
    };

    applyBtn.addEventListener("click", apply);

    clearBtn.addEventListener("click", () => {
      ta.value = "";
      ta.focus();
    });

    // Auto-apply on paste
    ta.addEventListener("paste", () => setTimeout(apply, 0));
  }

  document.addEventListener("DOMContentLoaded", init);
})();


document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("quick-paste-toggle");
  const body = document.getElementById("quick-paste-body");
  if (!toggleBtn || !body) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = body.style.display === "none";
    body.style.display = isHidden ? "block" : "none";
    toggleBtn.textContent = isHidden ? "Hide" : "Show";
  });
});
