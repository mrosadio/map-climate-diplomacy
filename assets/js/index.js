import { initializeDatabases } from "./modules/dataManager.js";
import { showAfricaOverview } from "./modules/navigation.js";
import { initLayout, resetLayout } from "./modules/layout.js";
import { zoomIn, zoomOut } from "./modules/setUpControls.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize databases
    await initializeDatabases();

    // Render Africa Overview map by default
    await showAfricaOverview();

    // Show Bilateral partnership
    initLayout();

    // Show comparative advantage
    //showComparative();

    // Zoom controls
    document.getElementById("zoomIn")?.addEventListener("click", zoomIn);
    document.getElementById("zoomOut")?.addEventListener("click", zoomOut);

    // Africa overview button — redraws the default map
    document
      .getElementById("africaButton")
      ?.addEventListener("click", showAfricaOverview);

    // Reset button — clears partner selection and returns panel to empty state
    document
      .getElementById("resetButton")
      ?.addEventListener("click", resetLayout);
  } catch (error) {
    console.error("Error loading data or initializing visualizations:", error);
  }
});
