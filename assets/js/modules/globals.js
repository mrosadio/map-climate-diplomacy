const globals = {
  geoJSONUrl: "https://raw.githubusercontent.com/Afripoli/D3-graph-gallery/refs/heads/master/DATA/world.geojson",
  overviewDataUrl: "/assets/db/pie-climate-diplomacy.csv",
  bilateralDataUrl: "/assets/db/green-cooperation.csv",
  comparativeDataUrl: "/assets/db/comparative-advantage.csv",
  databases: {
    geoJSONData: null,
    africaGeoJSON: null,
    bilateralPartnerMap: null,
    mergedWorldGeoAndBiData: null,
    reshapedBiData: null,
    overviewData: null,
    mergedAfricaOverviewData: null,
    comparativeData: null,
    mergedComparativeData: null,
  },
  africanCountries: new Set([
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cape Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Ivory Coast",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Western Sahara",
    "São Tomé",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "Somaliland",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Swaziland",
    "United Republic of Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe"
  ]),
  EUCountries: new Set([
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden"
  ]),
  GCCCountries: new Set([
    "Oman",
    "Qatar",
    "Saudi Arabia",
    "United Arab Emirates",
  ]),
  africanPartners: null, //ideally, this set is automatically populated from the data
  mainViewBox: "-500 0 2000 400",
  svgWidth: 900,
  svgHeight: 600,
  svgViewBox: "100 0 900 600",
  legend: {
    textAlign: "left",
    margin: "10px 0",
    fontWeight: "bold",
    fontSize: window.innerWidth <= 768 ? "10pt" : "12pt",
    marginBottom: window.innerWidth <= 768 ? "12px" : "",
    paddingBottom: window.innerWidth <= 768 ? "2.5px" : "",
    borderBottom: window.innerWidth <= 768 ? "1px solid black" : "",
    width: window.innerWidth <= 768 ? "155px" : "",
    text: "Investment connectivity",
    flexDirection: window.innerWidth <= 768 ? "rows" : "column",
    justifyContent: window.innerWidth <= 768 ? "space-between" : "flex-start",
    textAlign: window.innerWidth <= 768 ? "center" : "left",
    alignItems: window.innerWidth <= 768 ? "center" : "left",
    gap: window.innerWidth <= 768 ? "10px" : "5px",
    itemDisplay: window.innerWidth <= 768 ? "block" : "flex",
    itemMargin: "5px 0",
    itemAlignItems: "center",
    itemWidth: window.innerWidth <= 768 ? "40px" : "20px",
    itemHeight: window.innerWidth <= 768 ? "40px" : "20px",
    itemMarginRight: window.innerWidth <= 768 ? "0px" : "10px",
    itemFontSize: window.innerWidth <= 768 ? "11px" : "14px",
    colorRange: ["#a8d5ba", "#5cae6b", "#2b7e3d"]
  },
  mapDisplaySettings: {
    China: {
      scale: 510,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 3.5, globals.svgHeight / 1.5]
      }  // Create a function to dynamically calculate the values. In an object, you cannot reference other properties of the same object unless you use a function 
    },
    "European Union": {
      scale: 350,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 1.5, globals.svgHeight / 1.43]
      }
    },
    "Gulf Countries": {
      scale: 550,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 2, globals.svgHeight / 1.6]
      }
    },
    colors: {
      nonAfricaPartner: "#fec030",
      africaPartner: "#ffdc94",
      default: "#d3d3d3"
    },
    connectivityColor: {
      Low: "#c8dac0",
      Moderate: "#739e69",
      High: "#3a653a",
      default: "#red"
    },
    style: {
      strokeDefaultColor: "white",
      strokeDefaultWidth: 0.5,
      strokeHighlightColor: "black",
      strokeHighlightWidth: 2
    }
  },
  partnerDivStyle: {
    borderBottom: "2px solid #2b7e3d",
    paddingBottom: "10px",
    marginTop: "0px !importat",
    partnerSubtitleClass: "card-subTitle",
    partnerSubtitleText: "Partnerships with African countries",
    overviewSubtitleText: "Economic and investment connectivity with African countries",
    comparativeSubtitleText: "Comparative advantage of non-African countries",
    areasCoopDisplay: "flex",
    areasCoopAlignItems: "center",
    areasCoopFlexWrap: "wrap",
    areasCoopGap: "5px",
    areasCoopPaddinBottom: "0px",
    areasCoopMarginBottom: "0px",
    areasCoopMarginRight: "10px",
  },
  customDivStyle: {
    maxHeight: "100%",
    overflowY: "auto",
    marginTop: "0px",
    display: "block"
  },
  keyDrivers: {
    China: "Resource Control & Economic Statecraft",
    EU: "Rules-Based Trade & Strategic Resilience",
    GCC: "Economic Diversification and Creation of New Trade Routes"
  },
  cooperation: {
    categories: {
      "Hydrogen": "Hydrogen",
      "Energy infrastructure": "Energy infrastructure",
      "Solar": "Solar",
      "Windfarms": "Windfarms",
      "Water": "Water",
      "Mining/Raw materials": "Mining/Raw materials",
      "Adaptation": "Adaptation",
      "Transport/Logistics": "Transport/Logistics",
      "Chemicals": "Chemicals",
      "Metals": "Metals",
      "Agriculture": "Agriculture"
    },
    color: {
      "Hydrogen": "#75D1D1", // Light teal
      "Energy Infrastructure": "#F4A27D", // Soft orange
      "Solar": "#FFDC94", // Light yellow
      "Windfarms": "#E3F5F5", // Pale blue
      "Water": "#9CC3D5", // Sky blue
      "Mining / Raw materials": "#EF9CAF", // Soft pink
      "Adaptation": "#A1D490", // Light green
      "Transport / Logistics": "#C39BD3", // Lavender
      "Chemicals": "#F7B7A3", // Coral
      "Metals": "#8E44AD", // Light peach
      "Agriculture": "#F9E79F" // Pale gold
    }
  }
}

export default globals;
