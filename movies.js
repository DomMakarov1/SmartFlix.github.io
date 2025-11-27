function showMovieDetails(movieId) {
    const movie = movieData[movieId];
    if (!movie) return;

    // Populate Sidebar
    document.getElementById("sidebarTitle").textContent = movie.title;
    document.getElementById("sidebarYear").textContent = `${movie.year} • ${movie.runtime}`;
    document.getElementById("sidebarGenres").textContent = movie.genres.join(" • ");
    document.getElementById("sidebarRating").textContent = `⭐ ${movie.rating}`;
    document.getElementById("sidebarDesc").textContent = movie.desc;

    // Reset Buttons
    const markBtn = document.getElementById("markAsWatched");
    const optionsDiv = document.getElementById("ratingOptions");
    
    markBtn.style.display = "block";
    markBtn.style.opacity = "1";
    optionsDiv.classList.remove("active", "hidden", "has-selection");
    optionsDiv.style.display = "none";
    
    // Clear selection state
    document.querySelectorAll(".rate-btn").forEach(btn => {
        btn.classList.remove("selected");
        const xBtn = btn.querySelector(".reset-rating");
        if (xBtn) xBtn.remove();
    });

    document.getElementById("sidebarWatched").dataset.currentMovie = movieId;

    // Check if user has already rated this movie
    const savedRating = getUserRating(movieId);

    if (savedRating) {
        // If rated, show the options immediately
        markBtn.style.display = "none";
        markBtn.style.opacity = "0";
        
        optionsDiv.classList.remove("hidden");
        optionsDiv.style.display = "flex";
        optionsDiv.classList.add("active");
        optionsDiv.classList.add("has-selection");

        const targetBtn = document.querySelector(`.rate-btn[data-rating="${savedRating}"]`);
        if (targetBtn) {
            targetBtn.classList.add("selected");

            const xBtn = document.createElement("span");
            xBtn.className = "reset-rating";
            xBtn.innerHTML = "&#10005;"; // 'X' symbol

            xBtn.addEventListener("click", (e) => 
                resetRatingUI(e, movieId, optionsDiv, markBtn, targetBtn, xBtn)
            );
            targetBtn.appendChild(xBtn);
        }
    }

    // Populate Similar List
    const similarList = document.getElementById("sidebarSimilar");
    similarList.innerHTML = "";
    movie.similar?.forEach(id => {
        if (!movieData[id]) return;
        const li = document.createElement("li");
        li.textContent = movieData[id].title;
        li.dataset.movie = id;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => showMovieDetails(id));
        similarList.appendChild(li);
    });

    // Populate Sequels List
    const sequelsList = document.getElementById("sidebarSequels");
    sequelsList.innerHTML = "";
    movie.sequels?.forEach(id => {
        if (!movieData[id]) return;
        const li = document.createElement("li");
        li.textContent = movieData[id].title;
        li.dataset.movie = id;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => showMovieDetails(id));
        sequelsList.appendChild(li);
    });
}

// 2. Button Event Listeners
document.getElementById("markAsWatched").addEventListener("click", function() {
    const markBtn = this;
    const optionsDiv = document.getElementById("ratingOptions");

    markBtn.style.opacity = "0";

    setTimeout(() => {
        markBtn.style.display = "none";
        
        optionsDiv.classList.remove("hidden");
        optionsDiv.style.display = "flex";

        setTimeout(() => {
            optionsDiv.classList.add("active");
        }, 10);
    }, 300);
});

