import globals from "./globals.js";

const { databases } = globals;

// CSV raw databases
export function loadCSVData(filePath, callback) {
  const keysToConvertToArray = ["Areas of Cooperation - Categories", "Finance & Investment Model", "Policy & Regulatory Frameworks", "Technology & Green Industry Model", "Sustainability Standards & ESG Compliance", "Geopolitical & Trade Influence"];
  d3.csv(filePath, function (d) {
    let result = {};
    for (let key in d) {
      if (d.hasOwnProperty(key)) {
        // Trim whitespace from the value
        const rawValue = d[key] ? d[key].trim() : "";
        if (keysToConvertToArray.includes(key)) {
          // Split the string by commas and trim whitespace
          result[key] = rawValue ? rawValue.split(",").map((item) => item.trim()) : "No data";
        } else {
          // Replace empty values with "No data"
          const value = rawValue !== "" ? rawValue : "No data";

          // Convert numeric values to numbers, leave others as strings
          result[key] = !isNaN(value) && value !== "No data" ? +value : value;
        }
      }
    }
    return result;
  })
    .then((data) => {
      //console.log('CSV data: ', data)
      callback(data);
    })
    .catch((error) => {
      console.error("Error loading CSV data: ", error);
    });
}

// Geospatial databases
export async function loadJSONData() {
  try {
    // Load GeoJSON from the provided URL
    const response = await fetch(globals.geoJSONUrl);
    const geoJSONdata = await response.json();
    return geoJSONdata;
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
    return null;
  }
}
