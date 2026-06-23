import globals from "./globals";
import { drawBilateralMap } from "./drawMap";
import { populatePartnerOverview } from "./populatePartnerCard";

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

export function resetLayout() {
  // reset state to zero. return to initial state
  currentPartner = null;
  document.querySelectorAll(".countrySelect").forEach((item) => 
    item.classList.remove("active"));
  const zone = document.querySelector(".partner-overview-zone");
  if (zone) {
    zone.innerHTML = "";
    zone.appendChild(createEmptyState());
  }
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
  })
}
// to build the right panel structure
// the panel ahs 3 fixed zones stacked vertically 
// 1. navigation instructions - always visible
// 2. partner overview zone - empty until a partner is selected
//    then populated by populatePartnerOverview()
// 3. Accordions - About and source, always visible 
function renderPanel() {
  const card = document.querySelector(".card.partnership");
  if (!card) {
    console.error(".card.partnership not found. Check HTML structure");
    return;
  }
  card.innerHTML = "";

  // Zone 1: instructions
  card.appendChild(createNavigationSteps());
  // Zone 2: partner overview - we give this a stable class so
  // populatepartneroverview can find and replate its contents
  // without touching the zone above or below it
  const overviewZone = document.createElement("div");
  overviewZone.classList.add("panel-section", "partner-overview-zone");
  overviewZone.appendChild(createEmptyState());
  card.appendChild(overviewZone);

  // Zone 3: accordions
  card.appendChild(createAccordion(
    "About this dataset",
    `Africa's energy transition is at a critical crossroads, with financing 
     as a central challenge. Our database maps trade, investment, and flagship 
     green projects between African countries and three major actors: China, 
     the EU, and Gulf countries. We cross-check datasets, distinguish pledged 
     from disbursed funds, and add qualitative caveats.`
  ));
  card.appendChild(createAccordion(
    "Sources",
    `<a href="#" class="source-link">IMF Database</a>
     <a href="#" class="source-link">World Bank Database</a>
     <a href="#" class="source-link">China Global Investment Tracker</a>
     <a href="#" class="source-link">Gulf Renewable Projects Tracker</a>`
  ));
}

// ----- Builder helpers -----
// Each function build and returns a DOM node
// Dont touch the DOMS. The caller decides where to append

function createEmptyState() {
  const p = document.createElement("p");
  p.classList.add("empty-state");
  p.textContent = "Select a partner from the sidebar to begin exploring";
  return p;
}

function createNavigationSteps() {
  const section = document.createElement("div");
  section.classList.add("panel-section");

  const label = document.createElement("p");
  label.classList.add("section-label");
  label.textContent = "How to navigate";
  section.appendChild(label);

  const steps = [
    "Select a foreign actor from the sidebar", 
    "Click an African country on the map",
    "Browse the bilateral detail sheet"
  ];
  steps.forEach((text, i) => {
    const row = document.createElement("div");
    row.classList.add("step-row");
    const num = document.createElement("div");
    num.classList.add("step-num");
    num.textContent = i + 1;
    const stepText = document.createElement("span");
    stepText.classList.add("step-text");
    stepText.textContent = text;

    row.appendChild(num);
    row.appendChild(stepText);
    section.appendChild(row);
  });
  return section;
}

// toggle logic lives inside the function 
// no external state is needed because body and icon are captured
// in the event listeners closure
function createAccordion(title, content) {
  const section = document.createElement("div");
  section.classList.add("panel-section")
  const row = document.createElement("div");
  row.classList.add("accordion-row");
  row.style.cursor = "pointer";
  const titleEl = document.createElement("span");
  titleEl.classList.add("acc-title");
  titleEl.textContent = title;
  const icon = document.createElement("span");
  icon.classList.add("acc-icon");
  icon.textContent = "›";
  icon.style.transition = "transform 0.2s";

  row.appendChild(titleEl);
  row.appendChild(icon);

  const body = document.createElement("div");
  body.classList.add("acc-body");
  body.innerHTML = content;
  body.style.display = "none";

  row.addEventListener("click", () => {
    const isOpen = body.style.display !== "none";
    body.style.display = isOpen ? "none" : "block";
    icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(90deg)";
  });
  section.appendChild(row);
  section.appendChild(body);
}
