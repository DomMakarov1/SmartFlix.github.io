let randomnessFactor = parseInt(localStorage.getItem("pref_randomness") || "15");
const selectedGenres = new Set();

document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("movieSidebar");
    if (sidebar && sidebar.classList.contains("open") && !sidebar.contains(e.target)) {
        closeSidebar();
    }
});

const sidebarEl = document.getElementById("movieSidebar");
if (sidebarEl) {
    sidebarEl.addEventListener("click", function() {
        if (!this.classList.contains("open")) {
            this.classList.add("open");
            const mainContent = document.getElementById("mainContent");
            if(mainContent) mainContent.classList.add("shifted");
        }
    });
}

function renderGenreList(elementId, genres) {
    const container = document.getElementById(elementId);
    if(!container) return;
    
    container.innerHTML = "";
    
    genres.forEach((g, index) => {
        const span = document.createElement("span");
        
        if (g === "Christmas") {
            span.className = "christmas-text";
            span.textContent = g; 
        } else {
            span.textContent = g;
        }
        
        container.appendChild(span);
        
        if (index < genres.length - 1) {
            container.appendChild(document.createTextNode(" • "));
        }
    });
}

function showMovieDetails(movieId) {
    const movie = movieData[movieId];
    if (!movie) return;

    document.getElementById("sidebarTitle"  ).textContent = movie.title;
    document.getElementById("sidebarYear").textContent = `${movie.year} • ${movie.runtime}`;
    renderGenreList("sidebarGenres", movie.genres);
    document.getElementById("sidebarRating").textContent = `⭐ ${movie.rating}`;
    document.getElementById("sidebarDesc").textContent = movie.desc;

    const sidebarBg = document.getElementById("sidebarBgImage");
    if(sidebarBg) sidebarBg.src = movie.poster;

    const watchBtn = document.getElementById("watchMovieBtn");
    if(watchBtn) watchBtn.href = movie.link || "#";

    const sidebarWatchlistBtn = document.getElementById("sidebarWatchlistBtn");
    if(sidebarWatchlistBtn) {
        sidebarWatchlistBtn.dataset.movieId = movieId; 
        updateSidebarWatchlistButtonState(movieId);
    }

    const markBtn = document.getElementById("markAsWatched");
    const optionsDiv = document.getElementById("ratingOptions");
    
    markBtn.style.display = "block";
    markBtn.style.opacity = "1";
    optionsDiv.classList.remove("active", "hidden", "has-selection");
    optionsDiv.style.display = "none";
    
    document.querySelectorAll(".rate-btn").forEach(btn => {
        btn.classList.remove("selected");
        const xBtn = btn.querySelector(".reset-rating");
        if (xBtn) xBtn.remove();
    });

    document.getElementById("sidebarWatched").dataset.currentMovie = movieId;
    const savedRating = getUserRating(movieId);

    if (savedRating) {
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
            xBtn.innerHTML = "&#10005;";
            xBtn.addEventListener("click", (e) => 
                resetRatingUI(e, movieId, optionsDiv, markBtn, targetBtn, xBtn)
            );
            targetBtn.appendChild(xBtn);
        }
    }

    populateSidebarList("sidebarSimilar", movie.similar);
    populateSidebarList("sidebarSequels", movie.sequels);

    const sidebar = document.getElementById("movieSidebar");
    const mainContent = document.getElementById("mainContent");
    
    sidebar.classList.add("open");
    if(mainContent) mainContent.classList.add("shifted");
}

function populateSidebarList(elementId, idArray) {
    const list = document.getElementById(elementId);
    if(!list) return;
    list.innerHTML = "";
    idArray?.forEach(id => {
        if (!movieData[id]) return;
        const li = document.createElement("li");
        li.textContent = movieData[id].title;
        li.addEventListener("click", (e) => {
            e.stopPropagation(); 
            showMovieDetails(id);
        });
        list.appendChild(li);
    });
}

function closeSidebar() {
    const sidebar = document.getElementById("movieSidebar");
    const mainContent = document.getElementById("mainContent");
    
    sidebar.classList.remove("open");
    if(mainContent) mainContent.classList.remove("shifted");
}