document.querySelectorAll(".rate-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        const movieId = document.getElementById("sidebarWatched").dataset.currentMovie;
        const ratingValue = this.dataset.rating;
        const optionsDiv = document.getElementById("ratingOptions");
        const markBtn = document.getElementById("markAsWatched");
        
        console.log(`User rated ${movieId} with score: ${ratingValue}`);
        
        // UI Updates for Selection
        optionsDiv.classList.add("has-selection");
        this.classList.add("selected");

        if (!this.querySelector(".reset-rating")) {
            const xBtn = document.createElement("span");
            xBtn.className = "reset-rating";
            xBtn.innerHTML = "&#10005;";
            
            xBtn.addEventListener("click", (e) => 
                resetRatingUI(e, movieId, optionsDiv, markBtn, this, xBtn)
            );

            this.appendChild(xBtn);
        }

        // Save to LocalStorage
        const saved = saveRating(movieId, ratingValue);
        
        if (!saved) {
            // Revert if save failed (e.g. not logged in)
            optionsDiv.classList.remove("has-selection");
            this.classList.remove("selected");
            const xBtn = this.querySelector(".reset-rating");
            if(xBtn) xBtn.remove();
        } else {
            updateRecommendations();
            // Optional: Update Hero immediately if you want instant gratification
            // updateHeroSection(); 
        }
    });
});

// 3. Global Click Listeners for Movie Cards
document.querySelectorAll(".movie-container").forEach(container => {
    container.addEventListener("click", () => {
        const movieId = container.dataset.movie;
        showMovieDetails(movieId);
    });
});

// 4. Horizontal Scroller Logic
(function () {
    const scrollers = document.querySelectorAll(".movie-scroller");

    scrollers.forEach(scroller => {
        scroller.addEventListener("wheel", (e) => {
            if (scroller.scrollWidth <= scroller.clientWidth) return;

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                scroller.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        scroller.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") scroller.scrollLeft += 160;
            if (e.key === "ArrowLeft") scroller.scrollLeft -= 160;
        });
    });
})();

// --- Helper Functions (Storage & Ratings) ---

function getRatings() {
    return JSON.parse(localStorage.getItem("movieRatings") || "{}");
}

function getUserRating(movieId) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return null;
    
    const ratings = getRatings();
    if (ratings && ratings[currentUser]) {
        return ratings[currentUser][movieId];
    }
    return null;
}

function saveRating(movieId, ratingValue) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("You must be signed in to rate movies.");
        return false;
    }

    const ratings = getRatings();
    
    if (!ratings[currentUser]) {
        ratings[currentUser] = {};
    }

    ratings[currentUser][movieId] = ratingValue;
    
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
    console.log(`Saved rating: User=${currentUser}, Movie=${movieId}, Rating=${ratingValue}`);
    return true;
}

function removeRating(movieId) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const ratings = getRatings();
    
    if (ratings[currentUser] && ratings[currentUser][movieId]) {
        delete ratings[currentUser][movieId];
        localStorage.setItem("movieRatings", JSON.stringify(ratings));
        console.log(`Removed rating: ${movieId}`);
    }
}

function resetRatingUI(e, movieId, optionsDiv, markBtn, btnElement, xBtnElement) {
    e.stopPropagation();
    removeRating(movieId);

    optionsDiv.classList.remove("has-selection");
    btnElement.classList.remove("selected");
    xBtnElement.remove();

    optionsDiv.classList.remove("active");
    optionsDiv.style.display = "none";
    markBtn.style.display = "block";
    
    setTimeout(() => markBtn.style.opacity = "1", 10);
    
    updateRecommendations();
}

// --- RECOMMENDATION ALGORITHM ---

function calculateSimilarity(targetMovieId, ratedMovieId) {
    const target = movieData[targetMovieId];
    const rated = movieData[ratedMovieId];
    
    if (!target || !rated) return 0;

    let score = 0;

    // Franchise Boost
    if (target.franchise && rated.franchise && target.franchise === rated.franchise) {
        score += 7;
    }

    // Genre Matching
    target.genres.forEach(g => {
        if (rated.genres.includes(g)) {
            score += 5;
        }
    });

    // Director Matching
    if (target.director && rated.director && target.director === rated.director) {
        score += 3;
    }

    // Cast Matching
    if (target.cast && rated.cast) {
        target.cast.forEach(actor => {
            if (rated.cast.includes(actor)) {
                score += 2;
            }
        });
    }
    
    // Keyword Matching
    if (target.keywords && rated.keywords) {
        target.keywords.forEach(k => {
            if (rated.keywords.includes(k)) {
                score += 1;
            }
        });
    }

    // Manual 'Similar' List overlap
    if (rated.similar && rated.similar.includes(targetMovieId)) score += 2;

    return score;
}

