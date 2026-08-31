import globals from "./globals.js";

const { partnerDivStyle, databases, cooperation, keyDrivers, overviewText, partnerSourceLinks, statStrip, partnerCountryText, trendConfig } = globals;

export function renderOverviewPanel() {
  const card = document.querySelector(".card.partnership");
  if (!card) return;
  card.innerHTML = "";

  // About zone - Bootstrap accordion
  const accordionWrapper = document.createElement("div");
  accordionWrapper.classList.add("accordion", "accordion-flush", "vis-panel__zone");
  accordionWrapper.id = "overviewAccordion";
  const aboutText = `Africa’s energy transition is at a critical crossroads, with financing as a central challenge. Three major actors, China, the European Union and the Gulf countries play leading but distinct roles. This database maps trade, investment, and flagship green projects between African countries and these actors, using primary data and secondary sources including the International Monetary Fund, the World Bank, the Organisation for Economic Co-operation and Development, the Global Gateway, the China Global Investment Tracker, and the Gulf Renewable Projects Tracker. To ensure accuracy, we cross-check datasets, distinguish pledged from disbursed funds, and add qualitative caveats.`;
  accordionWrapper.appendChild(createBootstrapAccordion("about", "About this visualization", `<p class="partner-subtitle vis-panel__zone-text">${aboutText}</p>`));
  card.appendChild(accordionWrapper);

  // How to navigate
  card.appendChild(createNavigationSteps());

  const trendLabelEl = document.createElement("p");
  trendLabelEl.classList.add("vis-panel__zone-label");
  trendLabelEl.textContent = "Investment trend";

  const trendList = document.createElement("div");
  trendList.style.cssText = "display:flex;flex-direction:column;gap:5px;";
  [
    { icon: "arrow-up.svg", filter: "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg)", label: "Increasing" },
    { icon: "arrow-down.svg", filter: "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)", label: "Decreasing" },
    { icon: "minus.svg", filter: "invert(50%)", label: "Stable" },
  ].forEach(({ icon, filter, label }) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;";
    row.innerHTML = `<img src="/assets/img/icons/${icon}" style="width:14px;height:14px;filter:${filter};"><span class="vis-step__text vis-panel__zone-text">${label}</span>`;
    trendList.appendChild(row);
  });

  // Sources zone
  const sourcesZone = document.createElement("div");
  sourcesZone.classList.add("vis-panel__zone");
  const sourcesLabel = document.createElement("p");
  sourcesLabel.classList.add("vis-panel__zone-label");
  sourcesLabel.textContent = "Data sources";
  sourcesLabel.style.marginTop = "18px";
  sourcesZone.appendChild(sourcesLabel);
  // Sources accordion item
  const sourcesLinks = [
    { label: "IMF Database", url: "#" },
    { label: "World Bank Database", url: "#" },
    { label: "China Global Investment Tracker", url: "#" },
    { label: "Gulf Renewable Projects Tracker", url: "#" },
  ]
    .map(({ label, url }) => `<a href="${url}" target="_blank" class="source-link vis-panel__zone-text">${label}</a>`)
    .join("");
  accordionWrapper.appendChild(createBootstrapAccordion("sources", "Data sources", sourcesLinks));
}

