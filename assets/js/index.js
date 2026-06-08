import { initializeDatabases } from './modules/dataManager.js';
import { showAfricaOverview, showBilateral, showComparative } from './modules/navigation.js';
import { zoomIn, zoomOut } from './modules/setUpControls.js';
import globals from './modules/globals.js';

const { databases } = globals;
document.addEventListener('DOMContentLoaded', async () => {
    try {

        // Initialize databases
        await initializeDatabases();

        // Render Africa Overview map by default
        await showAfricaOverview();

        // Show Bilateral partnership
        showBilateral();

        // Show comparative advantage
        showComparative();

        // Attach event listener to the Africa Overview button
        const africaButton = document.getElementById("africaButton");
        if (africaButton) {
            africaButton.addEventListener("click", showAfricaOverview);
        } else {
            console.error("Africa Overview button not found in the DOM!");
        }



        
        // Attach event listeners to zoom buttons
        const zoomInButton = document.getElementById("zoomIn");
        const zoomOutButton = document.getElementById("zoomOut");

        if (zoomInButton) {
            zoomInButton.addEventListener("click", zoomIn);
        }

        if (zoomOutButton) {
            zoomOutButton.addEventListener("click", zoomOut);
        }
    } catch (error) {
        console.error("Error loading data or initializing visualizations:", error);
    }
});