function initSidebarWatchlist() {
    const btn = document.getElementById("sidebarWatchlistBtn");
    const dropdown = document.getElementById("sidebarWatchlistDropdown");
    const createBtn = document.getElementById("sidebarCreateNewListBtn");
    const newNameInput = document.getElementById("sidebarNewListName");

    if (!btn || !dropdown) return;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const currentUser = localStorage.getItem("currentUser");
        
        if (!currentUser) {
            alert("Please sign in to use lists.");
            return;
        }
        
        const sidebar = document.getElementById("sidebarWatched");
        const movieId = newBtn.dataset.movieId || (sidebar ? sidebar.dataset.currentMovie : null);
        
        if (movieId) {
            renderSidebarDropdownItems(movieId);
            dropdown.classList.toggle("active");
        } else {
            console.warn("No movie selected in sidebar.");
        }
    });

    document.addEventListener("click", (e) => {
        if (dropdown && dropdown.classList.contains("active") && !dropdown.contains(e.target) && e.target !== newBtn) {
            dropdown.classList.remove("active");
        }
    });

    if (createBtn) {
        const newCreateBtn = createBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newCreateBtn, createBtn);

        const input = document.getElementById("sidebarNewListName");

        newCreateBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const name = input.value.trim();
            if (!name) return;

            const lists = getUserListsData();
            if (lists && lists[name]) {
                alert("List already exists!");
                return;
            }

            if (lists) {
                lists[name] = [];
                saveUserListsData(lists);
                input.value = "";
                
                const currentMovieId = newBtn.dataset.movieId;
                if(currentMovieId) renderSidebarDropdownItems(currentMovieId);
            }
        });
    }
}

function renderSidebarDropdownItems(movieId) {
    const container = document.getElementById("sidebarUserListsContainer");
    const lists = getUserListsData();
    
    if (!container || !lists) return;
    
    container.innerHTML = "";

    Object.keys(lists).forEach(listName => {
        const movieIds = lists[listName];
        const isPresent = movieIds.includes(movieId);

        const div = document.createElement("div");
        div.className = `watchlist-item ${isPresent ? 'has-movie' : ''}`;
        div.textContent = listName;

        div.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMovieInList(listName, movieId);
            
            renderSidebarDropdownItems(movieId); 
            updateSidebarWatchlistButtonState(movieId); 
        });
        container.appendChild(div);
    });
}

function updateSidebarWatchlistButtonState(movieId) {
    const btn = document.getElementById("sidebarWatchlistBtn");
    const currentUser = localStorage.getItem("currentUser");
    
    if (!btn) return;

    if (!currentUser) {
        btn.textContent = "+ Add to List";
        btn.style.backgroundColor = "rgba(255,255,255,0.2)";
        btn.style.color = "white";
        return;
    }

    const lists = getUserListsData();
    const isInWatchlist = lists && lists["Watchlist"] && lists["Watchlist"].includes(movieId);

    if (isInWatchlist) {
        btn.textContent = "✓ In Watchlist";
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
    } else {
        btn.textContent = "+ Add to List";
        btn.style.backgroundColor = "rgba(255,255,255,0.2)";
        btn.style.color = "white";
    }
}

const markAsWatchedBtn = document.getElementById("markAsWatched");
if(markAsWatchedBtn) {
    markAsWatchedBtn.addEventListener("click", function(e) {
        e.stopPropagation();
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
}

document.querySelectorAll(".rate-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.stopPropagation();
        
        const movieId = document.getElementById("sidebarWatched").dataset.currentMovie;
        const ratingValue = this.dataset.rating;
        const optionsDiv = document.getElementById("ratingOptions");
        const markBtn = document.getElementById("markAsWatched");
        
        console.log(`User rated ${movieId} with score: ${ratingValue}`);
        
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

        const saved = saveRating(movieId, ratingValue);
        
        if (!saved) {
            optionsDiv.classList.remove("has-selection");
            this.classList.remove("selected");
            const xBtn = this.querySelector(".reset-rating");
            if(xBtn) xBtn.remove();
        } else {
            updateRecommendations();
        }
    });
});

