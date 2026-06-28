import globals from "./globals.js";

const {
  partnerDivStyle,
  databases,
  cooperation,
  keyDrivers,
  overviewText,
  statStrip,
  partnerCountryText,
  trendConfig,
} = globals;

export function renderOverviewPanel() {
  const card = document.querySelector(".card");
  if (!card) return;
  card.innerHTML = "";

  // Re-render the panel structure since innerHTML was wiped
  // Navigation steps
  card.appendChild(createNavigationSteps());

  // About zone
  const aboutZone = document.createElement("div");
  aboutZone.classList.add("panel-section");
  aboutZone.innerHTML = `
    <p class="vis-panel__zone-label">About this visualization</p>
    <p class="partner-subtitle">
      Africa’s energy transition is at a critical crossroads, with financing as a central challenge. Three major actors, China, the European Union and the Gulf countries play leading but distinct roles. Our database maps trade, investment, and flagship green projects between African countries and these actors, using primary data and secondary sources including the International Monetary Fund, the World Bank, the Organisation for Economic Co-operation and Development, the Global Gateway, the China Global Investment Tracker, and the Gulf Renewable Projects Tracker. To ensure accuracy, we cross-check datasets, distinguish pledged from disbursed funds, and add qualitative caveats.
    </p>
  `;
  card.appendChild(aboutZone);

  // Sources zone
  const sourcesZone = document.createElement("div");
  sourcesZone.classList.add("panel-section");
  sourcesZone.innerHTML = `
    <p class="vis-panel__zone-label">Data sources</p>
  `;
  const sources = [
    { label: "IMF Database", url: "#" },
    { label: "World Bank Database", url: "#" },
    { label: "China Global Investment Tracker", url: "#" },
    { label: "Gulf Renewable Projects Tracker", url: "#" },
  ];
  sources.forEach(({ label, url }) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.classList.add("source-link");
    link.textContent = label;
    sourcesZone.appendChild(link);
  });
  card.appendChild(sourcesZone);

  // Legend zone — connectivity scale
  const legendZone = document.createElement("div");
  legendZone.classList.add("panel-section");
  legendZone.innerHTML = `
    <p class="vis-panel__zone-label">Map legend</p>
    <p class="partner-subtitle" style="margin-bottom:10px;">
      Countries shaded by number of active partner relationships.
    </p>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:14px;height:14px;border-radius:3px;background:#C8DFC9;flex-shrink:0;"></div>
        <span class="vis-step__text">Low connectivity</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:14px;height:14px;border-radius:3px;background:#6BA870;flex-shrink:0;"></div>
        <span class="ste">Moderate connectivity</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:14px;height:14px;border-radius:3px;background:#1C4A20;flex-shrink:0;"></div>
        <span class="vis-step__text">High connectivity</span>
      </div>
    </div>
    <p class="vis-panel__zone-label" style="margin-top:14px;">Investment trend</p>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="/assets/img/icons/arrow-up.svg" style="width:14px;height:14px;filter:invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg);">
        <span class="vis-step__text">Increasing</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="/assets/img/icons/arrow-down.svg" style="width:14px;height:14px;filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg);">
        <span class="vis-step__text">Decreasing</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="/assets/img/icons/minus.svg" style="width:14px;height:14px;filter:invert(50%);">
        <span class="vis-step__text">Stable</span>
      </div>
    </div>
  `;
  card.appendChild(legendZone);
}

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
  header.classList.add("panel-section");

  const title = document.createElement("p");
  title.classList.add("partner-title");
  title.textContent = partnerName;
  header.appendChild(title);

  const text = overviewText[partnerName];
  const body = document.createElement("p");
  body.classList.add("partner-subtitle");
  body.innerHTML = text || "No overview available.";
  header.appendChild(body);

  header.appendChild(createStatStrip(partnerName));

  const hint = document.createElement("p");
  hint.classList.add("hint");
  hint.textContent = "Click a country on the map →";
  header.appendChild(hint);

  zone.appendChild(header);

  // Scrollable list — gets its own zone below
  const listZone = document.createElement("div");
  listZone.classList.add("panel-section", "partners-list-zone");
  listZone.appendChild(createAfricanPartnersList(partnerName));
  zone.appendChild(listZone);
}

