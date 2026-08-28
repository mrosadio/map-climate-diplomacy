// drawMap.js
// Responsible for: SVG setup, drawing map paths, tooltips, hover/click events.
// Public functions:
//   drawOverviewMap    → default world view, all partner countries same colour
//                        + African country labels always visible
//   drawBilateralMap   → partner selected, African countries coloured by connectivity
//   addCountryLabels   → called by setUpControls toggle (if kept)
//   deleteCountryLabels
//   highlightAndTooltipEvents

import globals from "./globals.js";
import { populateCountryCard } from "./cards.js";
import { getCurrentPartner, onPartnerSelect } from "./layout.js";
const { mainViewBox, legend, mapDisplaySettings, databases, cooperation } =
  globals;

const style = mapDisplaySettings.style;
const connectivityColor = mapDisplaySettings.connectivityColor;
const countryLabelConfig = {
  Senegal: { dy: -4 },
  "Democratic Republic of the Congo": {
    lines: ["Democratic", "Republic", "of the Congo"],
    dy: -8,
  },
  Morocco: { dy: -18, dx: 20 },
  "Republic of the Congo": {
    lines: ["Republic of", "the Congo"],
    dy: -12,
    dx: 15,
  },
  "Equatorial Guinea": {
    lines: ["Equatorial", "Guinea"],
    dy: -6,
  },
  "Guinea Bissau": {
    lines: ["Guinea-", "Bissau"],
    dy: 6,
    dx: -10,
  },
  Gambia: {
    dx: -22,
  },
  "Central African Republic": {
    lines: ["Central African", "Republic"],
    dy: -6,
  },
  "Guinea-Bissau": {
    lines: ["Guinea", "Bissau"],
    dy: -6,
    dx: -22,
  },
  "South Sudan": {
    lines: ["South", "Sudan"],
    dy: -6,
  },
  "United Republic of Tanzania": {
    lines: ["Tanzania"],
    dy: 0,
  },
  "Sierra Leone": {
    lines: ["Sierra", "Leone"],
    dy: 0,
    dx: -22,
  },
  "Cape Verde": {
    lines: ["Cabo", "Verde"],
    dy: 0,
  },
  "South Africa": {
    dy: -12,
  },
  "Ivory Coast": {
    lines: ["Côte", "D'Ivore"],
  },
  "Benin": {
    dy: -6,
  },
  "Ghana": {
    dy: 6,
  },
  "Liberia": {
    dx: -22,
  },
  "Zambia": {
    dy: 10,
    dx: -10
  }
};
// -- SVG setup --
// Created once at module load time
const mapEl = document.querySelector("#map");
const W = mapEl?.clientWidth || 800;
const H = mapEl?.clientHeight || 500;

