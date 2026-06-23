import { drawOverviewMap, drawBilateralMap } from "./drawMap.js";
import { addLegend } from "./addLegend.js";
import { setupControls } from "./setUpControls.js";
import globals from "./globals.js";

import {
  prepareAfricaOverviewData,
  prepareBilateralData,
  prepareComparativeData,
} from "./dataManager.js";

const { geoJSONUrl, bilateralDataUrl, databases } = globals;

function refresh() {
  //if (/Mobi|Android/i.test(navigator.userAgent)) {
  // El usuario está en un dispositivo móvil
  // simulateCountryClick(svg, filteredGeoJSON, "Chad");
  // showPickerAfrica();
  //button.scrollIntoView({ behavior: "smooth", block: "center" });
  //} else {
  console.log("refreshing");

  window.location.href = window.location.href;
  //}
}

export async function showAfricaOverview() {
  try {
    // Prepare the data for the Africa Overview map
    const overviewData = await prepareAfricaOverviewData();
    const mergedWorldGeoJSON = databases.mergedAfricaOverviewData;
    await prepareBilateralData(); // reshaped Bidata is constructed here
    const reshapedBiData = databases.reshapedBiData;

    console.log("test database", databases.reshapedBiData);
    console.log("Merged world GeoJSON data", mergedWorldGeoJSON);
    console.log("africaOverviewData", overviewData); // For now, this is no longer necessary since we want to render the world map on the overview page

    drawOverviewMap(mergedWorldGeoJSON, reshapedBiData);
    addLegend(databases.overviewData); // this database is just the CSV Pie diplomacy data converted to JSON
    setupControls(mergedWorldGeoJSON);

    // Update the UI (e.g., scroll to the button, update the block name)
    const buttonScroll = document.getElementById("africaButton");
    if (buttonScroll) {
      buttonScroll.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const selectedBlock = document.getElementById("blockNameNowTemp");
    if (selectedBlock) {
      selectedBlock.innerText = "African countries overview";
      console.log("African countries overview", selectedBlock);
    }
  } catch (error) {
    console.error("Error preparing Africa overview data:", error);
  }
}