export function populateCountryCard(
  countryName,
  selectedPartner,
  onPartnerSelect,
) {
  console.log("selected Partner", selectedPartner);
  console.log("country name", countryName);
  // Write into the overview zone only — not the whole card.
  // The navigation steps and accordions must stay intact so
  // populatePartnerOverview can find the zone again when the user
  // clicks back to a non-African partner.
  const zone = document.querySelector(".partner-overview-zone");
  if (!zone) {
    console.error("populateCountryCard: .partner-overview-zone not found");
    return;
  }
  zone.innerHTML = "";

  // Pass onPartnerSelect into createBreadCrumb so it can call back correctly.
  // If onPartnerSelect is not provided (legacy call), falls back to populatePartnerCard.
  const backFn =
    onPartnerSelect || (() => populatePartnerOverview(selectedPartner));
  zone.appendChild(createBreadCrumb(selectedPartner));
  zone.appendChild(createTitle(`${selectedPartner} - ${countryName}`));

  const selectedCountryData = databases.reshapedBiData[selectedPartner]?.find(
    (entry) => entry["African Country"] === countryName,
  );
  if (!selectedCountryData) {
    zone.appendChild(
      Object.assign(document.createElement("p"), {
        textContent: "No data available for this country.",
      }),
    );
    return;
  }
  // Add text economic engagement
  const engageText =
    partnerCountryText[selectedPartner]["Engagement"][countryName];
  const engagementDiv = createTextSection(
    "Economic Engagement & Investment",
    engageText,
  );

  if (selectedCountryData["Economic and Investment Trend"] !== "No data") {
    engagementDiv.appendChild(
      createTrendIndicator(
        selectedCountryData["Economic and Investment Trend"],
      ),
    );
  }
  zone.appendChild(engagementDiv);
  // Investment section
  const investmentText =
    partnerCountryText[selectedPartner]["Investment"][countryName];
  const investmentTextDiv = createTextSection(
    "Green Investments",
    investmentText,
  );
  investmentTextDiv.appendChild(createCooperationDiv(selectedCountryData));
  investmentTextDiv.appendChild(createSourceLink(selectedCountryData));
  zone.appendChild(investmentTextDiv);

  initTooltips(zone);
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

  const steps = [
    "Select a foreign actor from the sidebar",
    "Click an African country on the map",
    "Browse the bilateral detail sheet",
  ];

  steps.forEach((text, i) => {
    const row = document.createElement("div");
    row.classList.add("vis-step");

    const num = document.createElement("div");
    num.classList.add("vis-step__num");
    num.textContent = i + 1;

    const stepText = document.createElement("span");
    stepText.classList.add("vis-step__text");
    stepText.textContent = text;

    row.appendChild(num);
    row.appendChild(stepText);
    section.appendChild(row);
  });

  return section;
}
// build the scannable list of African partners shown in the overview zone
// read-only -> no click-handlers. the map is the navigation element
function createAfricanPartnersList(partnerName) {
  const container = document.createElement("div");
  container.classList.add("partners-list");

  const selectCountryData = databases.reshapedBiData[partnerName];
  if (!selectCountryData) return container;

  const label = document.createElement("p");
  label.classList.add("vis-panel__zone-label");
  label.textContent = `${selectCountryData.length} African partners`;
  container.appendChild(label);

  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll");

  selectCountryData.forEach((entry) => {
    scrollDiv.appendChild(createPartnershipMiniCard(entry));
  });

  container.appendChild(scrollDiv);
  return container;
}

