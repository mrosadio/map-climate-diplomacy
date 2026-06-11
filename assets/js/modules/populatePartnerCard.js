import globals from "./globals.js";

const {
  partnerDivStyle,
  databases,
  cooperation,
  keyDrivers,
  overviewText,
  statStrip,
  partnerCountryText,
} = globals;

export function populatePartnerCard(selectedPartner) {
  console.log("selected Partner", selectedPartner);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  const biPartner = document.createElement("h4"); // bilateral partner
  biPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h4",
  );
  biPartner.innerHTML = `${selectedPartner} - Africa`;
  biPartner.style.borderBottom = partnerDivStyle.borderBottom;
  biPartner.style.paddingBottom = partnerDiv.paddingBottom;
  biPartner.style.marginTop = partnerDiv.marginTop;
  partnerDiv.appendChild(biPartner);

  // Crear el contenedor para el contenido con scroll
  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll"); // Se añade 'custom-scroll' aquí

  const reshapedData = databases.reshapedBiData;
  console.log("reshapedData", reshapedData);
  const selectCountryData = reshapedData[selectedPartner];
  console.log("selectCountryData", selectCountryData);
  const partnerText = overviewText[selectedPartner];
  console.log("Consoling overviewtext", partnerText);
  if (selectCountryData) {
    // Add Tabs here: Overview and african partners
    const tabDiv = document.createElement("div");
    tabDiv.classList.add("tabContainer");
    tabDiv.innerHTML = `
        <div class="tabs">
            <button class="tab-btn active" data-tab="overview">Overview</button>
            <button class="tab-btn" data-tab="partners">The ${selectCountryData.length} African Partners</button>
        </div>
        <div class="tab-content" id="overview">
            ${partnerText || "No overview available."}
        </div>
        <div class="tab-content hidden" id="partners">
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
    partnerDiv.appendChild(statStripDiv);
    partnerDiv.appendChild(tabDiv);

    selectCountryData.forEach((entry) => {
      console.log("Revising Entry in loop", entry["African Country"]);
      const partnershipCard = document.createElement("div");
      partnershipCard.classList.add("card-body", "partner", "custom-scroll");

      // Icon
      const icon = document.createElement("img");
      icon.src = "/assets/img/icons/web.svg";
      icon.alt = "Access icon";
      icon.classList.add("ms-2", "webIcon");

      // Link
      const link = document.createElement("a");
      link.href = entry.linkAgreement
        ? `${entry.linkAgreement}`
        : `${entry.sources}`;
      link.target = "_blank";
      link.classList.add("ms-2", "cardLink");
      link.textContent = entry.linkAgreement ? "View agreement" : "View source";

      if (entry["Areas of Cooperation - Categories"] !== "No data") {
        console.log(
          "Entry of areas of cooperation",
          entry["Areas of Cooperation - Categories"],
        );
        const areasTitleContainer = document.createElement("div");
        areasTitleContainer.classList.add("card-text", "mb-1");
        areasTitleContainer.style.display = partnerDivStyle.areasCoopDisplay;
        areasTitleContainer.style.alignItems =
          partnerDivStyle.areasCoopAlignItems;
        areasTitleContainer.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
        areasTitleContainer.style.gap = partnerDiv.areasCoopGap;

        const areasTitle = document.createElement("span");
        areasTitle.classList.add("card-text", "mb-1", "areasCoop");
        areasTitle.style.paddingBottom = partnerDiv.areasCoopPaddinBottom;
        areasTitle.style.marginBottom = partnerDiv.areasCoopMarginBottom;
        areasTitle.style.marginRight = partnerDiv.areasCoopMarginRight;
        areasTitle.innerHTML = "Areas of cooperation: ";
        areasTitleContainer.appendChild(areasTitle);

        // Tag container
        entry["Areas of Cooperation - Categories"].forEach((area) => {
          console.log("Area of cooperation", area);

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

          tag.appendChild(icon); // Add icon to the tag
          areasTitleContainer.appendChild(tag);

          new bootstrap.Tooltip(tag);
        });
        partnershipCard.appendChild(areasTitleContainer);
      }

      // Economic and Investment Trend
      console.log(
        "Entry of Economic and Investment Trend",
        entry["Economic and Investment Trend"],
      );
      if (entry["Economic and Investment Trend"] !== "No data") {
        const trendContainer = document.createElement("div");
        trendContainer.classList.add(
          "d-flex",
          "align-items-center",
          "mb-1",
          "gap-2",
        );

        // Add the label text before the button
        const trendLabel = document.createElement("span");
        trendLabel.classList.add("trendLabel");
        trendLabel.textContent = "Investment trend:";
        trendContainer.appendChild(trendLabel);

        const trendValue = entry["Economic and Investment Trend"];
        const trendIcon = document.createElement("img");
        trendIcon.style.width = "24px";
        trendIcon.style.height = "24px";
        trendIcon.setAttribute("data-bs-toggle", "tooltip");

        // Set button color and icon based on the trend value
        if (trendValue === "Increase") {
          trendIcon.src = "/assets/img/icons/arrow-up.svg";
          trendIcon.setAttribute("title", "Increasing");
          trendIcon.style.filter =
            "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg)"; // green tint
        } else if (trendValue === "Decrease") {
          trendIcon.src = "/assets/img/icons/arrow-down.svg";
          trendIcon.setAttribute("title", "Decreasing");
          trendIcon.style.filter =
            "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)"; // red tint
        } else if (trendValue === "Stable") {
          trendIcon.src = "/assets/img/icons/minus.svg";
          trendIcon.setAttribute("title", "Stable");
          trendIcon.style.filter = "invert(50%)"; // grey tint
        }

        new bootstrap.Tooltip(trendIcon);
        trendContainer.appendChild(trendLabel);
        trendContainer.appendChild(trendIcon); // Add Number of Flagship Green Projects
        if (entry["Number of Flagship Green Projects"] !== "No data") {
          const flagshipProjects = document.createElement("p");
          flagshipProjects.classList.add(
            "card-text",
            "mb-1",
            "flagshipProjects",
          );
          flagshipProjects.innerHTML = `<span>No. Flagship Green Projects:</span> ${entry["Number of Flagship Green Projects"]}`;
          //trendContainer.appendChild(flagshipProjects);
          partnershipCard.appendChild(flagshipProjects);
        }
        partnershipCard.appendChild(trendContainer);
      }
      scrollDiv.appendChild(partnershipCard);
      partnerDiv.appendChild(scrollDiv);
    });
  }
  const tooltipTriggerList = [].slice.call(
    partnerDiv.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

export function populateCountryCard(countryName, selectedPartner) {
  console.log("selected Partner", selectedPartner);
  console.log("country name", countryName);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  // Breadcrumb
  const breadcrumb = document.createElement("p");
  breadcrumb.classList.add("breadcrumb-nav");
  breadcrumb.innerHTML = `<span class="back-link">← ${selectedPartner}</span>`;
  breadcrumb.querySelector(".back-link").style.cursor = "pointer";
  breadcrumb.querySelector(".back-link").addEventListener("click", () => {
    populatePartnerCard(selectedPartner); // go back to partner view
  });
  partnerDiv.appendChild(breadcrumb);

  // Country title
  const title = document.createElement("h4");
  title.classList.add("card-title", "partner-select");
  title.innerHTML = `${selectedPartner} - ${countryName}`;
  partnerDiv.appendChild(title);

  const biPartner = document.createElement("h4"); // bilateral partner
  biPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h4",
  );

  // Crear el contenedor para el contenido con scroll
  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll"); // Se añade 'custom-scroll' aquí

  const reshapedData = databases.reshapedBiData;
  console.log("reshapedData", reshapedData);
  const selectCountryData = reshapedData[selectedPartner]?.find(
    (entry) => entry["African Country"] === countryName,
  );
  console.log("selectCountryData", selectCountryData);

  if (!selectCountryData) {
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
  partnerDiv.appendChild(
    createTextSection("Economic Engagement & Investment", engageText),
  );
  if (selectCountryData["Economic and Investment Trend"] !== "No data") {
    const trendContainer = document.createElement("div");
    trendContainer.classList.add(
      "d-flex",
      "align-items-center",
      "mb-1",
      "gap-2",
    );

    // Add the label text before the button
    const trendLabel = document.createElement("span");
    trendLabel.classList.add("trendLabel");
    trendLabel.textContent = "Investment trend:";
    trendContainer.appendChild(trendLabel);

    const trendValue = selectCountryData["Economic and Investment Trend"];
    const trendIcon = document.createElement("img");
    trendIcon.style.width = "24px";
    trendIcon.style.height = "24px";
    trendIcon.setAttribute("data-bs-toggle", "tooltip");

    // Set button color and icon based on the trend value
    if (trendValue === "Increase") {
      trendIcon.src = "/assets/img/icons/arrow-up.svg";
      trendIcon.setAttribute("title", "Increasing");
      trendIcon.style.filter =
        "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg)"; // green tint
    } else if (trendValue === "Decrease") {
      trendIcon.src = "/assets/img/icons/arrow-down.svg";
      trendIcon.setAttribute("title", "Decreasing");
      trendIcon.style.filter =
        "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)"; // red tint
    } else if (trendValue === "Stable") {
      trendIcon.src = "/assets/img/icons/minus.svg";
      trendIcon.setAttribute("title", "Stable");
      trendIcon.style.filter = "invert(50%)"; // grey tint
    }
    new bootstrap.Tooltip(trendIcon);
    partnerDiv.appendChild(trendContainer);
    trendContainer.appendChild(trendLabel);
    trendContainer.appendChild(trendIcon);
  }
  // Add investment text 
  const investmentText =
    partnerCountryText[selectedPartner]["Investment"][countryName];
  partnerDiv.appendChild(
    createTextSection("Green Investments", investmentText),
  );
  // Add stat strip
  // const fdi = statStrip.foreignInvest[selectedPartner];
  // const statStripDiv = document.createElement("div");
  // statStripDiv.classList.add("statStrip");
  // statStripDiv.innerHTML = `
  //       <div class="stat">
  //           <span class="statValue">${fdi}</span>
  //           <span class="statLabel">FDI</span>
  //       </div>
  //       <div class="stat">
  //           <span class="statValue">${statStrip.tradeDeficit[selectedPartner]}</span>
  //           <span class="statLabel">Trade deficit</span>
  //       </div>
  //       <div class="stat">
  //           <span class="statValue">${statStrip.NProjects[selectedPartner]}</span>
  //           <span class="statLabel">Flagship projects</span>
  //       </div>
  //   `;
  // partnerDiv.appendChild(statStripDiv);
  //partnerDiv.appendChild(tabDiv);

  const partnershipCard = document.createElement("div");
  partnershipCard.classList.add("card-body", "partner", "custom-scroll");
  const partnerTitle = document.createElement("h5");
  partnerTitle.classList.add("card-title", "listPartners");
  partnerTitle.innerHTML = `${countryName}`;
  partnershipCard.appendChild(partnerTitle);

  // Icon
  const icon = document.createElement("img");
  icon.src = "/assets/img/icons/web.svg";
  icon.alt = "Access icon";
  icon.classList.add("ms-2", "webIcon");

  // Link
  const link = document.createElement("a");
  link.href = countryName["Link to Agreement"]
    ? `${countryName["Link to Agreement"]}`
    : `${countryName["Source"]}`;
  link.target = "_blank";
  link.classList.add("ms-2", "cardLink");
  link.textContent = countryName["Link to Agreement"]
    ? "View agreement"
    : "View source";

  if (selectCountryData["Areas of Cooperation - Categories"] !== "No data") {
    console.log(
      "Entry of areas of cooperation",
      selectCountryData["Areas of Cooperation - Categories"],
    );
    const areasTitleContainer = document.createElement("div");
    areasTitleContainer.classList.add("card-text", "mb-1");
    areasTitleContainer.style.display = partnerDivStyle.areasCoopDisplay;
    areasTitleContainer.style.alignItems = partnerDivStyle.areasCoopAlignItems;
    areasTitleContainer.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
    areasTitleContainer.style.gap = partnerDiv.areasCoopGap;

    const areasTitle = document.createElement("span");
    areasTitle.classList.add("card-text", "mb-1", "areasCoop");
    areasTitle.style.paddingBottom = partnerDiv.areasCoopPaddinBottom;
    areasTitle.style.marginBottom = partnerDiv.areasCoopMarginBottom;
    areasTitle.style.marginRight = partnerDiv.areasCoopMarginRight;
    areasTitle.innerHTML = "Areas of cooperation: ";
    areasTitleContainer.appendChild(areasTitle);

    // Tag container
    selectCountryData["Areas of Cooperation - Categories"].forEach((area) => {
      console.log("Area of cooperation", area);

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

      tag.appendChild(icon); // Add icon to the tag
      areasTitleContainer.appendChild(tag);

      new bootstrap.Tooltip(tag);
    });
    partnershipCard.appendChild(areasTitleContainer);
  }

  console.log(
    "Entry of Investment connectivity",
    selectCountryData[
      "Economic and Investment connectivity between African country and non-African partner"
    ],
  );
  // Economic and Investment Trend
  console.log(
    "Entry of Economic and Investment Trend",
    selectCountryData["Economic and Investment Trend"],
  );
  if (selectCountryData["Economic and Investment Trend"] !== "No data") {
    const trendContainer = document.createElement("div");
    trendContainer.classList.add(
      "d-flex",
      "align-items-center",
      "mb-1",
      "gap-2",
    );

    // Add the label text before the button
    const trendLabel = document.createElement("span");
    trendLabel.classList.add("trendLabel");
    trendLabel.textContent = "Investment trend:";
    trendContainer.appendChild(trendLabel);

    const trendValue = selectCountryData["Economic and Investment Trend"];
    const trendIcon = document.createElement("img");
    trendIcon.style.width = "24px";
    trendIcon.style.height = "24px";
    trendIcon.setAttribute("data-bs-toggle", "tooltip");

    // Set button color and icon based on the trend value
    if (trendValue === "Increase") {
      trendIcon.src = "/assets/img/icons/arrow-up.svg";
      trendIcon.setAttribute("title", "Increasing");
      trendIcon.style.filter =
        "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg)"; // green tint
    } else if (trendValue === "Decrease") {
      trendIcon.src = "/assets/img/icons/arrow-down.svg";
      trendIcon.setAttribute("title", "Decreasing");
      trendIcon.style.filter =
        "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)"; // red tint
    } else if (trendValue === "Stable") {
      trendIcon.src = "/assets/img/icons/minus.svg";
      trendIcon.setAttribute("title", "Stable");
      trendIcon.style.filter = "invert(50%)"; // grey tint
    }

    new bootstrap.Tooltip(trendIcon);
    trendContainer.appendChild(trendLabel);
    trendContainer.appendChild(trendIcon); // Add Number of Flagship Green Projects
    if (selectCountryData["Number of Flagship Green Projects"] !== "No data") {
      const flagshipProjects = document.createElement("p");
      flagshipProjects.classList.add("card-text", "mb-1", "flagshipProjects");
      flagshipProjects.innerHTML = `<span>No. Flagship Green Projects:</span> ${selectCountryData["Number of Flagship Green Projects"]}`;
      partnershipCard.appendChild(flagshipProjects);
    }
    partnershipCard.appendChild(trendContainer);
  }
  scrollDiv.appendChild(partnershipCard);
  partnerDiv.appendChild(scrollDiv);
  //});
  //}
  const tooltipTriggerList = [].slice.call(
    partnerDiv.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
export function expandPartnerCard() {
  const partnerDiv = document.querySelector(".card.partnership");
  partnerDiv.classList.add("expanded");
}
function createTextSection(title, text) {
  const container = document.createElement("div");
  container.classList.add("tab-content");
  container.innerHTML = `
    <h5 class="card-title partner-select">${title}</h5>
    <p>${text || "No text available."}</p>
  `;
  return container;
}

export function populateLegend(selectedCountry) {
  console.log("selectedCountry", selectedCountry);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  const biPartner = document.createElement("h2"); // bilateral partner
  biPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h2",
  );
  biPartner.innerHTML = `${selectedCountry}`;
  biPartner.style.borderBottom = partnerDivStyle.borderBottom; // Línea roja de 2px
  biPartner.style.paddingBottom = partnerDiv.paddingBottom; // Espacio entre el texto y la línea
  biPartner.style.marginTop = partnerDiv.marginTop; // Espacio entre el texto y la línea
  partnerDiv.appendChild(biPartner);

  const partnerSubTitle = document.createElement("h5");
  partnerSubTitle.classList.add("cardSubtitle");
  partnerSubTitle.innerHTML = `${partnerDivStyle.overviewSubtitleText}`;
  partnerDiv.appendChild(partnerSubTitle);

  const driverText = document.createElement("h4");
  driverText.classList.add("cardSubtitle");
  driverText.innerHTML = `Key drivers of interest: ${keyDrivers[selectedCountry]}`;
  partnerDiv.appendChild(driverText);

  // Crear el contenedor para el contenido con scroll
  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll"); // Se añade 'custom-scroll' aquí

  const reshapedData = databases.reshapedBiData;
  console.log("reshapedData", reshapedData);
  const selectCountryData = reshapedData[selectedCountry];
  console.log("selectCountryData", selectCountryData);
  if (selectCountryData) {
    selectCountryData.forEach((entry) => {
      console.log("Revising Entry in loop", entry["African Country"]);
      const partnershipCard = document.createElement("div");
      partnershipCard.classList.add("card-body", "partner", "custom-scroll");
      const partnerTitle = document.createElement("h6");
      partnerTitle.classList.add("card-title", "listPartners");
      partnerTitle.innerHTML = `${entry["African Country"]}`;
      partnershipCard.appendChild(partnerTitle);

      //console.log('Entry', entry)
      const areasTitleContainer = document.createElement("div");
      areasTitleContainer.classList.add("card-text", "mb-1");
      areasTitleContainer.style.display = partnerDivStyle.areasCoopDisplay;
      areasTitleContainer.style.alignItems =
        partnerDivStyle.areasCoopAlignItems;
      areasTitleContainer.style.flexWrap = partnerDivStyle.areasCoopFlexWrap;
      areasTitleContainer.style.gap = partnerDiv.areasCoopGap;

      const areasTitle = document.createElement("span");
      areasTitle.classList.add("card-text", "mb-1", "areasCoop");
      areasTitle.style.paddingBottom = partnerDiv.areasCoopPaddinBottom;
      areasTitle.style.marginBottom = partnerDiv.areasCoopMarginBottom;
      areasTitle.style.marginRight = partnerDiv.areasCoopMarginRight;
      areasTitle.innerHTML = "Areas of cooperation: ";
      areasTitleContainer.appendChild(areasTitle);

      // Tag container
      if (entry["Areas of Cooperation - Categories"] !== "No data") {
        entry["Areas of Cooperation - Categories"].forEach((area) => {
          console.log("Area of cooperation", area);
          const tag = document.createElement("button");
          tag.classList.add(
            "btn",
            "btn-outline-dark",
            "aresCoop",
            "ms-1",
            "me-1",
          );
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
          icon.style.marginRight = "5px";

          tag.appendChild(icon); // Add icon to the tag
          tag.appendChild(document.createTextNode(area));
          areasTitleContainer.appendChild(tag);
          new bootstrap.Tooltip(tag);
        });
        //partnershipCard.appendChild(areasTitleContainer);
      } else {
        const noData = document.createElement("p");
        noData.classList.add("card-text", "mb-1", "areasCoop");
        noData.innerHTML = `No data available`;
        areasTitleContainer.appendChild(noData);
        areasTitleContainer.appendChild(noData);
      }
      if (entry["Economic and Investment Trend"] !== "No data") {
        const trendContainer = document.createElement("div");
        trendContainer.classList.add("card-text", "mb-1");

        // Add the label text before the button
        const trendLabel = document.createElement("span");
        trendLabel.classList.add("trendLabel", "fw-bold", "me-2");
        trendLabel.textContent = "Economic and investment trend:";
        trendContainer.appendChild(trendLabel);

        const trendValue = entry["Economic and Investment Trend"];
        const trendButton = document.createElement("button");
        trendButton.classList.add(
          "btn",
          "btn-sm",
          "d-flex",
          "align-items-center",
          "justify-content-between",
        );

        // Set button color and icon based on the trend value
        if (trendValue === "Increase") {
          trendButton.classList.add("btn-success");
          trendButton.innerHTML = `<span>Increase</span> <img src="/assets/img/icons/arrow-up.svg" alt="Arrow Up" style="width: 12px; height: 12px;">`;
        } else if (trendValue === "Decrease") {
          trendButton.classList.add("btn-danger");
          trendButton.innerHTML = `<span>Decrease</span> <img src="/assets/img/icons/arrow-down.svg" alt="Arrow Down" style="width: 12px; height: 12px;">`;
        } else if (trendValue === "Stable") {
          trendButton.classList.add("btn-secondary");
          trendButton.innerHTML = `<span>Stable</span> <img src="/assets/img/icons/minus.svg" alt="Minus Icon" style="width: 12px; height: 12px;">`;
        }
        trendContainer.appendChild(trendButton);
        partnershipCard.appendChild(trendContainer);
      }
      partnershipCard.appendChild(areasTitleContainer);
      scrollDiv.appendChild(partnershipCard);
      partnerDiv.appendChild(scrollDiv);
    });
  }
  const tooltipTriggerList = [].slice.call(
    partnerDiv.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

export function populateComparativeCard(selectedCountry) {
  console.log("selectedCountry", selectedCountry);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  const biPartner = document.createElement("h3"); // bilateral partner
  biPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h3",
  );
  biPartner.innerHTML = `${selectedCountry}`;
  biPartner.style.borderBottom = partnerDivStyle.borderBottom; // Línea roja de 2px
  biPartner.style.paddingBottom = partnerDiv.paddingBottom; // Espacio entre el texto y la línea
  biPartner.style.marginTop = partnerDiv.marginTop; // Espacio entre el texto y la línea
  partnerDiv.appendChild(biPartner);

  const partnerSubTitle = document.createElement("h4");
  partnerSubTitle.classList.add("cardSubtitle");
  partnerSubTitle.innerHTML = `${partnerDivStyle.comparativeSubtitleText}`;
  partnerDiv.appendChild(partnerSubTitle);

  const comparativeData = databases.comparativeData;
  console.log("Comparative data", comparativeData);

  // Filter data for the selected country
  const selectCountryData = comparativeData.filter(
    (country) => country["Non-African Partner"] === selectedCountry,
  );
  console.log("Filtered Comparative Data:", selectCountryData);

  if (selectCountryData.length > 0) {
    selectCountryData.forEach((entry) => {
      const partnershipCard = document.createElement("div");
      partnershipCard.classList.add("card-body", "partner");
      // Iterate over keys of the country object
      Object.keys(entry).forEach((key) => {
        const value = entry[key];

        // Create a container for each variable
        const variableContainer = document.createElement("div");
        variableContainer.classList.add("card-body", "partner");

        // Check if the value is an array
        if (Array.isArray(value)) {
          // Create a list for array elements
          const listContainer = document.createElement("ul");
          listContainer.classList.add("matrixVarList");

          value.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.classList.add("card-text", "mb-1");
            listItem.textContent = item;
            listContainer.appendChild(listItem);
          });

          variableContainer.innerHTML = `<h6 class="mb-1">${key}:</h6>`;
          variableContainer.appendChild(listContainer);
        } else {
          // If not an array, display the value directly
          variableContainer.innerHTML = `<h6>${key}:</h6>
                                                   ${value}`;
        }
        partnershipCard.appendChild(variableContainer);
      });
      partnerDiv.appendChild(partnershipCard);
    });
  } else {
    const noDataMessage = document.createElement("p");
    noDataMessage.classList.add("card-text", "no-data");
    noDataMessage.innerHTML = "No data available for the selected country.";
    partnerDiv.appendChild(noDataMessage);
  }
}