// Core helper to get a sorted list of recommendations
function getRecommendationList() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return [];

    const ratings = getRatings()[currentUser];
    if (!ratings || Object.keys(ratings).length === 0) return [];

    const watchedMovies = Object.keys(ratings);
    const movieScores = {};

    Object.keys(movieData).forEach(candidateId => {
        if (watchedMovies.includes(candidateId)) return; // Skip watched

        let totalScore = 0;

        watchedMovies.forEach(ratedId => {
            const userRating = parseInt(ratings[ratedId]);
            // Only consider positive ratings for recommendations
            if (userRating > 0) {
                const similarity = calculateSimilarity(candidateId, ratedId);
                totalScore += similarity * userRating;
            }
        });

        if (totalScore > 0) {
            movieScores[candidateId] = totalScore + (Math.random() * 5); // Small randomness tie-breaker
        }
    });

    // Sort by score descending
    return Object.keys(movieScores).sort((a, b) => movieScores[b] - movieScores[a]);
}

function updateRecommendations() {
    const currentUser = localStorage.getItem("currentUser");
    const container = document.getElementById("aipicked");

    if (!currentUser) {
        container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">Please sign in to view recommendations.</p>`;
        return;
    }

    const sortedMovies = getRecommendationList();

    if (sortedMovies.length === 0) {
        const ratings = getRatings()[currentUser];
        if (!ratings || Object.keys(ratings).length === 0) {
             container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">Welcome, <strong>${currentUser}</strong>! Start rating movies to get personalized picks.</p>`;
        } else {
             container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">No recommendations found yet. Try rating different genres!</p>`;
        }
        return;
    }

    container.innerHTML = ""; 

    sortedMovies.forEach(id => {
        const movie = movieData[id];
        const imgSrc = movie.poster || `${movie.title}.jpg`; 

        const movieDiv = document.createElement("div");
        movieDiv.className = "movie-container";
        movieDiv.dataset.movie = id;
        
        movieDiv.innerHTML = `
            <img class="moviepicture" src="${imgSrc}" height="150" width="150" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/150x150?text=No+Image'">
            <div class="movie-title">${movie.title}</div>
        `;

        movieDiv.addEventListener("click", () => {
            showMovieDetails(id);
        });

        container.appendChild(movieDiv);
    });
}

function updateHeroSection() {
    const currentUser = localStorage.getItem("currentUser");
    
    let heroId = "Inception";//default
    let reasonText = "";

    if (currentUser) {
        const recommended = getRecommendationList();
        
        if (recommended.length > 0) {
            const topPicks = recommended.slice(0, 5);
            const randomPick = topPicks[Math.floor(Math.random() * topPicks.length)];
            heroId = randomPick;
            reasonText = `Because you liked similar movies`;
        }
    }

    const movie = movieData[heroId];
    if (!movie) return;

    document.getElementById("movietitle").textContent = movie.title;
    document.getElementById("tagline").textContent = movie.desc;
    document.getElementById("rating").textContent = `⭐ ${movie.rating.split('/')[0]}`;
    document.getElementById("year").textContent = movie.year;
    document.getElementById("runtime").textContent = movie.runtime;
    document.getElementById("moviedesc").textContent = movie.desc;
    document.getElementById("moviepicture").src = movie.poster;

    const genreContainer = document.getElementById("genres");
    genreContainer.innerHTML = "";
    movie.genres.forEach(g => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = g;
        genreContainer.appendChild(span);
    });

    const reasonSpan = document.getElementById("because");
    if (reasonText) {
        reasonSpan.innerHTML = reasonText;
        reasonSpan.style.display = "block";
    } else {
        reasonSpan.style.display = "none";
    }
}

updateHeroSection();
updateRecommendations();

let lastUser = localStorage.getItem("currentUser");
setInterval(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser !== lastUser) {
        lastUser = currentUser;
        updateHeroSection();
        updateRecommendations();
    }
}, 1000);