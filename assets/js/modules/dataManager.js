import globals from "./globals.js";
import { loadCSVData, loadJSONData } from './dataLoader.js';
import { filterGeoJSON, getPartners, groupByNonAfrican, mergeBilateralData, mergeGeoJSONWithData } from "./dataTransform.js";

const { databases, africanCountries } = globals;

export async function initializeDatabases() {
    try {
        // Load GeoJSON data
        const geoJSONdata = await loadJSONData();
        if (!geoJSONdata) throw new Error("Failed to load GeoJSON data");
        databases.geoJSONData = geoJSONdata;

        // Load climate diplomacy CSV data for overview page
        const overviewData = await new Promise((resolve, reject) => {
            loadCSVData(globals.overviewDataUrl, (data) => {
                resolve(data);
            });
        });
        databases.overviewData = overviewData;

         // Dynamically populate the africanPartners set
         const africanPartnersSet = new Set();
         overviewData.forEach((row) => {
             if (row["African Country"]) {
                 africanPartnersSet.add(row["African Country"]);
             }
         });
         globals.africanPartners = africanPartnersSet; // Update the global set
 
         // Load bilateral green cooperation CSV data
        const bilateralData = await new Promise((resolve, reject) => {
            loadCSVData(globals.bilateralDataUrl, (data) => {
                resolve(data);
            });
        });
        databases.bilateralData = bilateralData;

        // Load comparative advantage CSV data
        const comparativeData = await new Promise((resolve, reject) => {
            loadCSVData(globals.comparativeDataUrl, (data) => {
                resolve(data);
            });
        });
        databases.comparativeData = comparativeData;

        console.log("Databases initialized:", databases);
    } catch (error) {
        console.error("Error initializing databases:", error);
    }
}

export async function prepareAfricaOverviewData() {
    const geoJSONData = globals.databases.geoJSONData;
    const csvData = globals.databases.overviewData;
    //console.log('Pie diplomacy CSV data loaded', csvData)

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
    console.log('Merged Africa overview data:', mergedData);

    return mergedData;
}

export async function prepareBilateralData() {
    const geoJSONData = globals.databases.geoJSONData;
    const bilateralData = groupByNonAfrican(databases.bilateralData);
    console.log('Grouped bilateral data in function prepareBilateralData:', bilateralData);
    const bilateralPartners = getPartners(bilateralData);
    console.log('Bilateral partners:', bilateralPartners);

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