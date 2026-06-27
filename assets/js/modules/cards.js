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

export function populatePartnerOverview(partnerName) {
  const zone = document.querySelector(".partner-overview-zone");
  if (!zone) return;
  zone.innerHTML = "";

  const title = document.createElement("p");
  title.classList.add("partner-title");
  title.textContent = partnerName;
  zone.appendChild(title);

  const text = globals.overviewText[partnerName];
  const body = document.createElement("p");
  body.classList.add("partner-subtitle");
  body.textContent = text || "No overview available";
  zone.appendChild(body);

  zone.appendChild(createStatStrip(partnerName));

  const hint = document.createElement("p");
  hint.classList.add("hint");
  hint.textContent = "Click a country on the map to see the bilateral detail →";
  zone.appendChild(hint);

  // African partners tab
  zone.appendChild(createAfricanPartnersList(partnerName));
}

// Called by navigation.js → showBilateral() (legacy path, kept for compatibility)
// Fills .card.partnership with the tabbed partner overview
// Once layout.js fully replaces showBilateral(), this can be removed
export function populatePartnerCard(selectedPartner) {
  console.log("selected Partner", selectedPartner);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  partnerDiv.appendChild(createPartnerHeader(selectedPartner));

  const selectCountryData = databases.reshapedBiData[selectedPartner];
  console.log("selectCountryData", selectCountryData);
  if (!selectCountryData) {
    initTooltips(partnerDiv);
    return;
  }
  // Add stat strip
  partnerDiv.appendChild(createStatStrip(selectedPartner));
  const tabDiv = createTabDiv(selectCountryData, overviewText[selectedPartner]);

  const partnersPane = tabDiv.querySelector("#partners");
  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll");
  selectCountryData.forEach((entry) => {
    scrollDiv.appendChild(createPartnershipMiniCard(entry));
  });
  partnersPane.appendChild(scrollDiv);

  partnerDiv.appendChild(tabDiv);
  initTooltips(partnerDiv);
}

export function populateCountryCard(countryName, selectedPartner, onPartnerSelect) {
  console.log("selected Partner", selectedPartner);
  console.log("country name", countryName);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  // Pass onPartnerSelect into createBreadCrumb so it can call back correctly.
  // If onPartnerSelect is not provided (legacy call), falls back to populatePartnerCard.
  const backFn = onPartnerSelect || (() => populatePartnerCard(selectedPartner));
  partnerDiv.appendChild(createBreadCrumb(selectedPartner));
  partnerDiv.appendChild(createTitle(`${selectedPartner} - ${countryName}`));

  const selectedCountryData = databases.reshapedBiData[selectedPartner]?.find(
    (entry) => entry["African Country"] === countryName,
  );
  if (!selectedCountryData) {
    partnerDiv.appendChild(
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
  partnerDiv.appendChild(engagementDiv);
  // Investment section
  const investmentText =
    partnerCountryText[selectedPartner]["Investment"][countryName];
  const investmentTextDiv = createTextSection(
    "Green Investments",
    investmentText,
  );
  investmentTextDiv.appendChild(createCooperationDiv(selectedCountryData));
  investmentTextDiv.appendChild(createSourceLink(selectedCountryData));
  partnerDiv.appendChild(investmentTextDiv);

  initTooltips(partnerDiv);
}

// --- partner overview panel helper ---

// build the scannable list of African partners shown in the overview zone
// read-only -> no click-handlers. the map is the navigation element
function createAfricanPartnersList(partnerName) {
  const container = document.createElement("div");
  container.classList.add("partners-list");
 
  const selectCountryData = databases.reshapedBiData[partnerName];
  if (!selectCountryData) return container;

  const label = document.createElement("p");
  label.classList.add("section-label");
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

  //card.appendChild(createSourceLink(entry));
  return card;
}

// ---- populatepartnerCard helpers  -----
function createPartnerHeader(selectedPartner) {
  const partner = document.createElement("h4"); // bilateral partner
  partner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h4",
  );
  partner.innerHTML = `${selectedPartner} - Africa`;
  partner.style.borderBottom = partnerDivStyle.borderBottom;
  partner.style.paddingBottom = partnerDivStyle.paddingBottom;
  partner.style.marginTop = partnerDivStyle.marginTop;
  return partner;
}
function createTabDiv(selectCountryData, text) {
  const tabDiv = document.createElement("div");
  tabDiv.classList.add("tabContainer");
  tabDiv.innerHTML = `
        <div class="tabs">
            <button class="tab-btn active" data-tab="overview">Overview</button>
            <button class="tab-btn" data-tab="partners">The ${selectCountryData.length} African Partners</button>
        </div>
        <div class="tab-content mt-2 mb-2" id="overview">
            ${text || "No overview available."}
        </div>
        <div class="tab-content mt-2 mb-2 hidden" id="partners">
            <!-- country cards -->
        </div>
    `;
  // Tab switching
  tabDiv.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      tabDiv
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      tabDiv
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.add("hidden"));
      this.classList.add("active");
      tabDiv.querySelector(`#${this.dataset.tab}`).classList.remove("hidden");
    });
  });
  return tabDiv;
}

// --- populateCountryCard helpers ---
function createBreadCrumb(selectedPartner) {
  const breadcrumb = document.createElement("p");
  breadcrumb.classList.add("breadcrumb-nav");
  breadcrumb.innerHTML = `<span class="back-link">← ${selectedPartner}</span>`;
  breadcrumb.querySelector(".back-link").style.cursor = "pointer";
  breadcrumb.querySelector(".back-link").addEventListener("click", () => {
    populatePartnerCard(selectedPartner); // go back to partner view
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