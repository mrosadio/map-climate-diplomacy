// drawMap.js
// Responsible for: SVG setup, drawing map paths, tooltips, hover/click events.
// Public functions:
//   drawOverviewMap    -> default world view, all partner countries same colour
//                        + African country labels always visible
//   drawBilateralMap   -> partner selected, African countries coloured by connectivity

import globals from "./globals.js";
import { populateCountryCard } from "./cards.js";
import { onPartnerSelect } from "./layout.js";
const { mapDisplaySettings, databases, trendConfig } = globals;

const style = mapDisplaySettings.style;
const connectivityColor = mapDisplaySettings.connectivityColor;
const countryLabelConfig = {
  Senegal: { dy: -4, iconDy: -6 },
  "Democratic Republic of the Congo": {
    lines: ["Dem. Rep.", "of the Congo"],
    dy: -8,
  },
  Morocco: { dy: -18, dx: 20 },
  "Republic of the Congo": {
    lines: ["Rep. of the", "Congo"],
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
  Benin: {
    dy: -6,
  },
  Ghana: {
    dy: 6,
  },
  Liberia: {
    dx: -22,
  },
  Zambia: {
    dy: 10,
    dx: -10,
  },
};
// -- SVG setup --
// Created once at module load time
const W = 800;
const H = 500;

let svg = d3.select("#map").append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet").attr("height", "100%").attr("width", "100%");

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
  document.getElementById("map").classList.add("is-overview");
  //console.log("Data to draw:", geoJSONData);
  if (!geoJSONData || !geoJSONData.features) {
    console.error("drawOverviewMap: no valid geoJSONData received");
    return;
  }
  const el = document.querySelector("#map");
  // Keep only features whose geometry projects to real numbers
  const drawable = geoJSONData.features.filter((d) => {
    const [cx, cy] = path.centroid(d);
    return Number.isFinite(cx) && Number.isFinite(cy); // drop features with broken geometry
  });
  //svg.attr("preserveAspectRatio", "xMidYMin meet");
  svg.attr("viewBox", getViewBox(el, drawable));
  svg.selectAll("g").remove(); // clears the old paths, labels and trend icons
  g = svg.append("g");

  g.selectAll("path")
    .data(drawable)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => {
      // All countries on this map are African partners.
      const level = d.properties["connect_partners"];
      return level ? mapDisplaySettings.connectivityColor[level] : mapDisplaySettings.colors.default;
    })
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1)
    .style("cursor", "default");

  // country labels always visible on overview map only
  // pointer-events:none prevents labels intercepting mouse events on paths
  // Country labels with per-country position and line-break overrides
  g.selectAll("g.country-label")
    .data(drawable)
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

      const textEl = d3.select(this).append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-family", "UncutRegular, sans-serif")
      .attr("fill", "#444441")
      .attr("stroke", mapDisplaySettings.colors.default)
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .style("paint-order", "stroke");

      if (config.lines) {
        config.lines.forEach((line, i) => {
          textEl
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? `0` : "1.1em")
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
  document.getElementById("map").classList.remove("is-overview");
  alignLegend();
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
  const africanPartnersSet = databases.bilateralPartnerMap.get(selectedPartner) || new Set();

  // Named so click and keydown can share the exact same logic
  function activateCountry(event, d) {
    const countryName = d.properties.name;
    if (!africanPartnersSet.has(countryName)) return;
    g.selectAll("path").attr("opacity", 0.15);
    labelGroups.attr("opacity", 0.15);
    d3.select(this).attr("opacity", 1);
    d3.select(this).attr("stroke", "#51596f").attr("stroke-width", 1.5);
    labelGroups.filter((l) => l.properties.name === countryName).attr("opacity", 1);
    populateCountryCard(countryName, selectedPartner, onPartnerSelect);
  }
  // Define a color scale for the connect_partners values
  g.selectAll("path")
    .data(mergedData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => getBilateralFill(d.properties.name, selectedPartner, africanPartnersSet))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1)
    .style("cursor", (d) => (africanPartnersSet.has(d.properties.name) ? "pointer" : "default"))
    .attr("tabindex", (d) => (africanPartnersSet.has(d.properties.name) ? 0 : null))
    .attr("role", (d) => (africanPartnersSet.has(d.properties.name) ? "button" : null))
    .attr("aria-label", (d) => d.properties.name)
    .on("click", activateCountry)
    .on("keydown", function (event, d) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateCountry.call(this, event, d);
      }
    });
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

    const textEl = d3.select(this).append("text")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("font-family", "UncutRegular, sans-serif")
    .attr("fill", isDarkFill(name, selectedPartner) ? "#ffffff" : "#1c2b1e")

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

  // --- Set trend arrows (for partner countries only) ---
  function getTrendConfig(d) {
    const partnerData = databases.reshapedBiData[selectedPartner]?.find((entry) => entry["African Country"] === d.properties.name);
    return trendConfig[partnerData?.["Economic and Investment Trend"]] || null;
  }
  labelGroups
    .filter((d) => getTrendConfig(d) !== null)
    .append("image")
    .attr("class", "trend-arrow-icon")
    .attr("width", 14)
    .attr("height", 14)
    .attr("x", (d) => {
      const config = countryLabelConfig[d.properties.name] || {};
      return -7 + (config.iconDx || 0);
    }) // image x/y is top-left, so this centers it under the label
    .attr("y", (d) => {
      const config = countryLabelConfig[d.properties.name] || {};
      const lines = config.lines?.length || 1;
      return (lines - 1) * 10 + 2 + (config.iconDy || 0);
    })
    .attr("href", (d) => `./assets/img/icons/${getTrendConfig(d).src}`)
    .style("filter", (d) => (isDarkFill(d.properties.name, selectedPartner) ? "brightness(0) invert(1)" : "brightness(0)"));
}