document.querySelectorAll(".movie-container").forEach(container => {
    container.addEventListener("click", (e) => {
        e.stopPropagation(); 
        const movieId = container.dataset.movie;
        showMovieDetails(movieId);
    });
});

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

function calculateSimilarity(targetMovieId, ratedMovieId) {
    const target = movieData[targetMovieId];
    const rated = movieData[ratedMovieId];
    
    if (!target || !rated) return 0;

    let score = 0;

    //franchise
    if (target.franchise && rated.franchise && target.franchise === rated.franchise) {
        score += 7;
    }

    //genre
    target.genres.forEach(g => {
        if (rated.genres.includes(g)) {
            score += 5;
        }
    });

    //director
    if (target.director && rated.director && target.director === rated.director) {
        score += 3;
    }

    //cast
    if (target.cast && rated.cast) {
        target.cast.forEach(actor => {
            if (rated.cast.includes(actor)) {
                score += 2;
            }
        });
    }
    
    //keywords
    if (target.keywords && rated.keywords) {
        target.keywords.forEach(k => {
            if (rated.keywords.includes(k)) {
                score += 1;
            }
        });
    }

    //age rating
    if (target.ageRating && rated.ageRating && target.ageRating === rated.ageRating) {
        score += 2;
    }

    //similar
    if (rated.similar && rated.similar.includes(targetMovieId)) score += 2;

    return score;
}

function sortMoviesByUserTaste(movieIds, customRandomness = null) {
    const currentUser = localStorage.getItem("currentUser");
    const ratings = currentUser ? getRatings()[currentUser] : null;

    let factor = customRandomness !== null ? customRandomness : randomnessFactor;

    if (!ratings || Object.keys(ratings).length === 0) {
        return movieIds.sort(() => 0.5 - Math.random());
    }

    const watchedMovies = Object.keys(ratings);

    let candidates = movieIds.map(id => {
        const target = movieData[id];
        let totalScore = 0;

        watchedMovies.forEach(ratedId => {
            const userRating = parseInt(ratings[ratedId]);
            if (userRating > 0) {
                const sim = calculateSimilarity(id, ratedId);
                totalScore += sim * userRating; 
            }
        });

        totalScore += (Math.random() * factor);

        return { 
            id: id, 
            score: totalScore, 
            franchise: target.franchise 
        };
    });

    const finalSortedList = [];
    const seenFranchises = {};

    while (candidates.length > 0) {
        candidates.sort((a, b) => {
            const penaltyA = a.franchise ? (seenFranchises[a.franchise] || 0) * 30 : 0;
            const penaltyB = b.franchise ? (seenFranchises[b.franchise] || 0) * 30 : 0;

            const effectiveScoreA = a.score - penaltyA;
            const effectiveScoreB = b.score - penaltyB;

            return effectiveScoreB - effectiveScoreA;
        });

        const winner = candidates.shift();
        finalSortedList.push(winner.id);

        if (winner.franchise) {
            seenFranchises[winner.franchise] = (seenFranchises[winner.franchise] || 0) + 1;
        }
    }

    return finalSortedList;
}

function getRecommendationList() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return [];

    const ratings = getRatings()[currentUser];
    if (!ratings || Object.keys(ratings).length === 0) return [];

    const watchedMovies = Object.keys(ratings);
    const candidates = Object.keys(movieData).filter(id => !watchedMovies.includes(id));
    
    return sortMoviesByUserTaste(candidates);
}

function updateRecommendations() {
    const container = document.getElementById("aipicked");
    if (!container) return;

    const currentUser = localStorage.getItem("currentUser");

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

        movieDiv.addEventListener("click", (e) => {
            e.stopPropagation();
            showMovieDetails(id);
        });

        container.appendChild(movieDiv);
    });
}