let svg = d3
  .select("#map")
  .append("svg")
  .attr("viewBox", `0 0 ${W} ${H}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("height", "100%")
  .attr("width", "100%");

// projection and path are module-level so updateProjection() can reassign them
// and addCountryLabels() can read the current path for centroid calculations.
let projection = d3
  .geoMercator()
  .scale(600)
  .center([20, 5])
  .translate([W / 2, H / 2]);
let path = d3.geoPath().projection(projection);
let g;

// --- Public: drawing function ---
export function drawOverviewMap(geoJSONData, reshapedBiData) {
  document.getElementById("mapLegend").style.display = "flex";
  console.log("Data to draw:", geoJSONData);
  if (!geoJSONData || !geoJSONData.features) {
    console.error("drawOverviewMap: no valid geoJSONData received");
    return;
  }
  const el = document.querySelector("#map");
  //svg.attr("preserveAspectRatio", "xMidYMin meet");
  svg.attr("viewBox", getViewBox(el));
  console.log("console svg", el.clientWidth);
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  g = svg.append("g");

  g.selectAll("path")
    .data(geoJSONData.features.filter((d) => {
      const [cx, cy] = path.centroid(d);
      return Number.isFinite(cx) && Number.isFinite(cy); // drop features with broken geometry
    }))
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => {
      // All countries on this map are African partners.
      const level = d.properties["connect_partners"];
      return level
        ? mapDisplaySettings.connectivityColor[level]
        : mapDisplaySettings.colors.default;
    })
    .attr("stroke", "#a7acb6")
    .attr("stroke-width", 1)
    .style("cursor", "default");

  // country labels always visible on overview map only
  // pointer-events:none prevents labels intercepting mouse events on paths
  // Country labels with per-country position and line-break overrides
  g.selectAll("g.country-label")
    .data(geoJSONData.features.filter((d) => {
      const [cx, cy] = path.centroid(d);
      return Number.isFinite(cx) && Number.isFinite(cy); // drop features with broken geometry
    }))
    .enter()
    .append("g")
    .attr("class", "country-label")
    .attr("transform", (d) => {
      const name = d.properties.name;
      const config = countryLabelConfig[name] || {};
      const [cx, cy] = path.centroid(d);
      const dx = config.dx || 0;
      const dy = config.dy || 0;
      return `translate(${cx + dx}, ${cy + dy})`;
    })
    .attr("pointer-events", "none")
    .each(function (d) {
      const name = d.properties.name;
      const config = countryLabelConfig[name] || {};

      const textEl = d3
        .select(this)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-family", "UncutRegular, sans-serif")
        .attr("fill", "#444441");

      if (config.lines) {
        config.lines.forEach((line, i) => {
          textEl
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? `0` : "10px")
            .text(line);
        });
      } else {
        textEl.append("tspan").attr("x", 0).attr("dy", "0.35em").text(name);
      }
    });
}

export function drawBilateralMap(mergedData, selectedPartner) {
  // Normalize selectedPartner into a Set for efficient lookups
  // If selectedParter is a bloc partner, populate set with corresponding array in global.js
  document.getElementById("mapLegend").style.display = "flex";
  if (!mergedData || !mergedData.features) {
    console.error("drawBilateralMap: no valid mergedData received");
    return;
  }
  projection = d3
    .geoMercator()
    .scale(600)
    .center([20, 5])
    .translate([W / 2, H / 2]);
  path = d3.geoPath().projection(projection);

  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  g = svg.append("g");

  // Get the selected country and its partners
  const africanPartnersSet =
    databases.bilateralPartnerMap.get(selectedPartner) || new Set();
  // ← add these two lines here, inside the function
  console.log("africanPartnersSet size:", africanPartnersSet.size);
  console.log("africanPartnersSet contents:", [...africanPartnersSet]);
  console.log("first feature name:", mergedData.features[0]?.properties.name);
  console.log("selectedPartner:", selectedPartner);

  // Define a color scale for the connect_partners values
  g.selectAll("path")
    .data(mergedData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      getBilateralFill(d.properties.name, selectedPartner, africanPartnersSet),
    )
    .attr("stroke", "#a7acb6")
    .attr("stroke-width", 1)
    .style("cursor", (d) =>
      africanPartnersSet.has(d.properties.name) ? "pointer" : "default",
    )
    .on("click", function (event, d) {
      const countryName = d.properties.name;

      // Only respond to clicks on African partner countries
      if (!africanPartnersSet.has(countryName)) return;
      console.log("Clicked African country:", countryName);

      // Visual feedback — highlight selected country, dim all countrie
      g.selectAll("path").attr("opacity", 0.15);
      labelGroups.selectAll("g.text").attr("opacity", 0.15);
      d3.select(this).attr("opacity", 1)
      d3.select(this).attr("stroke", "#51596f").attr("stroke-width", 1.5);

      // populateCountryCard needs onPartnerSelect to wire the breadcrumb correctly.
      // We pass it here rather than importing it inside cards.js to avoid
      // a circular import (cards.js ← layout.js ← drawMap.js ← cards.js)
      populateCountryCard(countryName, selectedPartner, onPartnerSelect);
    });
  // African country labels on bilateral map too
  // g.selectAll("text")
  //   .data(
  //     mergedData.features.filter((f) =>
  //       africanPartnersSet.has(f.properties.name),
  //     ),
  //   )
  //   //.data(mergedData.features)
  //   .enter()
  //   .append("text")
  //   .attr("transform", (d) => `translate(${path.centroid(d)})`)
  //   .attr("dy", ".35em")
  //   .attr("text-anchor", "middle")
  //   .attr("font-size", "9px")
  //   .attr("font-family", "UncutRegular, sans-serif")
  //   //.attr("pointer-events", "mouse")
  //   .attr("fill", (d) =>
  //     africanPartnersSet.has(d.properties.name) ? "#ffffff" : "#888884",
  //   )
  //   .attr("pointer-events", "none")
  //   .text((d) => d.properties.name);
  // Label + trend arrow group for each country
  const labelGroups = g
    .selectAll("g.country-label")
    .data(
      mergedData.features.filter(
        (
          f, // add filter here
        ) => africanPartnersSet.has(f.properties.name),
      ),
    )
    .enter()
    .append("g")
    .attr("class", "country-label")
    .attr("transform", (d) => {
      const name = d.properties.name;
      const config = countryLabelConfig[name] || {};
      const [cx, cy] = path.centroid(d);
      const dx = config.dx || 0;
      const dy = config.dy || 0;
      return `translate(${cx + dx}, ${cy + dy})`;
    })
    .attr("pointer-events", "none");

  // Country name — single or multi-line, always white on partner countries
  labelGroups.each(function (d) {
    const name = d.properties.name;
    const config = countryLabelConfig[name] || {};

    const textEl = d3
      .select(this)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "13px")
      .attr("font-family", "UncutRegular, sans-serif")
      .attr("fill", "#ffffff");

    if (config.lines) {
      config.lines.forEach((line, i) => {
        textEl
          .append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? "-0.4em" : "10px")
          .text(line);
      });
    } else {
      textEl.append("tspan").attr("x", 0).attr("dy", "-0.4em").text(name);
    }
  });

  // Trend arrow — only for partner countries
  labelGroups
    .filter((d) => africanPartnersSet.has(d.properties.name))
    .append("text")
    .attr("dy", (d) => {
    const config = countryLabelConfig[d.properties.name] || {};
    const lines = config.lines?.length || 1;
    return `${(lines - 1) * 10 + 10}px`;
  })
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .attr("font-family", "UncutRegular, sans-serif")
    .attr("fill", (d) => {
      const partnerData = databases.reshapedBiData[selectedPartner]?.find(
        (entry) => entry["African Country"] === d.properties.name,
      );
      const trend = partnerData?.["Economic and Investment Trend"];
      if (trend === "Increase") return "#ffffff"; 
      if (trend === "Decrease") return "#ffffff"; 
      if (trend === "Stable") return "#ffffff"; 
      return "transparent";
    })
    .text((d) => {
      const partnerData = databases.reshapedBiData[selectedPartner]?.find(
        (entry) => entry["African Country"] === d.properties.name,
      );
      const trend = partnerData?.["Economic and Investment Trend"];
      if (trend === "Increase") return "↑";
      if (trend === "Decrease") return "↓";
      if (trend === "Stable") return "—";
      return "";
    });
}

// --- Public: label controls ---
export function addCountryLabels(geoJSONData, labelGroup) {
  const countriesWithData = geoJSONData.features.filter(
    (feature) => feature.properties.connect_partners,
  );
  labelGroup.selectAll("text").remove();

  labelGroup
    .selectAll("text")
    .data(countriesWithData)
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#444441")
    .attr("pointer-events", "none") // labels don't block mouse events on paths
    .text((d) => d.properties.name);
}

export function deleteCountryLabels() {
  d3.selectAll("text").transition().duration(500).style("opacity", 0);
}

// ── Public: tooltip + highlight events (overview map only) ──
// Exported because navigation.js calls it after drawOverviewMap.
// In the bilateral map, clicks are handled directly in drawBilateralMap above.
export function highlightAndTooltipEvents(reshapedBiData, g, tooltip) {
  // currentAfricanPartnersData holds the African partners for whichever
  // non-African partner was most recently clicked on the overview map.
  // It's used by handleMouseOver to build rich tooltip content for African countries
  let currentAfricanPartnersData = [];

  function handleMouseOver(event, d) {
    const countryName = d.properties.name;
    applyHighlight(countryName, g);
  }

  function handleMouseOut() {
    g.selectAll("path")
      .attr("stroke", style.strokeDefaultColor)
      .attr("stroke-width", style.strokeDefaultWidth);
  }

  // Apply mouseover and mouseout logic to all countries
  g.selectAll("path")
    .on("mouseover", handleMouseOver)
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", handleMouseOut)
    .on("click", function (event, d) {
      const countryName = d.properties.name;

      // Resolve which partner was clicked (handling EU and GCC blocs).
      const partnerKey = resolvePartnerKey(countryName);
      if (!partnerKey) return; // click on non-partner country — do nothing

      // Update currentAfricanPartnersData so tooltip content is correct
      // for subsequent mouseovers after a partner is clicked.
      currentAfricanPartnersData = reshapedBiData[partnerKey] || [];

      // onPartnerSelect is the single entry point for partner selection:
      // it updates sidebar state, redraws the bilateral map, and fills the panel.
      onPartnerSelect(partnerKey);

      // Reapply hover handlers because drawBilateralMap (called inside
      // onPartnerSelect) re-creates all path elements, wiping their listeners.
      g.selectAll("path")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
    });
}

// --- Private: fill colour helpers ---
// Adjust viewbox for different ports
function getViewBox(el) {
  const w = el.clientWidth;
  // Phone
  if (w < 576) {
    svg.attr("preserveAspectRatio", "xMidYMin meet");
    return "-200 -225 700 900";
  }
  // Laptop
  if (w < 1024) {
    svg.attr("preserveAspectRatio", "xMidYMin meet");
    //return "-150 150 775 1000";
    return `-150 -25 925 600`;
  }
  //viewBox="-250 -125 1150 600"
  svg.attr("preserveAspectRatio", "xMidYMin meet");
  //return `0 0 ${el.clientWidth} ${el.clientHeight}`;
  // large screens
  return `-100 -105 1150 600`;
}

// On the bilateral map, African partner countries are coloured by connectivity level.
function getBilateralFill(countryName, selectedPartner, africanPartnersSet) {
  if (!africanPartnersSet.has(countryName)) {
    return mapDisplaySettings.colors.default;
  }

  const partnerData = databases.reshapedBiData[selectedPartner]?.find(
    (entry) => entry["African Country"] === countryName,
  );

  const connectivityLevel =
    partnerData?.[
      "Economic and Investment connectivity between African country and non-African partner"
    ] ?? "default";

  return connectivityColor[connectivityLevel] || connectivityColor.default;
}

// --- Private: highlight helper ---
function applyHighlight(countryName, g) {
  if (globals.EUCountries.has(countryName)) {
    g.selectAll("path")
      .filter((d) => globals.EUCountries.has(d.properties.name))
      .attr("stroke", style.strokeHighlightColor)
      .attr("stroke-width", style.strokeHighlightWidth);
  } else if (globals.GCCCountries.has(countryName)) {
    g.selectAll("path")
      .filter((d) => globals.GCCCountries.has(d.properties.name))
      .attr("stroke", style.strokeHighlightColor)
      .attr("stroke-width", style.strokeHighlightWidth);
  } else if (
    globals.africanPartners.has(countryName) ||
    countryName === "China"
  ) {
    d3.select(`path[data-name="${countryName}"]`)
      .attr("stroke", style.strokeHighlightColor)
      .attr("stroke-width", style.strokeHighlightWidth);
  }
}

// --- Private: partner resolution ---

// Maps a clicked country name to the partner key used in reshapedBiData
// EU and GCC are blocs — any member country click resolves to the bloc key
// Returns null if the clicked country is not a partner
function resolvePartnerKey(countryName) {
  if (globals.EUCountries.has(countryName)) return "European Union";
  if (globals.GCCCountries.has(countryName)) return "Gulf Countries";
  if (countryName === "China") return "China";
  return null;
}
