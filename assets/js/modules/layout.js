import globals from "./globals.js";
import { drawBilateralMap } from "./drawMap.js";
import { populatePartnerOverview } from "./cards.js";

const { databases } = globals;

//Store currently selected partner
let currentPartner = null;

export function initLayout() {
  renderSidebar();
  renderPanel();
}
export function onPartnerSelect(partnerName) {
  // Module state
  currentPartner = partnerName;

  // udpate sidebar active styles
  document.querySelectorAll(".countrySelect").forEach((item) => {
    const itemPartner = item.querySelector(".label")?.textContent.trim();
    item.classList.toggle("active", itemPartner == partnerName);
  });
  // Redraw map for selected partner
  const mergedData = databases.mergedBilateralData;
  if (!mergedData) {
    console.error("mergedbilateralData not ready. initializeDatabases awaits?");
    return;
  }
  drawBilateralMap(mergedData, partnerName);
  // Update right panel
  populatePartnerOverview(partnerName);
}

// so that drawMap.js can read selected partner
// and to avoid coupled js script
// drawMap.js calls this inside its click handler to know
// which partner is active when a country is clicked
export function getCurrentPartner() {
  return currentPartner;
}

function renderSidebar() {
  const items = document.querySelectorAll(".countrySelect");
  if (!items.length) {
    console.error("No .countrySelect elements found. Check HTML structure");
    return;
  }
  items.forEach((item) => {
    const partnerName = item.querySelector(".label")?.textContent.trim();
    if (!partnerName) return;

    // remove any existing eventlisteners that old code might
    // have attached - by cloning
    const freshItem = item.cloneNode(true);
    item.parentNode.replaceChild(freshItem, item);
    freshItem.addEventListener("click", () => onPartnerSelect(partnerName));
    freshItem.addEventListener("mouseover", function () {
      this.classList.add("hovered");
    });
    freshItem.addEventListener("mouseout", function () {
      this.classList.remove("hovered");
    });
  });
}
// to build the right panel structure
// the panel ahs 3 fixed zones stacked vertically
// 1. navigation instructions - always visible
// 2. partner overview zone - empty until a partner is selected
//    then populated by populatePartnerOverview()
// 3. Accordions - About and source, always visible
function renderPanel() {
  const card = document.querySelector(".card.partnership");
  if (!card) return
  card.innerHTML = "";

  const zone = document.createElement("div");
  zone.classList.add("vis-panel__zone", "partner-overview-zone");
  card.appendChild(zone);
}