function calculateAverageColor(imgElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const defaultColor = { r: 229, g: 9, b: 20 };

    const height = canvas.height = imgElement.naturalHeight || 100;
    const width = canvas.width = imgElement.naturalWidth || 100;

    context.drawImage(imgElement, 0, 0, width, height);

    let data;
    try {
        data = context.getImageData(0, 0, width, height).data;
    } catch (e) {
        console.warn("Security Error: Cannot read image pixels. Are you running from file://? Try using a Local Server.");
        return defaultColor;
    }

    let r = 0, g = 0, b = 0;
    let count = 0
    const stride = 10;

    for (let i = 0; i < data.length; i += 4 * stride) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return { r, g, b };
}

function updateHeroSection() {
    const movieTitleEl = document.getElementById("movietitle");
    if (!movieTitleEl) return; 

    const currentUser = localStorage.getItem("currentUser");
    
    let heroId = "Inception";
    let reasonText = "";

    if (currentUser) {
        const recommended = getRecommendationList();
        
        if (recommended.length > 0) {
            const topPicks = recommended.slice(0, 5);
            heroId = topPicks[Math.floor(Math.random() * topPicks.length)];
            reasonText = `Because you liked similar movies`;
        }
    }

    const movie = movieData[heroId];
    if (!movie) return;

    movieTitleEl.textContent = movie.title;
    document.getElementById("tagline").textContent = movie.desc;
    document.getElementById("rating").textContent = `⭐ ${movie.rating.split('/')[0]}`;
    document.getElementById("year").textContent = movie.year;
    document.getElementById("runtime").textContent = movie.runtime;
    document.getElementById("moviedesc").textContent = movie.desc;

    const genreContainer = document.getElementById("genres");
    genreContainer.innerHTML = "";
    movie.genres.forEach(g => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = g;
        
        if (g === "Christmas") {
            span.classList.add("christmas-tag");
        }
        
        genreContainer.appendChild(span);
    });

    const reasonSpan = document.getElementById("because");
    if (reasonText) {
        reasonSpan.innerHTML = reasonText;
        reasonSpan.style.display = "block";
    } else {
        reasonSpan.style.display = "none";
    }

    const watchlistBtn = document.getElementById("watchlistBtn");
    if (watchlistBtn) {
        watchlistBtn.dataset.movieId = heroId;
        if (currentUser) {
            const lists = getUserListsData();
            if (lists["Watchlist"] && lists["Watchlist"].includes(heroId)) {
                watchlistBtn.textContent = "✓ In Watchlist";
                watchlistBtn.style.backgroundColor = "white";
                watchlistBtn.style.color = "black";
            } else {
                watchlistBtn.textContent = "+ Add to List";
                watchlistBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
                watchlistBtn.style.color = "white";
            }
        }
    }

    const movieImgElement = document.getElementById("moviepicture");
    const bgElement = document.getElementById("hero-background"); 

    movieImgElement.onload = function() {
        const rgb = calculateAverageColor(this);
        const newGradient = `radial-gradient(circle at 18% 25%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25), transparent 50%)`;
        if(bgElement) bgElement.style.background = newGradient;
    };

    movieImgElement.src = movie.poster;
    
    if (movieImgElement.complete) {
        movieImgElement.onload();
    }
}

updateHeroSection();
updateRecommendations();
populateExplorePage();

let lastUser = localStorage.getItem("currentUser");
setInterval(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser !== lastUser) {
        lastUser = currentUser;
        updateHeroSection();
        updateRecommendations();

        populateExplorePage();
    }
}, 1000);


function getUserListsData() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return null;

    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    
    if (!allData[currentUser]) {
        allData[currentUser] = { "Watchlist": [] };
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
    }

    return allData[currentUser];
}

function saveUserListsData(userLists) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    allData[currentUser] = userLists;
    localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
}

function renderHeroDropdownItems(movieId) {
    const container = document.getElementById("userListsContainer");
    const lists = getUserListsData();
    container.innerHTML = "";

    if (!movieId || !lists) return;

    Object.keys(lists).forEach(listName => {
        const movieIds = lists[listName];
        const isPresent = movieIds.includes(movieId);

        const div = document.createElement("div");
        div.className = `watchlist-item ${isPresent ? 'has-movie' : ''}`;
        div.textContent = listName;

        div.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMovieInList(listName, movieId);
            renderHeroDropdownItems(movieId);
            
            updateHeroSection(); 
        });
        container.appendChild(div);
    });
}

