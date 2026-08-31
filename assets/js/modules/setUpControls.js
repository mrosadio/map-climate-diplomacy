import { addCountryLabels, deleteCountryLabels } from "./drawMap.js";
import globals from "./globals.js";

const { databases } = globals;
// Initialize zoom behavior
const svg = d3.select("svg");
const zoomGroup = svg.append("g"); // Append a <g> element to the <svg>
const mapGroup = zoomGroup.append("g"); // <g> element for map paths
const labelGroup = zoomGroup.append("g"); // <g> element for labels
const zoom = d3.zoom().on("zoom", (event) => {
  zoomGroup.attr("transform", event.transform); // Apply zoom transformation to the parent <g> element
});

// Apply zoom behavior to the SVG
svg.call(zoom);

// Pick toggle button
export function setupControls(data) {
  //console.log('Data in setupControls:', data);
  const toggleButton = document.getElementById("toggleLabels");
  if (!toggleButton) {
    //console.error("Toggle button not found in the DOM!");
    return;
  }

  // Replace the button with a clone to remove existing listeners
  const newToggleButton = toggleButton.cloneNode(true);
  toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

  // Add a new event listener
  newToggleButton.addEventListener("click", function () {
    //console.log("Toggle button clicked");
    this.classList.toggle("active");
    const showLabels = this.classList.contains("active");
    if (showLabels) {
      addCountryLabels(data, labelGroup);
    } else {
      deleteCountryLabels(data);
    }
  });
}

export function zoomIn() {
  //console.log("Zooming In");
  svg.transition().duration(500).call(zoom.scaleBy, 1.5); // Incrementa el nivel de zoom
}

// Función para hacer zoom out
export function zoomOut() {
  svg.transition().duration(500).call(zoom.scaleBy, 0.75); // Reduce el nivel de zoom
}