// Builds one mini-card per African partner country for the scannable list.
// Shows: country name, trend indicator, cooperation tags, flagship count.
// No click handler — clicking a country on the map triggers populateCountryCard.
function createPartnershipMiniCard(entry) {
  const card = document.createElement("div");
  card.classList.add("card-body", "partner");

  //const header = document.createElement("div");
  //header.classList.add("d-flex", "align-items-center", "gap-2", "mb-1");

  const title = document.createElement("h6");
  title.classList.add("card-title", "listPartners", "gap-2", "mb-1");
  title.textContent = entry["African Country"];
  card.appendChild(title);

  if (entry["Economic and Investment Trend"] !== "No data") {
    card.appendChild(
      createTrendIndicator(entry["Economic and Investment Trend"]),
    );
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

  //card.appendChild(createSourceLink(entry));
  return card;
}


// --- populateCountryCard helpers ---
function createBreadCrumb(selectedPartner) {
  const breadcrumb = document.createElement("p");
  breadcrumb.classList.add("breadcrumb-nav");
  breadcrumb.innerHTML = `<span class="back-link">← ${selectedPartner}</span>`;
  breadcrumb.querySelector(".back-link").style.cursor = "pointer";
  breadcrumb.querySelector(".back-link").addEventListener("click", () => {
    d(selectedPartner); // go back to partner view
  });
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
function createSourceLink(entryOrData) {
  const link = document.createElement("a");
  const href = entryOrData["Link to Agreement"] || entryOrData.linkAgreement;
  const fallback = entryOrData["Source"] || entryOrData.sources;
  link.href = href || fallback || "#";
  link.target = "_blank";
  link.classList.add("ms-2", "cardLink");
  link.textContent = href ? "View agreement" : "View source";
  return link;
}

// ---- shared helper function ----
function createStatStrip(selectedPartner) {
  const fdi = statStrip.foreignInvest[selectedPartner];
  const statStripDiv = document.createElement("div");
  statStripDiv.classList.add("statStrip");
  statStripDiv.innerHTML = `
        <div class="stat">
            <span class="statValue">${fdi}</span>
            <span class="statLabel">FDI</span>
        </div>
        <div class="stat">
            <span class="statValue">${statStrip.tradeDeficit[selectedPartner]}</span>
            <span class="statLabel">Trade deficit</span>
        </div>
        <div class="stat">
            <span class="statValue">${statStrip.NProjects[selectedPartner]}</span>
            <span class="statLabel">Flagship projects</span>
        </div>
    `;
  return statStripDiv;
}
function createTrendIndicator(trendValue) {
  const trendDiv = document.createElement("div");
  trendDiv.classList.add("d-flex", "align-items-center", "mb-1", "gap-2");

  const trendLabel = document.createElement("p");
  trendLabel.classList.add("trendLabel", "my-auto");
  trendLabel.textContent = "Investment trend:";

  const trendIcon = document.createElement("img");
  trendIcon.style.width = "24px";
  trendIcon.style.height = "24px";
  trendIcon.setAttribute("data-bs-toggle", "tooltip");

  const config = trendConfig[trendValue];
  trendIcon.src = `/assets/img/icons/${config.src}`;
  trendIcon.setAttribute("title", config.title);
  trendIcon.style.filter = config.filter;

  // Set button color and icon based on the trend value
  new bootstrap.Tooltip(trendIcon);
  trendDiv.appendChild(trendLabel);
  trendDiv.appendChild(trendIcon);

  return trendDiv;
}
function createCooperationDiv(selectCountryData) {
  //const card = document.createElement("div");
  //card.classList.add("card-body", "partner", "custom-scroll");
  const areasCoopDiv = document.createElement("div");
  areasCoopDiv.classList.add("card-text", "mb-1");
  areasCoopDiv.style.display = partnerDivStyle.areasCoopDisplay;
  areasCoopDiv.style.alignItems = partnerDivStyle.areasCoopAlignItems;
  areasCoopDiv.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
  areasCoopDiv.style.gap = partnerDivStyle.areasCoopGap;

  if (selectCountryData["Areas of Cooperation - Categories"] !== "No data") {
    const areasTitle = document.createElement("p");
    areasTitle.classList.add("card-text", "mb-1", "areasCoop");
    areasTitle.style.paddingBottom = partnerDivStyle.areasCoopPaddinBottom;
    areasTitle.style.marginBottom = partnerDivStyle.areasCoopMarginBottom;
    areasTitle.style.marginRight = partnerDivStyle.areasCoopMarginRight;
    areasTitle.innerHTML = "Areas of cooperation:";
    areasCoopDiv.appendChild(areasTitle);
    areasCoopDiv.appendChild(
      createCooperationTags(
        selectCountryData["Areas of Cooperation - Categories"],
      ),
    );
  }
  return areasCoopDiv;
}
function createCooperationTags(areas) {
  const iconsRow = document.createElement("div");
  iconsRow.classList.add("iconsRow");
  iconsRow.style.display = "flex";
  iconsRow.style.flexWrap = "wrap";
  iconsRow.style.gap = "6px";

  areas.forEach((area) => {
    const tag = document.createElement("button");
    tag.classList.add("btn", "btn-outline-dark", "aresCoop", "ms-1");
    tag.setAttribute("type", "button");
    tag.setAttribute("data-bs-toggle", "tooltip");
    tag.setAttribute("data-bs-placement", "right");
    tag.setAttribute("title", area);
    tag.style.background = cooperation.color[area];

    // Add icon
    const iconPath = `/assets/img/icons/${
      area
        .toLowerCase()
        .replace(/ /g, "-") // Replace spaces with hyphens
        .replace(/\//g, "-") // Replace slashes with hyphens
    }.svg`;
    const icon = document.createElement("img");
    icon.src = iconPath;
    icon.alt = `${area} Icon`;
    icon.style.width = "16px";
    icon.style.height = "16px";
    tag.appendChild(icon);

    iconsRow.appendChild(tag);
    new bootstrap.Tooltip(tag);
  });
  //areasCoopDiv.appendChild(iconsRow);
  return iconsRow;
}
function initTooltips(container) {
  const tooltipTriggerList = [].slice.call(
    container.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
}
