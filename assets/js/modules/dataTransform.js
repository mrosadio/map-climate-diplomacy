import globals from "./globals.js";

const { databases } = globals;

// Keep only African countries in the GeoJSON data
export function filterGeoJSON(geoJSONdata, countriesSet) {
  //console.log('Loading GEOJSON data:', geoJSONdata);
  const filteredFeatures = geoJSONdata.features.filter((feature) => {
    const countryName = feature.properties.name;
    return countriesSet.has(countryName);
  });
  return { ...geoJSONdata, features: filteredFeatures };
}

// Filters the GeoJSON data to only include African countries AND
// merges it with the any CSV data (Overview map)
export function mergeGeoJSONWithData(geoJSONData, csvData) {
  const mergedFeatures = geoJSONData.features.map((feature) => {
    const countryName = feature.properties.name;
    const csvEntry = csvData.find((entry) => entry["African Country"] === countryName);
    return {
      ...feature,
      properties: {
        ...feature.properties,
        ...csvEntry,
      },
    };
  });

  return {
    ...geoJSONData,
    features: mergedFeatures,
  };
}

export function groupByNonAfrican(data) {
  const groupedData = {};
  data.forEach((row) => {
    const partner = row["Non-African Partner"];
    if (!groupedData[partner]) {
      groupedData[partner] = [];
    }
    groupedData[partner].push(row);
  });
  return groupedData;
}

// Merge World GeoJSON data with the reshaped bilateral investments data
export function mergeBilateralData(geoJSONData, bilateralData) {
  // Merge the grouped data with the GeoJSON data
  const mergedFeatures = geoJSONData.features.map((feature) => {
    const partnerName = feature.properties.name; // Match GeoJSON feature by name (Non-African Partner)

    // Find the data for this partner in the grouped data
    const partnerData = bilateralData[partnerName]; // Get all African countries for this partner
    ////console.log(`Partner: ${partnerName}, Partner Data:`, partnerData);
    return {
      ...feature,
      properties: {
        ...feature.properties,
        bilateralPartners: partnerData || [], // Attach African countries and their data, or an empty array if none
      },
    };
  });

  return {
    ...geoJSONData,
    features: mergedFeatures,
  };
}

export function getPartners(groupedData) {
  //console.log("Grouped data:", groupedData);
  // Create a Map to store Non-African Partners and their corresponding African partners
  const partnerMap = new Map();
  // Iterate over the groupedData
  Object.keys(groupedData).forEach((nonAfricanPartner) => {
    const africanPartnersSet = new Set();
    // Collect all African partners for this Non-African Partner
    groupedData[nonAfricanPartner].forEach((entry) => {
      africanPartnersSet.add(entry["African Country"]);
    });
    // Add the Non-African Partner and its African partners to the Map
    partnerMap.set(nonAfricanPartner, africanPartnersSet);
  });
  //console.log("Partner Map:", partnerMap);
  return partnerMap;
}
