import globals from "./globals.js";
import { populateLegend } from "./populatePartnerCard.js";
const { svgWidth, svgHeight, mainViewBox, legend, mapDisplaySettings, databases, cooperation } = globals;

const style = mapDisplaySettings.style;
const reshapedData = databases.reshapedBiData;
const connectivityColor = mapDisplaySettings.connectivityColor;

console.log('Reshaped data:', reshapedData); // has to be inside a function to avoid being undefined
let svg = d3
    .select("#map")
    .append("svg")
    .attr("viewBox", `100 0 ${svgWidth} ${svgHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("height", "100%")
    .attr("width", "100%");
let projection = d3
    .geoMercator()
    .scale(400)
    .translate([svgWidth / 2, svgHeight / 2]);
let path = d3.geoPath().projection(projection);
let g;

export function drawOverviewMap(geoJSONData, reshapedBiData) {
    console.log('Data to draw:', geoJSONData);
    if (!geoJSONData || !geoJSONData.features) {
        console.error("No merged data available or invalid format");
        return;
    }
    svg.attr("viewBox", `${mainViewBox}`);
    g = svg.append("g");
    svg.selectAll("path").remove();

    // Create tooltip
    const tooltip = createMapTooltip();

    // Define a color scale for the connect_partners values
    const colorScale = d3.scaleOrdinal()
        .domain(["Low", "Moderate", "High"])
        .range(legend.colorRange);

    g.selectAll("path")
        .data(geoJSONData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d) => {
            const countryName = d.properties.name;
            //console.log('African partners', globals.africanPartners);
            // Fill EU and GCC bloc countries
            if (globals.EUCountries.has(countryName)) {
                return mapDisplaySettings.colors.nonAfricaPartner; // on the default view, african and nonafrican partners are colored the same 
            } else if (globals.GCCCountries.has(countryName)) {
                return mapDisplaySettings.colors.nonAfricaPartner;
            } else if (countryName == "China") {
                return mapDisplaySettings.colors.nonAfricaPartner;
            } else if (globals.africanPartners.has(countryName)) {
                /* Condition not longer necessary since we want to color the map on the default view
                const connectivityLevel = d.properties["Economic and Investment connectivity between African country and non-African partner"];
                if (!connectivityLevel) {
                    return mapDisplaySettings.colors.nonAfricaPartner; // Default color for missing data
                } 
                */
                return mapDisplaySettings.colors.nonAfricaPartner

            } else {
                return mapDisplaySettings.colors.default; // Default color for other countries
            }
        })
        .attr("stroke", style.strokeDefaultColor)
        .attr("stroke-width", style.strokeDefaultWidth);

    highlightAndTooltipEvents(reshapedBiData, g, tooltip)

}

export function drawBilateralMap(mergedData, selectedPartner) {
    // Normalize selectedPartner into a Set for efficient lookups
    // If selectedParter is a bloc partner, populate set with corresponding array in global.js
    console.log("selectedPartner received:", selectedPartner);
    console.log("settings found:", mapDisplaySettings[selectedPartner]);
    //console.log("partnerMap found:", partnerMap.get(selectedPartner));
    const selectedCountriesSet = selectedPartner === "European Union"
        ? new Set(globals.EUCountries) // Populate with EU countries if selectedPartner is "EU"
        : selectedPartner === "Gulf Countries"
            ? new Set(globals.GCCCountries) // Populate with GCC countries if selectedPartner is "GCC"
            : Array.isArray(selectedPartner)
                ? new Set(selectedPartner) // Convert array to Set
                : new Set([selectedPartner]); // Single country as Set
    console.log('Selected countries Set:', selectedCountriesSet);

    // Import group data to use in filter function and other style globals
    const partnerMap = databases.bilateralPartnerMap;
    console.log('Partner Map', partnerMap)
    const settings = mapDisplaySettings[selectedPartner];
    const colorMap = mapDisplaySettings.colors;
    const connectivityColor = mapDisplaySettings.connectivityColor;
    if (!settings) {
        console.error(`No map display settings found for ${selectedPartner}`);
        return;
    }
    // Adjust projection according to the selected country
    updateProjection(settings.scale, settings.center, settings.translation);
    if (!mergedData || !mergedData.features) {
        console.error("No merged data available or invalid format");
        return;
    }
    console.log('Grouped data to draw:', mergedData);

    // Get the selected country and its partners
    const africanPartnersSet = partnerMap.get(selectedPartner) || new Set();
    console.log('African partner set:', africanPartnersSet);
    //svg.attr("viewBox", `${mainViewBox}`);
    g = svg.append("g");
    svg.selectAll("path").remove();

    // Define a color scale for the connect_partners values
    g.selectAll("path")
        .data(mergedData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            if (africanPartnersSet.has(d.properties.name)) {
                const partnerData = databases.reshapedBiData[selectedPartner].find(
                    partner => partner["African Country"] === d.properties.name
                );
                if (partnerData) {
                    const connectivityLevel = partnerData["Economic and Investment connectivity between African country and non-African partner"];
                    return connectivityColor[connectivityLevel] || connectivityColor.default;
                }
                return connectivityColor.default;
            } else {
                if (["Senegal", "South Africa"].includes(d.properties.name)) {
                    console.log("Not matched:", d.properties.name);
                }
                return colorMap.default;
            }
        })
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
}

function updateProjection(scale, center, translation) {
    projection = d3
        .geoNaturalEarth1()
        .scale(scale)
        .center(center)
        .translate(translation);
    path = d3.geoPath().projection(projection);
    svg.selectAll("path").attr("d", path);
}

export function addCountryLabels(geoJSONData, labelGroup) {
    //d3.selectAll("text").transition().duration(500).style("opacity", 1); // Ocultar las etiquetas
    //isCountryLabelsVisible = true;
    const countriesConnectivity = geoJSONData.features.filter((feature) => {
        return feature.properties.connect_partners;
    });
    labelGroup.selectAll("text").remove();

    labelGroup.selectAll("text")
        .data(countriesConnectivity)
        .enter()
        .append("text")
        .attr("transform", (d) => {
            const centroid = path.centroid(d);
            return `translate(${centroid})`;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .text((d) => d.properties.name);
}

export function deleteCountryLabels() {
    //isCountryLabelsVisible = false;
    d3.selectAll("text").transition().duration(500).style("opacity", 0);
    // d3.selectAll("image").transition().duration(500).style("opacity", 0); // Make icons invisible
}

function createMapTooltip() {
    let tooltip = d3
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
        .style("pointer-events", "none"); // Prevent tooltip from interfering with mouse events

    return tooltip;
}

/****************************************************************************+******* 
Combine the logic for both the tooltip and the highlight functionality 
into a single mouseover event listener. This ensures that both the tooltip 
and the highlighting behavior work together without conflicts.

- EventListeners: ensure that both African and non-African countries retain 
their respective mouseover and mouseout logic after clicking on a non-African partner.

*************************************************************************+*******/



export function highlightAndTooltipEvents(reshapedBiData, g, tooltip) {
    console.log('Reshaped bi data for tooltip:', reshapedBiData);
    let currentAfricanPartnersData = []; // Store the African partners data for the clicked non-African partner

    /* Function to handle mouseover for all countries */
    function handleMouseOver(event, d) {
        const countryName = d.properties.name;
        let tooltipContent = "";
        if (globals.EUCountries.has(countryName)) {
            tooltipContent = "European Union (EU)";
        } else if (globals.GCCCountries.has(countryName)) {
            tooltipContent = "Gulf Cooperation Council (GCC)";
        } else if (countryName === "China") {
            tooltipContent = "China";
        } else if (globals.africanPartners.has(countryName)) {
            // Check if African partner data exists in the current context
            const partnerData = currentAfricanPartnersData.find(
                (partner) => partner["African Country"] === countryName
            );

            if (partnerData) {
                console.log('Partner data:', partnerData);
                const connectivityLevel =
                    partnerData["Economic and Investment connectivity between African country and non-African partner"] || "No data";
                tooltipContent = `<p class="fw-bold tooltipTitle mb-0">${countryName}</p>
                                  <p class="tooltipText mb-0">Connectivity Level:</p>
                                  <p class="tooltipText">${connectivityLevel}</p>`;

                if (partnerData["Areas of Cooperation - Categories"] !== "No data") {
                    tooltipContent += `<p class="tooltipText">Areas of cooperation:</p>`;
                    partnerData["Areas of Cooperation - Categories"].forEach((category) => {
                        const iconPath = `/assets/img/icons/${category.toLowerCase().replace(/ /g, "-")}.svg`; // Generate icon path dynamically
                        tooltipContent += `<p class="btn btn-outline-dark aresCoop me-1 tooltipText d-flex align-items-center" 
                                             style="background: ${cooperation.color[category]}; border-box: 0">
                                            <img src="${iconPath}" alt="${category} Icon" style="width: 16px; height: 16px; margin-right: 5px;">
                                             ${category}
                                        </p><br>`;
                    });
                }
            } else {
                tooltipContent = `<p class="fw-bold tooltipTitle mx-0">${countryName}</p>`;
            }
        }
        // Only display the tooltip if the content is not empty
        if (tooltipContent.trim() !== "") {
            tooltip
                .style("display", "block")
                .html(`${tooltipContent}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        }

        // Highlight logic
        if (globals.EUCountries.has(countryName)) { // Highlight all EU countries
            g.selectAll("path")
                .filter((d) => globals.EUCountries.has(d.properties.name))
                .attr("stroke", style.strokeHighlightColor)
                .attr("stroke-width", style.strokeHighlightWidth);
        } else if (globals.GCCCountries.has(countryName)) { // Highlight all GCC countries
            g.selectAll("path")
                .filter((d) => globals.GCCCountries.has(d.properties.name))
                .attr("stroke", style.strokeHighlightColor)
                .attr("stroke-width", style.strokeHighlightWidth);
        } else if (globals.africanPartners.has(countryName) || countryName == "China") { // Highlight individual African countries
            d3.select(this)
                .attr("stroke", style.strokeHighlightColor)
                .attr("stroke-width", style.strokeHighlightWidth);
        }
    }
    function handleMouseOut() {
        tooltip.style("display", "none");

        // Reset styles
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
            let selectedPartner = null;
            // Check if the clicked country belongs to a bloc
            if (globals.EUCountries.has(countryName)) {
                currentAfricanPartnersData = reshapedBiData["EU"] || [];
                selectedPartner = "EU";
            } else if (globals.GCCCountries.has(countryName)) {
                currentAfricanPartnersData = reshapedBiData["GCC"] || [];
                selectedPartner = "GCC";
            } else if (countryName === "China") {
                currentAfricanPartnersData = reshapedBiData["China"] || [];
                selectedPartner = "China";
            } else {
                currentAfricanPartnersData = [];
            }
            // Populate the right column with African partner data
            populateLegend(selectedPartner, currentAfricanPartnersData);
            // Change the color of the African partners based on connectivity level
            g.selectAll("path")
                .filter((d) => {
                    return currentAfricanPartnersData.some(
                        (partner) => partner["African Country"] === d.properties.name
                    );
                })
                .attr("fill", (d) => {
                    const partnerData = currentAfricanPartnersData.find(
                        (partner) => partner["African Country"] === d.properties.name
                    );
                    const connectivityLevel = partnerData
                        ? partnerData["Economic and Investment connectivity between African country and non-African partner"]
                        : "default";
                    return connectivityColor[connectivityLevel] || connectivityColor.default;
                });

            // Reapply mouseover and mouseout logic to ensure both African and non-African countries are interactive
            g.selectAll("path")
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);
        });
}