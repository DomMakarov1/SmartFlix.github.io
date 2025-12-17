document.addEventListener("DOMContentLoaded", () => {
    // 1. Randomness Logic
    const randomSlider = document.getElementById("randomnessRange");
    const randomDisplay = document.getElementById("randomValDisplay");

    const christmasToggle = document.getElementById("christmasToggle");
    
    if (christmasToggle) {
        const savedTheme = localStorage.getItem("theme_christmas");
        const isChristmas = savedTheme === "true" || savedTheme === null;
        
        christmasToggle.checked = isChristmas;
        
        christmasToggle.addEventListener("change", (e) => {
            const enabled = e.target.checked;
            localStorage.setItem("theme_christmas", enabled);
            
            if (enabled) document.body.classList.add("christmas-theme");
            else document.body.classList.remove("christmas-theme");
        });
    }

    // HELPER: Visual Slider Position (0-100) -> Actual Value
    function sliderPosToRealValue(pos) {
        pos = parseInt(pos);
        if (pos <= 50) return Math.round(pos / 2); // 0-50 -> 0-25
        return Math.round(25 + ((pos - 50) * 1.5)); // 50-100 -> 25-100
    }

    // HELPER: Actual Value -> Visual Slider Position
    function realValueToSliderPos(val) {
        val = parseInt(val);
        if (val <= 25) return val * 2; // 0-25 -> 0-50
        return 50 + ((val - 25) / 1.5); // 25-100 -> 50-100
    }

    function updateColor(val) {
        if (val < 15) randomDisplay.style.color = "#4ade80"; 
        else if (val > 60) randomDisplay.style.color = "#f87171"; 
        else randomDisplay.style.color = "#ffd700"; 
    }

    const savedRandomness = localStorage.getItem("pref_randomness") || "25";
    randomDisplay.value = savedRandomness;
    randomSlider.value = realValueToSliderPos(savedRandomness);
    updateColor(savedRandomness);

    randomSlider.addEventListener("input", (e) => {
        const pos = e.target.value;
        const realValue = sliderPosToRealValue(pos);
        
        randomDisplay.value = realValue;
        localStorage.setItem("pref_randomness", realValue);
        updateColor(realValue);
    });

    randomDisplay.addEventListener("input", (e) => {
        let val = parseInt(e.target.value);
        
        if (isNaN(val)) return;
        if (val < 0) val = 0;
        if (val > 100) val = 100;

        randomSlider.value = realValueToSliderPos(val);
        
        localStorage.setItem("pref_randomness", val);
        updateColor(val);
    });

    function updateColor(val) {
        if (val < 15) randomDisplay.style.color = "#4ade80"; // Green (Predictable)
        else if (val > 60) randomDisplay.style.color = "#f87171"; // Red (Wild)
        else randomDisplay.style.color = "#ffd700"; // Yellow (Balanced)
    }

    // 2. Reset Ratings Logic
    const resetRatingsBtn = document.getElementById("resetRatingsBtn");
    if(resetRatingsBtn) {
        resetRatingsBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
                alert("Please sign in to manage data.");
                return;
            }

            if (confirm("Are you sure you want to reset all your movie ratings? This cannot be undone.")) {
                const allRatings = JSON.parse(localStorage.getItem("movieRatings") || "{}");
                if (allRatings[currentUser]) {
                    delete allRatings[currentUser];
                    localStorage.setItem("movieRatings", JSON.stringify(allRatings));
                    alert("Ratings cleared. Your recommendations have been reset.");
                } else {
                    alert("No ratings found to clear.");
                }
            }
        });
    }

    // 3. Clear Lists Logic
    const clearListsBtn = document.getElementById("clearListsBtn");
    if(clearListsBtn) {
        clearListsBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
                alert("Please sign in to manage data.");
                return;
            }

            if (confirm("Are you sure you want to delete ALL your watchlists? This cannot be undone.")) {
                const allLists = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
                if (allLists[currentUser]) {
                    // Reset to default empty watchlist
                    allLists[currentUser] = { "Watchlist": [] };
                    localStorage.setItem("smartflix_user_lists", JSON.stringify(allLists));
                    alert("All lists deleted. 'Watchlist' has been reset.");
                }
            }
        });
    }
});