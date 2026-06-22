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

export function populateCountryCard(countryName, selectedPartner) {
  console.log("selected Partner", selectedPartner);
  console.log("country name", countryName);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

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
// export function expandPartnerCard() {
//   const partnerDiv = document.querySelector(".card.partnership");
//   partnerDiv.classList.add("expanded");
// }

/* ------------------------------------------------------ */
/* Rethink how to refactor and change functionality of it */
/* ------------------------------------------------------ */

// export function populateLegend(selectedCountry) {
//   console.log("selectedCountry", selectedCountry);
//   const partnerDiv = document.querySelector(".card");
//   partnerDiv.innerHTML = "";

//   const biPartner = document.createElement("h2"); // bilateral partner
//   biPartner.classList.add(
//     "card-title",
//     "card-title-fixed",
//     "partner-select",
//     "h2",
//   );
//   biPartner.innerHTML = `${selectedCountry}`;
//   biPartner.style.borderBottom = partnerDivStyle.borderBottom; // Línea roja de 2px
//   biPartner.style.paddingBottom = partnerDiv.paddingBottom; // Espacio entre el texto y la línea
//   biPartner.style.marginTop = partnerDiv.marginTop; // Espacio entre el texto y la línea
//   partnerDiv.appendChild(biPartner);

//   const partnerSubTitle = document.createElement("h5");
//   partnerSubTitle.classList.add("cardSubtitle");
//   partnerSubTitle.innerHTML = `${partnerDivStyle.overviewSubtitleText}`;
//   partnerDiv.appendChild(partnerSubTitle);

//   const driverText = document.createElement("h4");
//   driverText.classList.add("cardSubtitle");
//   driverText.innerHTML = `Key drivers of interest: ${keyDrivers[selectedCountry]}`;
//   partnerDiv.appendChild(driverText);

//   // Crear el contenedor para el contenido con scroll
//   const scrollDiv = document.createElement("div");
//   scrollDiv.classList.add("customScroll"); // Se añade 'custom-scroll' aquí

//   const reshapedData = databases.reshapedBiData;
//   console.log("reshapedData", reshapedData);
//   const selectCountryData = reshapedData[selectedCountry];
//   console.log("selectCountryData", selectCountryData);
//   if (selectCountryData) {
//     selectCountryData.forEach((entry) => {
//       console.log("Revising Entry in loop", entry["African Country"]);
//       const partnershipCard = document.createElement("div");
//       partnershipCard.classList.add("card-body", "partner", "custom-scroll");
//       const partnerTitle = document.createElement("h6");
//       partnerTitle.classList.add("card-title", "listPartners");
//       partnerTitle.innerHTML = `${entry["African Country"]}`;
//       partnershipCard.appendChild(partnerTitle);

//       const areasTitleContainer = document.createElement("div");
//       areasTitleContainer.classList.add("card-text", "mb-1");
//       areasTitleContainer.style.display = partnerDivStyle.areasCoopDisplay;
//       areasTitleContainer.style.alignItems =
//         partnerDivStyle.areasCoopAlignItems;
//       areasTitleContainer.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
//       areasTitleContainer.style.gap = partnerDivStyle.areasCoopGap;

//       const areasTitle = document.createElement("span");
//       areasTitle.classList.add("card-text", "mb-1", "areasCoop");
//       areasTitle.style.paddingBottom = partnerDivStyle.areasCoopPaddinBottom;
//       areasTitle.style.marginBottom = partnerDivStyle.areasCoopMarginBottom;
//       areasTitle.style.marginRight = partnerDivStyle.areasCoopMarginRight;
//       areasTitle.innerHTML = "Areas of cooperation: ";
//       areasTitleContainer.appendChild(areasTitle);

//       // Tag container
//       if (entry["Areas of Cooperation - Categories"] !== "No data") {
//         entry["Areas of Cooperation - Categories"].forEach((area) => {
//           console.log("Area of cooperation", area);
//           const tag = document.createElement("button");
//           tag.classList.add(
//             "btn",
//             "btn-outline-dark",
//             "aresCoop",
//             "ms-1",
//             "me-1",
//           );
//           tag.setAttribute("type", "button");
//           tag.setAttribute("data-bs-toggle", "tooltip");
//           tag.setAttribute("data-bs-placement", "right");
//           tag.setAttribute("title", area);
//           tag.style.background = cooperation.color[area];

//           // Add icon
//           const iconPath = `/assets/img/icons/${
//             area
//               .toLowerCase()
//               .replace(/ /g, "-") // Replace spaces with hyphens
//               .replace(/\//g, "-") // Replace slashes with hyphens
//           }.svg`;
//           const icon = document.createElement("img");
//           icon.src = iconPath;
//           icon.alt = `${area} Icon`;
//           icon.style.width = "16px";
//           icon.style.height = "16px";
//           icon.style.marginRight = "5px";

//           tag.appendChild(icon); // Add icon to the tag
//           tag.appendChild(document.createTextNode(area));
//           areasTitleContainer.appendChild(tag);
//           new bootstrap.Tooltip(tag);
//         });
//         //partnershipCard.appendChild(areasTitleContainer);
//       } else {
//         const noData = document.createElement("p");
//         noData.classList.add("card-text", "mb-1", "areasCoop");
//         noData.innerHTML = `No data available`;
//         areasTitleContainer.appendChild(noData);
//         areasTitleContainer.appendChild(noData);
//       }
//       if (entry["Economic and Investment Trend"] !== "No data") {
//         const trendContainer = document.createElement("div");
//         trendContainer.classList.add("card-text", "mb-1");

//         // Add the label text before the button
//         const trendLabel = document.createElement("span");
//         trendLabel.classList.add("trendLabel", "fw-bold", "me-2");
//         trendLabel.textContent = "Economic and investment trend:";
//         trendContainer.appendChild(trendLabel);

//         const trendValue = entry["Economic and Investment Trend"];
//         const trendButton = document.createElement("button");
//         trendButton.classList.add(
//           "btn",
//           "btn-sm",
//           "d-flex",
//           "align-items-center",
//           "justify-content-between",
//         );

//         // Set button color and icon based on the trend value
//         if (trendValue === "Increase") {
//           trendButton.classList.add("btn-success");
//           trendButton.innerHTML = `<span>Increase</span> <img src="/assets/img/icons/arrow-up.svg" alt="Arrow Up" style="width: 12px; height: 12px;">`;
//         } else if (trendValue === "Decrease") {
//           trendButton.classList.add("btn-danger");
//           trendButton.innerHTML = `<span>Decrease</span> <img src="/assets/img/icons/arrow-down.svg" alt="Arrow Down" style="width: 12px; height: 12px;">`;
//         } else if (trendValue === "Stable") {
//           trendButton.classList.add("btn-secondary");
//           trendButton.innerHTML = `<span>Stable</span> <img src="/assets/img/icons/minus.svg" alt="Minus Icon" style="width: 12px; height: 12px;">`;
//         }
//         trendContainer.appendChild(trendButton);
//         partnershipCard.appendChild(trendContainer);
//       }
//       partnershipCard.appendChild(areasTitleContainer);
//       scrollDiv.appendChild(partnershipCard);
//       partnerDiv.appendChild(scrollDiv);
//     });
//   }
//   const tooltipTriggerList = [].slice.call(
//     partnerDiv.querySelectorAll('[data-bs-toggle="tooltip"]'),
//   );
//   tooltipTriggerList.forEach(function (tooltipTriggerEl) {
//     new bootstrap.Tooltip(tooltipTriggerEl);
//   });
// }
/* ------------------------------------------------------ */

// export function populateComparativeCard(selectedCountry) {
//   console.log("selectedCountry", selectedCountry);
//   const partnerDiv = document.querySelector(".card");
//   partnerDiv.innerHTML = "";

//   const biPartner = document.createElement("h3"); // bilateral partner
//   biPartner.classList.add(
//     "card-title",
//     "card-title-fixed",
//     "partner-select",
//     "h3",
//   );
//   biPartner.innerHTML = `${selectedCountry}`;
//   biPartner.style.borderBottom = partnerDivStyle.borderBottom; // Línea roja de 2px
//   biPartner.style.paddingBottom = partnerDiv.paddingBottom; // Espacio entre el texto y la línea
//   biPartner.style.marginTop = partnerDiv.marginTop; // Espacio entre el texto y la línea
//   partnerDiv.appendChild(biPartner);

//   const partnerSubTitle = document.createElement("h4");
//   partnerSubTitle.classList.add("cardSubtitle");
//   partnerSubTitle.innerHTML = `${partnerDivStyle.comparativeSubtitleText}`;
//   partnerDiv.appendChild(partnerSubTitle);

//   const comparativeData = databases.comparativeData;
//   console.log("Comparative data", comparativeData);

//   // Filter data for the selected country
//   const selectCountryData = comparativeData.filter(
//     (country) => country["Non-African Partner"] === selectedCountry,
//   );
//   console.log("Filtered Comparative Data:", selectCountryData);

//   if (selectCountryData.length > 0) {
//     selectCountryData.forEach((entry) => {
//       const partnershipCard = document.createElement("div");
//       partnershipCard.classList.add("card-body", "partner");
//       // Iterate over keys of the country object
//       Object.keys(entry).forEach((key) => {
//         const value = entry[key];

//         // Create a container for each variable
//         const variableContainer = document.createElement("div");
//         variableContainer.classList.add("card-body", "partner");

//         // Check if the value is an array
//         if (Array.isArray(value)) {
//           // Create a list for array elements
//           const listContainer = document.createElement("ul");
//           listContainer.classList.add("matrixVarList");

//           value.forEach((item) => {
//             const listItem = document.createElement("li");
//             listItem.classList.add("card-text", "mb-1");
//             listItem.textContent = item;
//             listContainer.appendChild(listItem);
//           });

//           variableContainer.innerHTML = `<h6 class="mb-1">${key}:</h6>`;
//           variableContainer.appendChild(listContainer);
//         } else {
//           // If not an array, display the value directly
//           variableContainer.innerHTML = `<h6>${key}:</h6>
//                                                    ${value}`;
//         }
//         partnershipCard.appendChild(variableContainer);
//       });
//       partnerDiv.appendChild(partnershipCard);
//     });
//   } else {
//     const noDataMessage = document.createElement("p");
//     noDataMessage.classList.add("card-text", "no-data");
//     noDataMessage.innerHTML = "No data available for the selected country.";
//     partnerDiv.appendChild(noDataMessage);
//   }
// }

// ----- Helper functions -----
function initTooltips(container) {
  const tooltipTriggerList = [].slice.call(
    container.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
}
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
function createTitle(text) {
  const title = document.createElement("h4");
  title.classList.add("card-title", "partner-select");
  title.textContent = text;
  return title;
}
function createStatStrip(selectedPartner) {
  // Add stat strip
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

function createEmptyState() {
  const empty = document.createElement("div");
  empty.classList.add("empty-state");
  empty.innerHTML = `
    <p>Select a partner country from the map to explore Africa's energy transition financing relationships.</p>
  `;
  return empty;
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
function createTextSection(title, text) {
  const container = document.createElement("div");
  container.classList.add("tab-content", "mt-2", "mb-2");
  container.innerHTML = `
    <h5 class="card-title partner-select">${title}</h5>
    ${text || "No text available."}
  `;
  return container;
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
