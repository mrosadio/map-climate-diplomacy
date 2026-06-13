const globals = {
  geoJSONUrl:
    "https://raw.githubusercontent.com/Afripoli/D3-graph-gallery/refs/heads/master/DATA/world.geojson",
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
    "Zimbabwe",
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
    "Sweden",
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
    colorRange: ["#a8d5ba", "#5cae6b", "#2b7e3d"],
  },
  mapDisplaySettings: {
    China: {
      scale: 510,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 3.5, globals.svgHeight / 1.5];
      }, // Create a function to dynamically calculate the values. In an object, you cannot reference other properties of the same object unless you use a function
    },
    "European Union": {
      scale: 350,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 1.5, globals.svgHeight / 1.43];
      },
    },
    "Gulf Countries": {
      scale: 550,
      center: [20, 0],
      get translation() {
        return [globals.svgWidth / 2, globals.svgHeight / 1.6];
      },
    },
    colors: {
      nonAfricaPartner: "#fec030",
      africaPartner: "#ffdc94",
      default: "#d3d3d3",
    },
    connectivityColor: {
      Low: "#c8dac0",
      Moderate: "#739e69",
      High: "#3a653a",
      default: "#d3d3d3",
    },
    style: {
      strokeDefaultColor: "white",
      strokeDefaultWidth: 0.5,
      strokeHighlightColor: "black",
      strokeHighlightWidth: 2,
    },
  },
  partnerDivStyle: {
    borderBottom: "2px solid #2b7e3d",
    paddingBottom: "10px",
    marginTop: "0px !importat",
    partnerSubtitleClass: "card-subTitle",
    //partnerSubtitleText: "Partnerships with African countries",
    overviewSubtitleText:
      "Economic and investment connectivity with African countries",
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
    display: "block",
  },
  overviewText: {
    China:
      "<p>China deploys policy‑bank finance and turnkey engineering, procurement and construction contracts, thereby bundling its own technology packages to deliver utility‑scale renewables, transmission lines and industrial parks at speed. Emerging ‘green Belt and Road Initiative (BRI)’ standards add climate filters, but the core aim is to lock in resource corridors and embed Chinese technical norms abroad.</p> <p>The Chinese trade deficit with the six African countries in the database is at USD 32 billion, yet foreign direct investment (FDI) flows remain modest at USD 1.1 billion (0.18 % of GDP). The six flagship projects in the database centre on logistics corridors and renewable‑energy generation, complemented by two ‘green’ industrial sites. This confirms Beijing’s prioritisation of commercial corridors and resource access, and that financial engagement is driven largely by trade rather than equity.</p>",
    "European Union":
      "<p>The EU blends European Investment Bank loans with budget‑backed guarantees to channel long‑tenor, lower‑risk capital into decentralised renewables, smart grids and agrotechnology, while exporting the EU’s stringent environmental, social and governance (ESG) rulebook. This ‘green‑industrial enabler’ model secures critical minerals and hydrogen corridors through rules‑based partnerships rather than asset control.</p> <p>The database used for this mapping highlights the EU’s structural investor profile: Despite a trade deficit of USD 10.6 billion with the six African countries, the EU channels USD 40 billion (1.9 % GDP) in foreign direct investment (FDI) into these economies. Six ‘flagship’ green projects (hydrogen, grids, climate‑smart agriculture, water) and two green‑manufacturing initiatives are recorded in the database, underscoring a transition‑focused approach with patient capital. The average ratios point to a stronger leverage effect on FDI than on the trade balance.</p>",
    "Gulf Countries":
      "<p>Gulf sovereign‑wealth funds supply patient equity and rapid bilateral deals for frontier projects such as mega-cities and green hydrogen. Under light regulations, capital tolerates early‑stage risk, anchors lenders and diversifies Gulf countries' economies. ESG compliance remains pragmatic. Project data for the six Gulf Cooperation Council (GCC) states mainly covers Saudi Arabia and the United Arab Emirates (UAE). Our dataset is therefore limited to Saudi Arabia and the UAE, and does not capture project details from the other GCC countries. </p> <p>While cumulative figures show a USD 20 billion trade deficit and USD 1.16 billion in foreign direct investment (FDI) (0.18 % of GDP), overseas finance is hard to track: Much flows through multilateral agencies, sovereign wealth funds or affiliated private developers with limited disclosure, while reporting is fragmented and weak governance reduces transparency. Six flagship projects target energy, green hydrogen, critical‑minerals mining and agrologistics. Only one green‑manufacturing project explicitly involves Saudi Arabia (green ammonia in Morocco). The database lists no stand‑alone UAE industrial investment. Their contributions are blended into the GCC aggregate, limiting data‑granularity.</p>",
  },
  partnerCountryText: {
    China: {
      Engagement: {
        Morocco: "<p>Morocco has high connectivity with China, with sustained upward dynamics. FDI engagement remains moderate, suggesting untapped development potential. The country’s trade deficit reflects growing dependence on Chinese products and the expansion of Chinese economic influence in the region.</p>",
        Senegal: "<p>Sino-Senegalese connectivity is moderate and stable, suggesting consolidated relations. FDI engagement remains low to moderate, indicating that development opportunities are still limited. Senegal’s trade deficit reveals growing dependence on Chinese manufactured products.</p>",
        Nigeria: "<p>Sino-Nigerian connectivity is moderate but decreasing. FDI engagement is low to moderate, below the country's economic potential. Despite the declining connectivity, the trade deficit reveals strong dependence on Chinese manufactured products.</p>",
        Kenya: "<p>Sino-Kenyan connectivity is moderate but growing. FDI engagement is also moderate, reflecting Chinese interest in Kenyan infrastructure. Kenya's trade deficit underscores significant dependence on Chinese imports, particularly in manufacturing and technology sectors.</p>",
        Zambia: "<p>Sino-Zambian connectivity is high and growing. FDI engagement remains moderate and is concentrated primarily on mining and infrastructure sectors. Zambia's trade surplus reflects a favourable position thanks to copper and raw material exports to China.</p>",
        "South Africa": "<p>Sino-South African connectivity is moderate but decreasing. FDI engagement remains moderate, despite the strategic importance of the South African market. South Africa's trade deficit reveals significant dependence on Chinese manufactured products.</p>"
      },
      Investment: {
        Morocco: "<p>China operates a ‘build‑the‑value‑chain’ model: Five separate deals cover upstream generation (wind/solar), battery‑grade chemicals, cathode fabrication and final cell assembly. Ticket sizes range from USD 240 million to USD 1.3 billion, signalling commitment to a full Electric Vehicles ‑supply ecosystem.</p>",
        Senegal: "<p>Chinese investments are diversified across transport connectivity, solid‑waste rehabilitation and sewage treatment. Together they shift almost one‑third of China’s Senegal portfolio toward adaptation infrastructure rather than generation assets.</p>",
        Nigeria: "<p>China dominates Nigeria’s green‑FDI ledger with hardware‑heavy commitments such as utility‑scale renewables, transport electrification and water‑management infrastructure.</p>",
        Kenya: "<p>China deploys a portfolio approach: Heavy civil works (dams, tunnels, sewage) that double as climate‑resilience assets; utility and distributed renewables (solar farms, grid upgrades); and transport electrification (electric vehicle assembly, BYD buses). This gives Nairobi both physical infrastructure and early green‑industry footholds.</p>",
        Zambia: "<p>China has a hardware‑heavy portfolio: utility hydro (750 MW), nameplate solar across ten sites (>700 MW), a smart‑village capacity‑building pilot and long‑running clean‑tech retrofits in copper mining.</p>",
        "South Africa": "<p>Chinese investment couples large clean-power builds with local capacity, including a flagship concentrated solar power plant, 700+ MW of photovoltaic/hybrid projects, a wind-equipment factory, a high-temperature gas-cooled reactor, a green-steel pilot and a university green-technology institute. These projects are building both generation and a domestic manufacturing-and-skills base.</p>"
      }
    },
    "European Union": {
      Engagement: {
        Morocco: "<p>Morocco maintains high connectivity with the European Union, characterised by an upward trend with a recent surge. FDI engagement is moderate to high, reflecting the attractiveness of the Moroccan market for European investors in the Global Gateway. The country’s trade deficit reveals a strong dependence on European imports, positioning the EU as a major strategic supplier.</p>",
        Senegal: "<p>Senegal benefits from high connectivity with the EU, driven by a growing trend that reflects the strengthening of historical ties. FDI engagement appears moderate, demonstrating sustained but measured interest from European investors. Senegal's trade deficit illustrates the attractiveness of the local market for European products and structural dependence on imports.</p>",
        Nigeria: "<p>Nigeria has limited but growing connectivity with the EU, suggesting potential for improvement. FDI engagement is low to moderate, despite the size of the Nigerian market. Nigeria's trade surplus reflects a more balanced position, primarily thanks to oil exports to Europe.</p>",
        Kenya: "<p>Kenya has limited and declining connectivity with the EU. FDI engagement remains low, suggesting structural or regulatory challenges. Despite weak investment links, Kenya's trade deficit reveals strong dependence on European products.</p>",
        Zambia: "<p>Zambia has moderate but declining connectivity with the EU. FDI engagement sits at a low to moderate level, reflecting the country's economic challenges. Zambia's trade deficit underscores dependence on European products, particularly in manufacturing sectors.</p>",
        "South Africa": "<p>South Africa benefits from high, stable connectivity with the EU. FDI engagement is very high, confirming the attractiveness of the South African market for European investors. South Africa's trade deficit reflects the importance of European imports, particularly in technology and manufacturing sectors.</p>"
      },
      Investment: {
        Morocco: "<p>The EU operates one large‐ticket hydrogen project in Morocco, which it channels through a policy‑heavy Global Gateway framework. The bloc is betting on Morocco’s renewables cost advantage to secure future green‑molecule imports.</p>",
        Senegal: "<p>EU capital comes in one large hydro‑plus‑irrigation block, blending power generation with water‑management benefits.</p>",
        Nigeria: "<p>The EU’s EUR 900 million Global Gateway envelope is the only non‑Chinese, green‑FDI ticket in the database. It couples grid modernisation with climate‑smart agrifood projects, filling gaps China does not address.</p>",
        Kenya: "<p>The EU concentrates its Kenyan investments in one flagship EUR 3.4 billion programme that marries export‑oriented green hydrogen with adaptation‑heavy agriculture and water projects. This mirrors the EU’s ‘people‑and‑planet’ narrative.</p>",
        Zambia: "<p>The EU has budgeted for two Global Gateway envelopes totalling EUR 615 million. This is split between climate‑ready agriculture (smallholder resilience) and grid‑strengthening for renewables.</p>",
        "South Africa": "<p>EU finance comes almost entirely through one large EUR 4.4 billion concessional‑finance package focused on coal phase‑out, grid reforms and adaptation skills, rather than hardware assets.</p>"
      }
    },
    "Gulf Countries": {
      Engagement: {
        Morocco: "<p>Morocco’s connections with Gulf countries are moderate and stable. FDI engagement also remains moderate, indicating established but non-intensified economic relations. The country’s trade deficit underscores its dependence on Gulf countries' imports, primarily in energy and petrochemical sectors.</p>",
        Senegal: "<p>Relations with Gulf countries present moderate connectivity in a stable environment. FDI engagement remains low and lacks transparency, reflecting still nascent economic ties. Senegal's trade deficit underscores dependence on energy imports and Gulf countries' products.</p>",
        Nigeria: "<p>Links with Gulf countries show low connectivity with an upward trend. FDI engagement remains opaque and apparently limited, reflecting underdeveloped relations. Nigeria's trade deficit indicates dependence on Gulf countries' imports, particularly in non-oil sectors.</p>",
        Kenya: "<p>Kenya’s connectivity with Gulf countries is moderate but decreasing. FDI engagement remains opaque and apparently weak, limiting partnership development. The country’s trade deficit indicates persistent dependence on Gulf countries imports.</p>",
        Zambia: "<p>Zambia has moderate but growing links with Gulf countries. FDI engagement appears moderate, suggesting emerging interest from Gulf investors. Zambia's trade deficit indicates dependence on the Gulf countries' supplies.</p>",
        "South Africa": "<p>South Africa has limited and declining connectivity with Gulf countries. FDI engagement remains moderate, suggesting underexploited opportunities. South Africa's trade deficit reflects its dependence on energy and petrochemical imports from the Gulf.</p>"
      },
      Investment: {
        Morocco: "<p>Saudi Arabia (with Chinese co‑developers) has an anchor equity stake in a Moroccan renewable‑ammonia plant, tying hydrogen ambitions to its own ammonia‑export strategy and insulating Morocco’s project pipeline from single‑country risk. It also brings sovereign‑backed capital for large renewable‑generation assets (mirroring the Gulf’s utility‑photovoltaic playbook).</p><p>The UAE brings USD 1.5 billion in an agrotechnology programme targeting Morocco’s adaptation and food‑security priorities.</p>",
        Senegal: "<p>Saudi money targets mega‑scale utility infrastructure – a desalination‑cum‑solar complex – and early resource deals (copper), mirroring Saudi Arabia ’s twin focus on water security and critical minerals.</p><p>The UAE is absent from Senegal’s green‑FDI ledger in this database, underscoring its more selective geographic spread compared with Morocco, Kenya or Zambia.</p>",
        Nigeria: "<p>Gulf investors are conspicuously absent from Nigeria’s green space in this database.</p>",
        Kenya: "<p>Saudi investors are, for now, absent from Kenya’s green‑FDI field, contrasting sharply with their significant solar‑desalination projects in Senegal and South Africa.</p><p>UAE capital is two‑track: a vision‑stage hydrogen export hub and a USD 1 billion digital‑economy data centre powered by renewables – placing Dubai / Abu Dhabi investors at the intersection of clean power and software‑driven growth.</p>",
        Zambia: "<p>Saudi Arabia is still at the scouting stage: The Public Investment Fund (PIF) is yet to close a green‑sector transaction, but is openly targeting Zambia’s copper as part of its Vision 2030 supply‑chain de‑risking.</p><p>The UAE has a single USD 1.1 billion metals deal securing a majority stake in Mopani and promising solar‑powered, low‑carbon processing.</p>",
        "South Africa": "<p>Saudi financing, led by ACWA Power, targets gigawatt-scale utility photovoltaic projects with battery storage. Two investments totalling about USD 1.5 billion position Saudi Arabia as a direct competitor to Chinese engineering, procurement and construction contractors on large renewable projects. Investors from the UAE do not appear in this database, in contrast to their copper and hydrogen investments elsewhere in Africa.</p>"
      }
    },
  },
  statStrip: {
    tradeDeficit: {
      China: "USD 32 bn",
      "European Union": "USD 10.6 bn",
      "Gulf Countries": "USD 20 bn",
    },
    foreignInvest: {
      China: "USD 1.1 bn",
      "European Union": "USD 40 bn",
      "Gulf Countries": "USD 1.16 bn",
    },
    NProjects: {
      China: "6",
      "European Union": "6",
      "Gulf Countries": "6",
    },
  },
  keyDrivers: {
    China: "Resource Control & Economic Statecraft",
    EU: "Rules-Based Trade & Strategic Resilience",
    GCC: "Economic Diversification and Creation of New Trade Routes",
  },
  cooperation: {
    categories: {
      Hydrogen: "Hydrogen",
      "Energy infrastructure": "Energy infrastructure",
      Solar: "Solar",
      Windfarms: "Windfarms",
      Water: "Water",
      "Mining/Raw materials": "Mining/Raw materials",
      Adaptation: "Adaptation",
      "Transport/Logistics": "Transport/Logistics",
      Chemicals: "Chemicals",
      Metals: "Metals",
      Agriculture: "Agriculture",
    },
    color: {
      Hydrogen: "#75D1D1", // Light teal
      "Energy Infrastructure": "#F4A27D", // Soft orange
      Solar: "#FFDC94", // Light yellow
      Windfarms: "#E3F5F5", // Pale blue
      Water: "#9CC3D5", // Sky blue
      "Mining / Raw materials": "#EF9CAF", // Soft pink
      Adaptation: "#A1D490", // Light green
      "Transport / Logistics": "#C39BD3", // Lavender
      Chemicals: "#F7B7A3", // Coral
      Metals: "#8E44AD", // Light peach
      Agriculture: "#F9E79F", // Pale gold
    },
  },
  trendConfig = {
    Increase: { src: "arrow-up.svg", title: "Increasing", filter: "invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg)" },
    Decrease: { src: "arrow-down.svg", title: "Decreasing", filter: "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)" },
    Stable:   { src: "minus.svg", title: "Stable", filter: "invert(50%)" },
  }
};

export default globals;