// --- Public: label controls ---
export function addCountryLabels(geoJSONData, labelGroup) {
  const countriesWithData = geoJSONData.features.filter((feature) => feature.properties.connect_partners);
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

// Same condition as the stacked-layout media query in vis-layout.css
const STACKED_QUERY = "(max-width: 991.98px), (max-width: 1199.98px) and (orientation: portrait)";
// viewBox that hugs the drawn continent, so it is never cropped whatever the box size
// Remote islands are drawn but left out of the fit, so the continent stays large
const FAR_ISLANDS = new Set(["Mauritius", "Seychelles"]);
function fitViewBox(features, pad = 12) {
  const [[x0, y0], [x1, y1]] = path.bounds({ type: "FeatureCollection", features });
  return `${x0 - pad} ${y0 - pad} ${x1 - x0 + 2 * pad} ${y1 - y0 + 2 * pad}`;
}

// --- Private: fill colour helpers ---
// Adjust viewbox for different ports
function getViewBox(el, features) {
  svg.attr("preserveAspectRatio", "xMidYMid meet");
  return fitViewBox(features.filter((d) => !FAR_ISLANDS.has(d.properties.name)));
}

// White only works on the dark High green (10:1). On Low (1.7:1) and Moderate (2.5:1)
// it is hard to read, so those fills get dark ink.
function isDarkFill(countryName, selectedPartner) {
  const partnerData = databases.reshapedBiData[selectedPartner]?.find((entry) => entry["African Country"] === countryName);
  return partnerData?.["Economic and Investment connectivity between African country and non-African partner"] === "High";
}
// Desktop / landscape tablet: sit the legend beside the partner list, with its title line and first
// heading line level with the two lines of the "Gulf Countries" label. The legend is anchored to the
// bottom and the label to the top, so this has to be measured; it re-runs on resize.
const ROW_LAYOUT_QUERY = "(min-width: 1200px), (min-width: 992px) and (orientation: landscape)";
function alignLegend() {
  const legend = document.getElementById("mapLegend");
  const map = document.getElementById("map");
  const label = document.querySelector('.vis-sidebar [data-slug="GulfCooperationCouncil"] .label');
  const title = legend?.querySelector(".vis-map__legend-title");
  if (!legend || !map || !label || !title) return;

  const floating = getComputedStyle(legend).position === "absolute" && window.matchMedia(ROW_LAYOUT_QUERY).matches;
  if (!floating || getComputedStyle(legend).display === "none") {
    legend.style.removeProperty("top");
    legend.style.removeProperty("bottom");
    return;
  }
  legend.style.setProperty("--pitch", getComputedStyle(label).lineHeight); // same line spacing as the label
  const range = document.createRange();
  range.selectNodeContents(label);
  const firstLine = range.getClientRects()[0];
  if (!firstLine) return;

  legend.style.setProperty("bottom", "auto", "important");
  legend.style.setProperty("top", "0px", "important"); // measure from a known position
  const legendBox = legend.getBoundingClientRect();
  const titleBox = title.getBoundingClientRect();
  const titleOffset = (titleBox.top + titleBox.bottom) / 2 - legendBox.top; // card's top edge to the middle of its title
  const lineCenter = (firstLine.top + firstLine.bottom) / 2;
  const wanted = lineCenter - map.getBoundingClientRect().top - titleOffset;
  const lowest = map.clientHeight - legendBox.height - 8; // never push the card past the bottom edge
  legend.style.setProperty("top", `${Math.max(0, Math.min(wanted, lowest))}px`, "important");
}
window.addEventListener("resize", alignLegend);
document.fonts?.ready.then(alignLegend); // the label's size can change once the font has loaded
// On the bilateral map, African partner countries are coloured by connectivity level.
function getBilateralFill(countryName, selectedPartner, africanPartnersSet) {
  if (!africanPartnersSet.has(countryName)) {
    return mapDisplaySettings.colors.default;
  }
  const partnerData = databases.reshapedBiData[selectedPartner]?.find((entry) => entry["African Country"] === countryName);
  const connectivityLevel = partnerData?.["Economic and Investment connectivity between African country and non-African partner"] ?? "default";

  return connectivityColor[connectivityLevel] || connectivityColor.default;
}