function initWatchlistDropdown() {
    const btn = document.getElementById("watchlistBtn");
    const dropdown = document.getElementById("watchlistDropdown");
    const createBtn = document.getElementById("createNewListBtn");
    const newNameInput = document.getElementById("newListName");

    if (!btn || !dropdown) return;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            alert("Please sign in to create and manage lists.");
            return;
        }
        
        const currentMovieId = newBtn.dataset.movieId;
        
        if(currentMovieId) {
            renderHeroDropdownItems(currentMovieId);
            dropdown.classList.toggle("active");
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && e.target !== newBtn) {
            dropdown.classList.remove("active");
        }
    });

    if(createBtn) {
        const newCreateBtn = createBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newCreateBtn, createBtn);

        newCreateBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const name = newNameInput.value.trim();
            if (!name) return;

            const lists = getUserListsData();
            if (lists[name]) {
                alert("A list with this name already exists!");
                return;
            }
            lists[name] = [];
            saveUserListsData(lists);
            newNameInput.value = "";
            
            const currentMovieId = newBtn.dataset.movieId;
            if(currentMovieId) renderHeroDropdownItems(currentMovieId);
        });
    }
}

function renderDropdownItems() {
    const container = document.getElementById("userListsContainer");
    const lists = getUserListsData();
    const titleEl = document.getElementById("movietitle");
    
    if (!titleEl) return; 
    
    const currentTitle = titleEl.textContent;
    const currentMovieId = Object.keys(movieData).find(key => movieData[key].title === currentTitle);

    container.innerHTML = "";
    if (!currentMovieId) return;

    Object.keys(lists).forEach(listName => {
        const movieIds = lists[listName];
        const isPresent = movieIds.includes(currentMovieId);
        const div = document.createElement("div");
        div.className = `watchlist-item ${isPresent ? 'has-movie' : ''}`;
        div.textContent = listName;
        div.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMovieInList(listName, currentMovieId);
            renderDropdownItems();
        });
        container.appendChild(div);
    });
}

function toggleMovieInList(listName, movieId) {
    const lists = getUserListsData();
    const targetList = lists[listName];

    if (targetList.includes(movieId)) {
        lists[listName] = targetList.filter(id => id !== movieId);
    } else {
        targetList.push(movieId);
    }
    
    saveUserListsData(lists);
}

/* ==========================================
   UNIFIED EXPLORE LOGIC (Search + Genres)
   ========================================== */

function initExplorePageInteractions() {
    const searchInput = document.getElementById("searchInput");
    const genrePills = document.querySelectorAll(".genre-pill");

    if (searchInput) {
        const newSearch = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearch, searchInput);
        
        newSearch.addEventListener("input", () => {
            filterAndRenderMovies();
        });
        newSearch.focus(); 
    }

    // 2. Setup Genre Pills
    if (genrePills.length > 0) {
        genrePills.forEach(pill => {
            // Remove old listener
            const newPill = pill.cloneNode(true);
            pill.parentNode.replaceChild(newPill, pill);

            newPill.addEventListener("click", (e) => {
                const genre = newPill.dataset.genre;
                
                // Toggle Logic
                if (selectedGenres.has(genre)) {
                    selectedGenres.delete(genre);
                    newPill.classList.remove("selected");
                } else {
                    selectedGenres.add(genre);
                    newPill.classList.add("selected");
                }
                
                // Trigger Filter
                filterAndRenderMovies();
            });
        });
    }
}

