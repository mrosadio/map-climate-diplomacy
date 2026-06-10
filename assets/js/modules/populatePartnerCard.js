import globals from "./globals.js";

const { partnerDivStyle, databases, cooperation, keyDrivers } = globals;

export function populatePartnerCard(selectedCountry) {
  console.log("selectedCountry", selectedCountry);
  const partnerDiv = document.querySelector(".card");
  partnerDiv.innerHTML = "";

  const biPartner = document.createElement("h2"); // bilateral partner
  biPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h3",
  );
  biPartner.innerHTML = `${selectedCountry} - Africa`;
  biPartner.style.borderBottom = partnerDivStyle.borderBottom; // Línea roja de 2px
  biPartner.style.paddingBottom = partnerDiv.paddingBottom; // Espacio entre el texto y la línea
  biPartner.style.marginTop = partnerDiv.marginTop; // Espacio entre el texto y la línea
  partnerDiv.appendChild(biPartner);

  //   const partnerSubTitle = document.createElement("h4");
  //   partnerSubTitle.classList.add("cardSubtitle");
  //   partnerSubTitle.innerHTML = `${partnerDivStyle.partnerSubtitleText}`;
  //   partnerDiv.appendChild(partnerSubTitle);

  // Add summary header:
  //   const partnerSubTitle = document.createElement("h4");
  //   partnerSubTitle.classList.add("cardSubtitle");
  //   partnerSubTitle.innerHTML = `${selectCountryData.length} African partners`;
  //   partnerDiv.appendChild(partnerSubTitle);

  // Crear el contenedor para el contenido con scroll
  const scrollDiv = document.createElement("div");
  scrollDiv.classList.add("customScroll"); // Se añade 'custom-scroll' aquí

  const reshapedData = databases.reshapedBiData;
  console.log("reshapedData", reshapedData);
  const selectCountryData = reshapedData[selectedCountry];
  console.log("selectCountryData", selectCountryData);
  if (selectCountryData) {
    const partnerSubTitle = document.createElement("h4");
    partnerSubTitle.classList.add("cardSubtitle");
    partnerSubTitle.innerHTML = `${selectCountryData.length} African partners`;
    partnerDiv.appendChild(partnerSubTitle);

    selectCountryData.forEach((entry) => {
      console.log("Revising Entry in loop", entry["African Country"]);
      const partnershipCard = document.createElement("div");
      partnershipCard.classList.add("card-body", "partner", "custom-scroll");
      const partnerTitle = document.createElement("h5");
      partnerTitle.classList.add("card-title", "listPartners");
      partnerTitle.innerHTML = `${entry["African Country"]}`;
      partnershipCard.appendChild(partnerTitle);

      // Project type
      //const project = document.createElement("p");
      //project.classList.add("card-text", "project", "mb-1");
      //project.innerHTML = `Project type: ${entry["Type of Climate Finance Project"]}`;
      //partnershipCard.appendChild(project);

      // Year
      //const year = document.createElement("p");
      //year.classList.add("card-text", "year", "mb-1");
      //year.innerHTML = `Year: ${entry.Year}`;
      //partnershipCard.appendChild(year);

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

      // access.appendChild(icon);
      // access.appendChild(link);
      //partnershipCard.appendChild(access);

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
        //areasTitle.style.fontFamily = "RalewayLight";
        // areasTitle.style.fontSize = "11pt";
        areasTitle.style.paddingBottom = partnerDiv.areasCoopPaddinBottom;
        areasTitle.style.marginBottom = partnerDiv.areasCoopMarginBottom;
        areasTitle.style.marginRight = partnerDiv.areasCoopMarginRight;
        areasTitle.innerHTML = "Areas of cooperation: ";
        areasTitleContainer.appendChild(areasTitle);

        // Tag container
        entry["Areas of Cooperation - Categories"].forEach((area) => {
          console.log("Area of cooperation", area);

          const tag = document.createElement("button");
          tag.classList.add(
            "btn",
            "btn-outline-dark",
            "aresCoop",
            "ms-1"
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
          //icon.style.marginRight = "5px";

          tag.appendChild(icon); // Add icon to the tag
          //tag.appendChild(document.createTextNode(area));
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
        trendContainer.classList.add("card-text", "mb-1");

        // Add the label text before the button
        const trendLabel = document.createElement("span");
        trendLabel.classList.add("trendLabel", "me-2");
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
        // Add Number of Flagship Green Projects
        if (entry["Number of Flagship Green Projects"] !== "No data") {
          const flagshipProjects = document.createElement("p");
          flagshipProjects.classList.add(
            "card-text",
            "mb-1",
            "flagshipProjects",
          );
          flagshipProjects.innerHTML = `<span class="flagshipProjects">No. Flagship Green Projects:</span> ${entry["Number of Flagship Green Projects"]}`;
          trendContainer.appendChild(flagshipProjects);
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
export function expandPartnerCard() {
  const partnerDiv = document.querySelector(".card.partnership");
  partnerDiv.classList.add("expanded");
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

  const partnerSubTitle = document.createElement("h4");
  partnerSubTitle.classList.add("cardSubtitle");
  partnerSubTitle.innerHTML = `${partnerDivStyle.overviewSubtitleText}`;
  partnerDiv.appendChild(partnerSubTitle);

  const driverText = document.createElement("h3");
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
      const partnerTitle = document.createElement("h5");
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
