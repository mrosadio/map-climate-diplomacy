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
    //partnerSubtitleText: "Partnerships with African countries",
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
  overviewText: {
    "China": "<p>China deploys policy‑bank finance and turnkey engineering, procurement and construction contracts, thereby bundling its own technology packages to deliver utility‑scale renewables, transmission lines and industrial parks at speed. Emerging ‘green Belt and Road Initiative (BRI)’ standards add climate filters, but the core aim is to lock in resource corridors and embed Chinese technical norms abroad.</p> <p>The Chinese trade deficit with the six African countries in the database is at USD 32 billion, yet foreign direct investment (FDI) flows remain modest at USD 1.1 billion (0.18 % of GDP). The six flagship projects in the database centre on logistics corridors and renewable‑energy generation, complemented by two ‘green’ industrial sites. This confirms Beijing’s prioritisation of commercial corridors and resource access, and that financial engagement is driven largely by trade rather than equity.</p>",
    "European Union": "<p>The EU blends European Investment Bank loans with budget‑backed guarantees to channel long‑tenor, lower‑risk capital into decentralised renewables, smart grids and agrotechnology, while exporting the EU’s stringent environmental, social and governance (ESG) rulebook. This ‘green‑industrial enabler’ model secures critical minerals and hydrogen corridors through rules‑based partnerships rather than asset control.</p> <p>The database used for this mapping highlights the EU’s structural investor profile: Despite a trade deficit of USD 10.6 billion with the six African countries, the EU channels USD 40 billion (1.9 % GDP) in foreign direct investment (FDI) into these economies. Six ‘flagship’ green projects (hydrogen, grids, climate‑smart agriculture, water) and two green‑manufacturing initiatives are recorded in the database, underscoring a transition‑focused approach with patient capital. The average ratios point to a stronger leverage effect on FDI than on the trade balance.</p>",
    "Gulf Countries": "<p>Gulf sovereign‑wealth funds supply patient equity and rapid bilateral deals for frontier projects such as mega-cities and green hydrogen. Under light regulations, capital tolerates early‑stage risk, anchors lenders and diversifies Gulf countries' economies. ESG compliance remains pragmatic. Project data for the six Gulf Cooperation Council (GCC) states mainly covers Saudi Arabia and the United Arab Emirates (UAE). Our dataset is therefore limited to Saudi Arabia and the UAE, and does not capture project details from the other GCC countries. </p> <p>While cumulative figures show a USD 20 billion trade deficit and USD 1.16 billion in foreign direct investment (FDI) (0.18 % of GDP), overseas finance is hard to track: Much flows through multilateral agencies, sovereign wealth funds or affiliated private developers with limited disclosure, while reporting is fragmented and weak governance reduces transparency. Six flagship projects target energy, green hydrogen, critical‑minerals mining and agrologistics. Only one green‑manufacturing project explicitly involves Saudi Arabia (green ammonia in Morocco). The database lists no stand‑alone UAE industrial investment. Their contributions are blended into the GCC aggregate, limiting data‑granularity.</p>"
  },
  statStrip: {
    tradeDeficit: {
      "China": "USD 32 bn",
      "European Union": "USD 10.6 bn",
      "Gulf Countries": "USD 20 bn",
    },
    foreignInvest: {
      "China": "USD 1.1 bn",
      "European Union": "USD 40 bn",
      "Gulf Countries": "USD 1.16 bn",
    },
    NProjects: {
      "China": "6",
      "European Union": "6",
      "Gulf Countries": "6",
    }
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