function filterAndRenderMovies() {
    const searchInput = document.getElementById("searchInput");
    const defaultSections = document.getElementById("defaultExploreSections");
    const resultsContainer = document.getElementById("genreResultsContainer");
    const resultsGrid = document.getElementById("genreResults");
    const resultsTitle = document.getElementById("genreResultsTitle");

    if (!defaultSections || !resultsContainer || !resultsGrid) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const hasActiveSearch = query.length > 0;
    const hasActiveGenres = selectedGenres.size > 0;

    if (!hasActiveSearch && !hasActiveGenres) {
        defaultSections.style.display = "block";
        resultsContainer.style.display = "none";
        return;
    }

    defaultSections.style.display = "none";
    resultsContainer.style.display = "block";

    if (hasActiveSearch && hasActiveGenres) {
        resultsTitle.textContent = `Results for "${searchInput.value}" in ${Array.from(selectedGenres).join(", ")}`;
    } else if (hasActiveSearch) {
        resultsTitle.textContent = `Results for "${searchInput.value}"`;
    } else {
        resultsTitle.textContent = `Filtered by: ${Array.from(selectedGenres).join(", ")}`;
    }

    const matches = Object.keys(movieData).filter(id => {
        const movie = movieData[id];
        
        if (hasActiveGenres) {
            const meetsGenreCriteria = Array.from(selectedGenres).every(g => movie.genres.includes(g));
            if (!meetsGenreCriteria) return false;
        }
        
        if (hasActiveSearch) {
            const titleMatch = movie.title.toLowerCase().includes(query);
            const castMatch = movie.cast.some(actor => actor.toLowerCase().includes(query));
            const directorMatch = movie.director && typeof movie.director === 'string' && movie.director.toLowerCase().includes(query);
            const genreTextMatch = movie.genres.some(g => g.toLowerCase().includes(query)); 
            if (!titleMatch && !castMatch && !directorMatch && !genreTextMatch) return false;
        }
        return true;
    });

    const sortedMatches = applySort(matches);
    resultsGrid.innerHTML = "";

    if (sortedMatches.length === 0) {
        resultsGrid.innerHTML = `<p class="empty-state" style="grid-column: 1/-1; text-align: center;">No movies found matching your criteria.</p>`;
        return;
    }

    sortedMatches.forEach(id => {
        const movie = movieData[id];
        const div = document.createElement("div");
        div.className = "movie-container";
        div.dataset.movie = id;
        
        div.innerHTML = `
            <img class="moviepicture" src="${movie.poster}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
        `;
        
        div.addEventListener("click", (evt) => {
            evt.stopPropagation(); 
            showMovieDetails(id);
        });
        resultsGrid.appendChild(div);
    });
}

function populateExplorePage() {
    const trendingContainer = document.getElementById("exploreTrending");
    const newContainer = document.getElementById("exploreNew");
    const seasonalContainer = document.getElementById("exploreSeasonal");

    if (!trendingContainer) return;

    const trendingSorted = sortMoviesByUserTaste([...exploreLists.trending]);
    const newSorted = sortMoviesByUserTaste([...exploreLists.upcoming]);
    const seasonalSorted = sortMoviesByUserTaste([...exploreLists.seasonal]);

    const fillContainer = (container, movieIds) => {
        container.innerHTML = "";
        movieIds.forEach(id => {
            if (!movieData[id]) return;
            const movie = movieData[id];
            const div = document.createElement("div");
            div.className = "movie-container";
            div.dataset.movie = id;
            div.innerHTML = `
                <img class="moviepicture" src="${movie.poster}" height="150" width="150" alt="${movie.title}">
                <div class="movie-title">${movie.title}</div>
            `;
            div.addEventListener("click", (e) => {
                e.stopPropagation();
                showMovieDetails(id);
            });
            container.appendChild(div);
        });
    };

    fillContainer(trendingContainer, trendingSorted);
    fillContainer(newContainer, newSorted);
    fillContainer(seasonalContainer, seasonalSorted);
}

let currentSortMode = 'relevance';
let currentSortDir = 'desc'; 

