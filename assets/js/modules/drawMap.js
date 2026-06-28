// Responsible for: SVG setup, drawing map paths, tooltips, hover/click events.
// Two public drawing functions:
//   drawOverviewMap    → default world view, all partner countries same colour
//   drawBilateralMap   → partner selected, African countries coloured by connectivity
// Supporting exports: addCountryLabels, deleteCountryLabels, highlightAndTooltipEvents

import globals from "./globals.js";
import { populateCountryCard } from "./cards.js";
import { getCurrentPartner, onPartnerSelect } from "./layout.js";
const {
  svgWidth,
  svgHeight,
  mainViewBox,
  legend,
  mapDisplaySettings,
  databases,
  cooperation,
} = globals;

const style = mapDisplaySettings.style;
const connectivityColor = mapDisplaySettings.connectivityColor;

// ── SVG setup ──
// Created once at module load time. All drawing functions share this element.
// D3 is loaded as a global via <script> tag in HTML, not as an ES module import
let svg = d3
  .select("#map")
  .append("svg")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("height", "100%")
  .attr("width", "100%");

// projection and path are module-level so updateProjection() can reassign them
// and addCountryLabels() can read the current path for centroid calculations.
let projection = d3
  .geoMercator()
  .scale(400)
  .translate([svgWidth / 2, svgHeight / 2]);
let path = d3.geoPath().projection(projection);
let g;

// --- Public: drawing function ---
export function drawOverviewMap(geoJSONData, reshapedBiData) {
  console.log("Data to draw:", geoJSONData);
  if (!geoJSONData || !geoJSONData.features) {
    console.error("No merged data available or invalid format");
    return;
  }
  const mapEl = document.querySelector("#map");
  svg.attr("viewBox", `0 0 ${mapEl.clientWidth} ${mapEl.clientHeight}`);
  svg.selectAll("path").remove();
  g = svg.append("g");

  // getOrCreateTooltip ensures we don't append a new tooltip div
  // every time drawOverviewMap is called (e.g. when user hits Africa Overview button)
  const tooltip = getOrCreateTooltip();

  // Define a color scale for the connect_partners values
  const colorScale = d3
    .scaleOrdinal()
    .domain(["Low", "Moderate", "High"])
    .range(legend.colorRange);

  g.selectAll("path")
    .data(geoJSONData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => getOverviewFill(d.properties.name));

  highlightAndTooltipEvents(reshapedBiData, g, tooltip);
}

export function drawBilateralMap(mergedData, selectedPartner) {
  // Normalize selectedPartner into a Set for efficient lookups
  // If selectedParter is a bloc partner, populate set with corresponding array in global.js
  if (!mergedData || !mergedData.features) {
    console.error("drawBilateralMap: no valid mergedData received");
    return;
  }

  const settings = mapDisplaySettings[selectedPartner];
  if (!settings) {
    console.error(
      `drawBilateralMap: no map settings found for "${selectedPartner}"`,
    );
    return;
  }

  updateProjection(settings.scale, settings.center, settings.translation);
  svg.selectAll("path").remove();
  g = svg.append("g");

  // Get the selected country and its partners
  const africanPartnersSet =
    databases.bilateralPartnerMap.get(selectedPartner) || new Set();
  console.log("African partner set:", africanPartnersSet);

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
    .attr("transform", (d) => `translate(${centroid})`)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "black")
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
    const content = buildTooltipContent(
      countryName,
      currentAfricanPartnersData,
    );

    // Only display the tooltip if the content is not empty
    if (content.trim() !== "") {
      tooltip
        .style("display", "block")
        .html(content)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    }
    applyHighlight(countryName, g);
  }

  function handleMouseOut() {
    tooltip.style("display", "none");
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

// --- Private: projection ---

function updateProjection(scale, center, translation) {
  projection = d3
    .geoNaturalEarth1()
    .scale(scale)
    .center(center)
    .translate(translation);
  path = d3.geoPath().projection(projection);
  svg.selectAll("path").attr("d", path);
}

// --- Private: fill colour helpers ---

// On the overview map all partner countries share one colour.
// The distinction between EU/GCC/China/African doesn't matter visually here —
// all four branches return the same value. The if/else is kept for clarity
// in case per-bloc colours are added later.
function getOverviewFill(countryName) {
  if (
    globals.EUCountries.has(countryName) ||
    globals.GCCCountries.has(countryName) ||
    countryName === "China" ||
    globals.africanPartners.has(countryName)
  ) {
    return mapDisplaySettings.colors.nonAfricaPartner;
  }
  return mapDisplaySettings.colors.default;
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

// --- Private: tooltip helpers ---

// Returns the singleton tooltip div, creating it only if it doesn't exist yet.
// Prevents duplicate tooltip divs when drawOverviewMap is called multiple times.
function getOrCreateTooltip() {
  const existing = d3.select(".tooltip2");
  if (!existing.empty()) return existing;

  return d3
    .select("body")
    .append("div")
    .attr("class", "tooltip2")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "10px")
    .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)")
    .style("display", "none")
    .style("pointer-events", "none");
}

function buildTooltipContent(countryName, currentAfricanPartnersData) {
  if (globals.EUCountries.has(countryName)) return "European Union (EU)";
  if (globals.GCCCountries.has(countryName))
    return "Gulf Cooperation Council (GCC)";
  if (countryName === "China") return "China";

  if (!globals.africanPartners.has(countryName)) return "";

  const partnerData = currentAfricanPartnersData.find(
    (p) => p["African Country"] === countryName,
  );

  if (!partnerData) {
    return `<p class="fw-bold tooltipTitle mx-0">${countryName}</p>`;
  }

  const connectivityLevel =
    partnerData[
      "Economic and Investment connectivity between African country and non-African partner"
    ] || "No data";

  let content = `
    <p class="fw-bold tooltipTitle mb-0">${countryName}</p>
    <p class="tooltipText mb-0">Connectivity Level:</p>
    <p class="tooltipText">${connectivityLevel}</p>
  `;

  if (partnerData["Areas of Cooperation - Categories"] !== "No data") {
    content += `<p class="tooltipText">Areas of cooperation:</p>`;
    partnerData["Areas of Cooperation - Categories"].forEach((category) => {
      const iconPath = `/assets/img/icons/${category.toLowerCase().replace(/ /g, "-")}.svg`;
      content += `
        <p class="btn btn-outline-dark aresCoop me-1 tooltipText d-flex align-items-center"
           style="background: ${cooperation.color[category]}">
          <img src="${iconPath}" alt="${category} Icon" style="width:16px;height:16px;margin-right:5px;">
          ${category}
        </p><br>`;
    });
  }

  return content;
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
