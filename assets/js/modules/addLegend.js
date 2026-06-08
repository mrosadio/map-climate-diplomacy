import globals from "./globals.js";

export function addLegend(data) {
    const { legend } = globals;

    const partnerDiv = document.querySelector(".card");
    partnerDiv.innerHTML = "";

    let colorScale = d3
        .scaleQuantize()
        .domain([0, d3.max(data, (d) => d.connect_partners)])
        .range(legend.colorRange);

    const legendContainer = d3.select(".third-col .card.partnership");
    legendContainer
        .append("h4")
        .attr("class", "legendTitle")
        .style("text-align", legend.textAlign)
        .style("margin", legend.margin)
        .style("font-weight", legend.fontWeight)
        .style("font-size", legend.fontSize)
        .style("margin-bottom", legend.fontSize)
        .style("padding-bottom", legend.paddingBottom)
        .style("border-bottom", legend.borderBottom)
        .style("width", legend.width)
        .text(legend.text);

    const legendInnerDiv = legendContainer
        .append("div")
        .attr("class", "legendVertical")
        .style("display", "flex")
        .style("flex-direction", legend.flexDirection)
        .style("justify-content", legend.justifyContent)
        .style("text-align", legend.textAlign)
        .style("align-items", legend.alignItems)
        .style("gap", legend.gap);

    colorScale.range().forEach((d, i) => {
        //if (i > 0) {
        let legendItem = legendInnerDiv
            .append("div")
            .attr("class", "legend-item")
            .style("display", legend.itemDisplay)
            .style("margin", legend.itemMargin)
            .style("align-items", legend.itemAlignItems)

        legendItem
            .append("div")
            .style("width", legend.itemWidth)
            .style("height", legend.itemHeight)
            .style("background-color", colorScale.range()[i])
            .style("margin-right", legend.itemMarginRight);
        //legendItem.shift();

        legendItem
            .append("span")
            .text(numberToWord(i))
            .style("font-size", legend.itemFontSize)

    });
    // Add title above the buttons
    legendContainer
        .append("h4")
        .attr("class", "legendTitle")
        .style("margin-top", "40px")
        .style("font-weight", legend.fontWeight)
        .style("font-size", legend.fontSize)
        .style("text-align", legend.textAlign)
        .text("Economic and Investment Trend");
    // Add buttons below the legend items
    const buttonContainer = legendContainer
        .append("div")
        .attr("class", "legend-buttons mt-3 d-flex flex-column align-items-start");

    // Add "Increase" button
    buttonContainer
        .append("button")
        .attr("class", "btn btn-success btn-sm mb-2 d-flex align-items-center justify-content-between")
        .style("width", "95px") // Ensure buttons do not stretch
        .html('<span>Increase </span> &nbsp<img src="/assets/img/icons/arrow-up.svg" alt="Arrow Up" style="width: 12px; height: 12px;">');

    // Add "Decrease" button
    buttonContainer
        .append("button")
        .attr("class", "btn btn-danger btn-sm mb-2 d-flex align-items-center justify-content-between")
        .style("width", "95px") // Ensure buttons do not stretch
        .html('<span>Decrease </span> &nbsp<img src="/assets/img/icons/arrow-down.svg" alt="Arrow Down" style="width: 12px; height: 12px;">');

    // Add "Stable" button
    buttonContainer
        .append("button")
        .attr("class", "btn btn-secondary btn-sm d-flex align-items-center justify-content-between")
        .style("width", "95px") // Ensure buttons do not stretch
        .html('<span>Stable</span> &nbsp<img src="/assets/img/icons/minus.svg" alt="Arrow Right" style="width: 12px; height: 12px;">');}

// Mapeo de números a palabras
const numberToWord = (num) => {
    const words = {
        0: "Low",
        1: "Moderate",
        2: "High",
        // Agrega más números si es necesario
    };
    return words[num] || num; // Devuelve el número si no está en el mapeo
};

export function showLegend() {
    d3.select(".legend").style("display", "block");
}

export function hideLegend() {
    d3.select(".legend").style("display", "none");
}