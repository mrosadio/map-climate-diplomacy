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

// ── SVG setup ──
// Created once at module load time. All drawing functions share this element.
// D3 is loaded as a global via <script> tag in HTML, not as an ES module import
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
  console.log("Data to draw:", geoJSONData);
  if (!geoJSONData || !geoJSONData.features) {
    console.error("drawOverviewMap: no valid geoJSONData received");
    return;
  }
  // Re-read dimensions in case container resized since module load
  const el = document.querySelector("#map");
  svg.attr("preserveAspectRatio", "xMidYMin meet");
  svg.attr("viewBox", getViewBox(el));
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  g = svg.append("g");

  g.selectAll("path")
    .data(geoJSONData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => {
      // All countries on this map are African partners.
      // Color by connectivity level if data exists, otherwise default.
      const level = d.properties["connect_partners"];
      return level
        ? mapDisplaySettings.connectivityColor[level]
        : mapDisplaySettings.colors.default;
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .style("cursor", "default");

  // African country labels — always visible on overview map.
  // pointer-events:none prevents labels intercepting mouse events on paths.
  g.selectAll("text")
    .data(geoJSONData.features)
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "9px")
    .attr("font-family", "UncutRegular, sans-serif")
    .attr("fill", "#444441")
    .attr("pointer-events", "none")
    .text((d) => d.properties.name);
}

export function drawBilateralMap(mergedData, selectedPartner) {
  // Normalize selectedPartner into a Set for efficient lookups
  // If selectedParter is a bloc partner, populate set with corresponding array in global.js
  if (!mergedData || !mergedData.features) {
    console.error("drawBilateralMap: no valid mergedData received");
    return;
  }

  // const settings = mapDisplaySettings[selectedPartner];
  // if (!settings) {
  //   console.error(
  //     `drawBilateralMap: no map settings found for "${selectedPartner}"`,
  //   );
  //   return;
  // }

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
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .style("cursor", (d) =>
      africanPartnersSet.has(d.properties.name) ? "pointer" : "default",
    )
    .on("click", function (event, d) {
      const countryName = d.properties.name;

      // Only respond to clicks on African partner countries
      if (!africanPartnersSet.has(countryName)) return;
      console.log("Clicked African country:", countryName);

      // Visual feedback — highlight selected country, dim all countrie
      g.selectAll("path").attr("opacity", 0.5);
      d3.select(this).attr("opacity", 1);

      // populateCountryCard needs onPartnerSelect to wire the breadcrumb correctly.
      // We pass it here rather than importing it inside cards.js to avoid
      // a circular import (cards.js ← layout.js ← drawMap.js ← cards.js)
      populateCountryCard(countryName, selectedPartner, onPartnerSelect);
    });
  // African country labels on bilateral map too
  g.selectAll("text")
    .data(
      mergedData.features.filter((f) =>
        africanPartnersSet.has(f.properties.name),
      ),
    )
    //.data(mergedData.features)
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "9px")
    .attr("font-family", "UncutRegular, sans-serif")
    //.attr("pointer-events", "mouse")
    .attr("fill", (d) =>
      africanPartnersSet.has(d.properties.name) ? "#ffffff" : "#888884",
    )
    .attr("pointer-events", "none")
    .text((d) => d.properties.name);
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
    .attr("font-size", "9px")
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
  // Tablet
  if (w < 1024) {
    svg.attr("preserveAspectRatio", "xMidYMin meet");
    return "-150 150 775 1000";
  }
  return `0 0 ${el.clientWidth} ${el.clientHeight}`;
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