function initSortDropdown() {
    const trigger = document.getElementById("sortTriggerBtn");
    const dropdown = document.getElementById("sortDropdown");
    const options = document.querySelectorAll(".sort-option");

    if (!trigger || !dropdown) return;

    function resetTitleVisuals() {
        const titleBox = document.querySelector(".title-anim-box");
        if (titleBox && titleBox.classList.contains("anim-fwd")) {
            titleBox.classList.remove("anim-fwd");
            titleBox.classList.add("anim-rev");
        }
    }

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        trigger.classList.toggle("open");
        dropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            trigger.classList.remove("open");
            dropdown.classList.remove("active");
        }
    });

    options.forEach(opt => {
        opt.addEventListener("click", () => {
            const sortType = opt.dataset.sort;
            const animBox = opt.querySelector(".title-anim-box") || opt.querySelector(".dir-arrow");

            if (sortType === currentSortMode) {
                if (sortType === 'year' || sortType === 'title') {
                    currentSortDir = (currentSortDir === 'desc') ? 'asc' : 'desc';
                }
            } else {
                if (currentSortMode === 'title') {
                    resetTitleVisuals();
                }

                if (currentSortMode === 'year') {
                    const yearArrow = document.querySelector('.sort-option[data-sort="year"] .dir-arrow');
                    if (yearArrow) yearArrow.classList.remove("flipped");
                }

                currentSortMode = sortType;
                
                if (sortType === 'year') currentSortDir = 'desc'; 
                if (sortType === 'title') currentSortDir = 'asc'; 
            }

            options.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");

            if (sortType === 'year') {
                animBox.textContent = "↓"; 
                if (currentSortDir === 'asc') animBox.classList.add("flipped");
                else animBox.classList.remove("flipped");
            }
            
            if (sortType === 'title') {
                const wasFwd = animBox.classList.contains("anim-fwd");
                animBox.classList.remove("anim-fwd", "anim-rev");
                void animBox.offsetWidth;

                if (currentSortDir === 'desc') { 
                    animBox.classList.add("anim-fwd");
                } else {
                    if (wasFwd) animBox.classList.add("anim-rev");
                }
            }

            filterAndRenderMovies();
        });
    });
}

function applySort(movieIds) {
    if (currentSortMode === 'relevance') {
        return sortMoviesByUserTaste(movieIds);
    }

    if (currentSortMode === 'discovery') {
        const boostedRandomness = (randomnessFactor * 2) + 10;
        
        const looseList = sortMoviesByUserTaste(movieIds, boostedRandomness);
        
        for (let i = 2; i < looseList.length - 1; i += 3) {
            const swapIndex = Math.floor(Math.random() * (looseList.length - i)) + i;
            [looseList[i], looseList[swapIndex]] = [looseList[swapIndex], looseList[i]];
        }
        
        return looseList;
    }

    if (currentSortMode === 'year') {
        return movieIds.sort((a, b) => {
            const valA = movieData[a].year;
            const valB = movieData[b].year;
            return currentSortDir === 'asc' ? valA - valB : valB - valA;
        });
    }

    if (currentSortMode === 'title') {
        return movieIds.sort((a, b) => {
            const valA = movieData[a].title.toLowerCase();
            const valB = movieData[b].title.toLowerCase();
            if (valA < valB) return currentSortDir === 'asc' ? -1 : 1;
            if (valA > valB) return currentSortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    return movieIds;
}

function enableDynamicGlow() {
    document.addEventListener("mouseover", (e) => {
        
        const card = e.target.closest(".movie-container");
        if (!card) return;

        if (card.dataset.hasGlow) return;

        const img = card.querySelector("img");
        
        if (img && img.complete) {
            try {
                const rgb = calculateAverageColor(img);
                
                const r = Math.min(255, rgb.r + 30);
                const g = Math.min(255, rgb.g + 30);
                const b = Math.min(255, rgb.b + 30);

                card.style.setProperty('--glow-color', `rgba(${r}, ${g}, ${b}, 1)`);
                
                card.dataset.hasGlow = "true";
                
            } catch (err) {
                console.log("Could not calculate glow");
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme_christmas");
    if (savedTheme === "true" || savedTheme === null) {
        document.body.classList.add("christmas-theme");
        if (savedTheme === null) localStorage.setItem("theme_christmas", "true");
    }

    if (typeof initSidebarWatchlist === "function") initSidebarWatchlist();
    if (typeof initWatchlistDropdown === "function") initWatchlistDropdown();
    if (typeof initExplorePageInteractions === "function") initExplorePageInteractions();
    
    if (document.getElementById("movietitle")) updateHeroSection();
    if (document.getElementById("aipicked")) updateRecommendations();
    if (document.getElementById("exploreTrending")) populateExplorePage();
    enableDynamicGlow();
    initSortDropdown();
});