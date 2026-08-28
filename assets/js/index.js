import { initializeDatabases } from "./modules/dataManager.js";
import { showAfricaOverview } from "./modules/navigation.js";
import { initLayout, resetPartnerSelection } from "./modules/layout.js";
import { renderOverviewPanel } from "./modules/cards.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initializeDatabases();
    await showAfricaOverview();
    initLayout(); // <- must come first .sets up the zone structure
    renderOverviewPanel(); // <- must come after. fills it with content

    // Africa overview button — redraws the default map
    document.getElementById("africaButton")?.addEventListener("click", () => {
      resetPartnerSelection();
      showAfricaOverview();
      renderOverviewPanel();
    });
  } catch (error) {
    console.error("Error loading data or initializing visualizations:", error);
  }
});
