import { drawOverviewMap, drawBilateralMap } from "./drawMap.js";
import globals from "./globals.js";

import { prepareAfricaOverviewData, prepareBilateralData } from "./dataManager.js";

const { geoJSONUrl, bilateralDataUrl, databases } = globals;

export async function showAfricaOverview() {
  try {
    // Prepare the data for the Africa Overview map
    const overviewData = await prepareAfricaOverviewData();
    const mergedWorldGeoJSON = databases.mergedAfricaOverviewData;
    await prepareBilateralData(); // reshaped Bidata is constructed here
    const reshapedBiData = databases.reshapedBiData;
    drawOverviewMap(mergedWorldGeoJSON, reshapedBiData);
  } catch (error) {
    console.error("Error preparing Africa overview data:", error);
  }
}