// Called by layout.js -> onPartnerSelect()
// Fills .partner-overview-zone with partner title, text, stats, and African partners list
export function populatePartnerOverview(partnerName) {
  let zone = document.querySelector(".partner-overview-zone");
  if (!zone) {
    // renderOverviewPanel wiped it - recreate it
    const card = document.querySelector(".card.partnership");
    if (!card) return;
    zone = document.createElement("div");
    zone.classList.add("partner-overview-zone");
    card.innerHTML = "";
    card.appendChild(zone);
  }
  zone.innerHTML = "";

  // Fixed content — never scrolls
  const header = document.createElement("div");
  header.classList.add("vis-panel__zone");

  const title = document.createElement("p");
  title.classList.add("partner-title");
  title.textContent = partnerName;
  header.appendChild(title);

  header.appendChild(createStatStrip(partnerName));

  const body = document.createElement("p");
  body.classList.add("partner-subtitle", "vis-panel__zone-text");
  body.innerHTML = overviewText[partnerName] || "No overview available.";
  header.appendChild(body);

  const link = partnerSourceLinks[partnerName];
  if (link) {
    const sourceLink = document.createElement("a");
    sourceLink.href = link;
    sourceLink.target = "_blank";
    sourceLink.classList.add("cardLink", "d-inline-flex", "align-items-center", "gap-1");
    sourceLink.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    <span>View source</span>
  `;
    header.appendChild(sourceLink);
  }
  const hint = document.createElement("p");
  hint.classList.add("hint");
  hint.textContent = "← Click a country on the map to see the bilateral detail";
  header.appendChild(hint);

  zone.appendChild(header);
}

export function populateCountryCard(countryName, selectedPartner, onPartnerSelect) {
  //console.log("selected Partner", selectedPartner);
  //console.log("country name", countryName);
  // Write into the overview zone only, not the whole card
  // The navigation steps and accordions must stay intact so
  // populatePartnerOverview can find the zone again when the user
  // clicks back to a non-African partner
  const zone = document.querySelector(".partner-overview-zone");
  if (!zone) {
    console.error("populateCountryCard: .partner-overview-zone not found");
    return;
  }
  zone.innerHTML = "";

  // Pass onPartnerSelect into createBreadCrum so it can call back correctly
  // If onPartnerSelect is not provided (legacy call), falls back to populatePartnerCard
  const backFn = onPartnerSelect || (() => populatePartnerOverview(selectedPartner));
  zone.appendChild(createBreadCrumb(selectedPartner, backFn));
  zone.appendChild(createTitle(`${selectedPartner} - ${countryName}`));

  const selectedCountryData = databases.reshapedBiData[selectedPartner]?.find((entry) => entry["African Country"] === countryName);
  if (!selectedCountryData) {
    zone.appendChild(
      Object.assign(document.createElement("p"), {
        textContent: "No data available for this country.",
      }),
    );
    return;
  }
  // Add text economic engagement
  const engageText = partnerCountryText[selectedPartner]["Engagement"][countryName];
  const engagementDiv = createTextSection("Economic Engagement & Investment", engageText);
  zone.appendChild(engagementDiv);
  // Investment section
  const investmentText = partnerCountryText[selectedPartner]["Investment"][countryName];
  const investmentTextDiv = createTextSection("Green Investments", investmentText);
  investmentTextDiv.appendChild(createCooperationDiv(selectedCountryData, "h5"));
  zone.appendChild(investmentTextDiv);

  initTooltips(zone);
}

// Private: bootstrap accordion builder
function createBootstrapAccordion(id, title, contentHTML) {
  const item = document.createElement("div");
  item.classList.add("accordion-item");
  item.innerHTML = `
  <h2 class="accordion-header" id="heading-${id}">
      <button class="accordion-button collapsed vis-panel__zone-label"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse-${id}"
              aria-expanded="false"
              aria-controls="collapse-${id}">
        ${title}
      </button>
    </h2>
  <div id="collapse-${id}"
         class="accordion-collapse collapse"
         aria-labelledby="heading-${id}">
      <div class="accordion-body">
        ${contentHTML}
      </div>
    </div>
  `;
  return item;
}

// --- partner overview panel helper ---
// Helper — also used by renderOverviewPanel
function createNavigationSteps() {
  const section = document.createElement("div");
  section.classList.add("panel-section");

  const label = document.createElement("p");
  label.classList.add("vis-panel__zone-label");
  label.textContent = "How to navigate";
  section.appendChild(label);

  const steps = ["Select a foreign actor from the sidebar", "Click an African country on the map", "Browse the bilateral detail sheet"];

  steps.forEach((text, i) => {
    const row = document.createElement("div");
    row.classList.add("vis-step");

    const num = document.createElement("div");
    num.classList.add("vis-step__num");
    num.textContent = i + 1;

    const stepText = document.createElement("span");
    stepText.classList.add("vis-step__text", "vis-panel__zone-text");
    stepText.textContent = text;

    row.appendChild(num);
    row.appendChild(stepText);
    section.appendChild(row);
  });

  return section;
}

// Builds one mini-card per African partner country for the scannable list
// Shows: country name, trend indicator, cooperation tags, flagship count
// No click handler, clicking a country on the map triggers populateCountryCard
function createPartnershipMiniCard(entry) {
  const card = document.createElement("div");
  card.classList.add("card-body", "partner");

  const title = document.createElement("h6");
  title.classList.add("card-title", "listPartners", "gap-2", "mb-1");
  title.textContent = entry["African Country"];
  card.appendChild(title);

  if (entry["Economic and Investment Trend"] !== "No data") {
    card.appendChild(createTrendIndicator(entry["Economic and Investment Trend"]));
  }

  if (entry["Areas of Cooperation - Categories"] !== "No data") {
    card.appendChild(createCooperationDiv(entry));
  }

  if (entry["Number of Flagship Green Projects"] !== "No data") {
    const flagship = document.createElement("p");
    flagship.classList.add("card-text", "mb-1", "flagshipProjects");
    flagship.innerHTML = `<span>No. Flagship Green Projects:</span> ${entry["Number of Flagship Green Projects"]}`;
    card.appendChild(flagship);
  }
  return card;
}

// --- populateCountryCard helpers ---
function createBreadCrumb(selectedPartner, backFn) {
  const breadcrumb = document.createElement("p");
  breadcrumb.classList.add("breadcrumb-nav");
  breadcrumb.innerHTML = `<span class="back-link">← ${selectedPartner}</span>`;
  const link = breadcrumb.querySelector(".back-link");
  link.style.cursor = "pointer";
  link.addEventListener("click", () => backFn(selectedPartner));
  return breadcrumb;
}

function createTitle(text) {
  const title = document.createElement("h4");
  title.classList.add("card-title", "partner-select");
  title.textContent = text;
  return title;
}
function createTextSection(title, text) {
  const container = document.createElement("div");
  container.classList.add("tab-content", "mt-2", "mb-2");
  container.innerHTML = `
    <h5 class="card-title partner-select">${title}</h5>
    ${text || "No text available."}
  `;
  return container;
}

// ---- shared helper function ----
function createStatStrip(selectedPartner) {
  const div = document.createElement("div");
  div.classList.add("statStrip");
  div.innerHTML = `
    <div class="stat">
      <span class="statValue">${statStrip.foreignInvest[selectedPartner]}</span>
      <span class="statLabel">FDI</span>
    </div>
    <div class="stat">
      <span class="statValue">${statStrip.tradeDeficit[selectedPartner]}</span>
      <span class="statLabel">Trade <br> deficit</span>
    </div>
    <div class="stat">
      <span class="statValue">${statStrip.NProjects[selectedPartner]}</span>
      <span class="statLabel">Flagship projects</span>
    </div>
  `;
  return div;
}

function createTrendIndicator(trendValue) {
  const div = document.createElement("div");
  div.classList.add("d-flex", "align-items-center", "mb-1", "gap-2");

  const label = document.createElement("p");
  label.classList.add("trendLabel", "my-auto");
  label.textContent = "Investment trend:";

  const icon = document.createElement("img");
  icon.style.cssText = "width:20px;height:20px;";
  icon.setAttribute("data-bs-toggle", "tooltip");

  const config = trendConfig[trendValue];
  if (config) {
    icon.src = `/assets/img/icons/${config.src}`;
    icon.setAttribute("title", config.title);
    icon.style.filter = config.filter;
    new bootstrap.Tooltip(icon);
  }

  div.appendChild(label);
  div.appendChild(icon);
  return div;
}
function createCooperationDiv(data, labelTag = "p") {
  const div = document.createElement("div");
  div.classList.add("card-text", "mb-1");
  div.style.display = partnerDivStyle.areasCoopDisplay;
  div.style.alignItems = partnerDivStyle.areasCoopAlignItems;
  div.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
  div.style.gap = partnerDivStyle.areasCoopGap;

  if (data["Areas of Cooperation - Categories"] === "No data") return div;

  const label = document.createElement(labelTag);
  label.classList.add("card-title", "partner-select", "mb-1", "areasCoop");
  label.textContent = "Areas of cooperation:";
  div.appendChild(label);
  div.appendChild(createCooperationTags(data["Areas of Cooperation - Categories"]));
  return div;
}

function createCooperationTags(areas) {
  const row = document.createElement("div");
  row.classList.add("iconsRow");
  row.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";

  areas.forEach((area) => {
    const tag = document.createElement("button");
    tag.classList.add("btn", "btn-outline-dark", "aresCoop", "ms-1");
    tag.setAttribute("type", "button");
    tag.setAttribute("data-bs-toggle", "tooltip");
    tag.setAttribute("data-bs-placement", "right");
    tag.setAttribute("title", area);
    tag.style.background = cooperation.color[area];

    const iconPath = `/assets/img/icons/${area.toLowerCase().replace(/ /g, "-").replace(/\//g, "-")}.svg`;
    const icon = document.createElement("img");
    icon.src = iconPath;
    icon.alt = `${area} Icon`;
    icon.style.cssText = "width:16px;height:16px;";
    tag.appendChild(icon);

    row.appendChild(tag);
    new bootstrap.Tooltip(tag);
  });

  return row;
}
function initTooltips(container) {
  [].slice.call(container.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach((el) => new bootstrap.Tooltip(el));
}
