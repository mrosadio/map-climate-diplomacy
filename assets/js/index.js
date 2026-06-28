import { initializeDatabases } from "./modules/dataManager.js";
import { showAfricaOverview } from "./modules/navigation.js";
import { initLayout, resetLayout } from "./modules/layout.js";
import { zoomIn, zoomOut } from "./modules/setUpControls.js";
import { renderOverviewPanel } from "./modules/cards.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize databases
    await initializeDatabases();

    // Render Africa Overview map by default
    await showAfricaOverview();

    renderOverviewPanel();
    initLayout();

    // Africa overview button — redraws the default map
    document
      .getElementById("africaButton")
      ?.addEventListener("click", () => {
        showAfricaOverview();
        renderOverviewPanel();
    });

    // Reset button — clears partner selection and returns panel to empty state
    document
      .getElementById("resetButton")
      ?.addEventListener("click", resetLayout);
  } catch (error) {
    console.error("Error loading data or initializing visualizations:", error);
  }
});
