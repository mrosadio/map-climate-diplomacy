import globals from "./globals.js";
import { loadCSVData, loadJSONData } from "./dataLoader.js";
import { filterGeoJSON, getPartners, groupByNonAfrican, mergeBilateralData, mergeGeoJSONWithData } from "./dataTransform.js";

const { databases, africanCountries } = globals;
// Wraps the callback-style CSV loader so the files can be requested in parallel
const loadCSV = (url) => new Promise((resolve) => loadCSVData(url, resolve));

export async function initializeDatabases() {
  try {
    // Request all files at once: the wait is network round trips, not file size
    const [geoJSONdata, overviewData, bilateralData] = await Promise.all([
      loadJSONData(),
      loadCSV(globals.overviewDataUrl),
      loadCSV(globals.bilateralDataUrl),
    ]);
    if (!geoJSONdata) throw new Error("Failed to load GeoJSON data");
    databases.geoJSONData = geoJSONdata;
    databases.overviewData = overviewData;
    databases.bilateralData = bilateralData;

    // Dynamically populate the africanPartners set
    const africanPartnersSet = new Set();
    overviewData.forEach((row) => {
      if (row["African Country"]) {
        africanPartnersSet.add(row["African Country"]);
      }
    });
    globals.africanPartners = africanPartnersSet; // Update the global set
  } catch (error) {
    console.error("Error initializing databases:", error);
  }
}

export async function prepareAfricaOverviewData() {
  const geoJSONData = globals.databases.geoJSONData;
  const csvData = globals.databases.overviewData;
  ////console.log('Pie diplomacy CSV data loaded', csvData)

  if (!geoJSONData || !csvData) {
    console.error("GeoJSON or CSV data is missing. Ensure data is loaded before calling this function.");
    return null;
  }

  // Filter GeoJSON data for African countries
  const filteredGeoJSON = filterGeoJSON(geoJSONData, globals.africanCountries); // we dont need to filter african countries since we decided to show in the overview map the world map

  // Merge filtered GeoJSON with CSV data
  const mergedData = mergeGeoJSONWithData(filteredGeoJSON, csvData);
  //const mergedData = mergeGeoJSONWithData(geoJSONData, csvData);

  // Optionally save the merged data in globals for reuse
  globals.databases.mergedAfricaOverviewData = mergedData;
  //console.log('Merged Africa overview data:', mergedData);

  return mergedData;
}

export async function prepareBilateralData() {
  const geoJSONData = globals.databases.geoJSONData;
  const bilateralData = groupByNonAfrican(databases.bilateralData);
  //console.log('Grouped bilateral data in function prepareBilateralData:', bilateralData);
  const bilateralPartners = getPartners(bilateralData);
  //console.log('Bilateral partners:', bilateralPartners);

  if (!geoJSONData || !bilateralData) {
    console.error("GeoJSON or Bilateral data is missing. Ensure data is loaded before calling this function.");
    return null;
  }

  // Merge the GeoJSON data with the bilateral data
  const africanGeoJSON = filterGeoJSON(geoJSONData, globals.africanCountries);
  const mergedData = mergeBilateralData(africanGeoJSON, bilateralData);

  // Optionally save the merged data in globals for reuse
  databases.mergedBilateralData = mergedData;
  databases.reshapedBiData = bilateralData;
  databases.bilateralPartnerMap = bilateralPartners;

  return { mergedData, bilateralData, bilateralPartners };
}

export async function prepareComparativeData() {
  const geoJSONData = globals.databases.geoJSONData;
  const csvData = globals.databases.comparativeData;

  if (!geoJSONData || !csvData) {
    console.error("GeoJSON or CSV data is missing. Ensure data is loaded before calling this function.");
    return null;
  }

  // Merge filtered GeoJSON with CSV data
  const mergedData = mergeGeoJSONWithData(geoJSONData, csvData);

  // Optionally save the merged data in globals for reuse
  globals.databases.mergedComparativeData = mergedData;

  return mergedData;
}
