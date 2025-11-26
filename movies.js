const movieData = {
	"Inception": {
		title: "Inception",
		year: 2010,
		runtime: "2h 28m",
		genres: ["Action", "Sci-Fi", "Thriller"],
		director: "Christopher Nolan",
		cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
		franchise: null,
		keywords: ["Dream", "Heist", "Mind-bending"],
		rating: "8.8/10",
		desc: "A skilled thief who steals secrets through dream-sharing technology...",
		similar: ["TheMatrix", "Interstellar", "Tenet"],
		sequels: [],
        poster: "movies/inception/Inception.jpg" 
	},
	"TheMatrix1": {
		title: "The Matrix",
		year: 1999,
		runtime: "2h 16m",
		genres: ["Action", "Sci-Fi"],
		director: "The Wachowskis",
		cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
		franchise: "Matrix",
		keywords: ["Simulation", "Dystopian", "Kung Fu"],
		rating: "8.7/10",
		desc: "A hacker discovers the shocking truth about reality and his role in the war against its controllers.",
		similar: ["Inception", "Dark City", "Equilibrium"],
		sequels: ["TheMatrix2", "TheMatrix3", "TheMatrix4"],
        poster: "movies/matrix/The Matrix.jpg"
	},
	"HarryPotter1": {
		title: "Harry Potter and the Philosopher's Stone",
		year: 2001,
		runtime: "2h 32m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "Chris Columbus",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "School", "Wizards"],
		rating: "9.6/10",
		desc: "A young wizard discovers a hidden power within his school, drawing him into a perilous quest for an artifact of immortality.",
		similar: [],
		sequels: ["HarryPotter2", "HarryPotter3", "HarryPotter4", "HarryPotter5", "HarryPotter6","HarryPotter7","HarryPotter8"],
        poster: "movies/harrypotter/hp1.jpg"
	},
	"HarryPotter2": {
		title: "Harry Potter and the Chamber of Secrets",
		year: 2002,
		runtime: "2h 38m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "Chris Columbus",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "School", "Mystery"],
		rating: "9.4/10",
		desc: "A young wizard confronts an ancient chamber within his school, unraveling a sinister mystery bound to a dark legacy.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter3", "HarryPotter4", "HarryPotter5", "HarryPotter6","HarryPotter7","HarryPotter8"],
        poster: "movies/harrypotter/hp2.jpg"
	},
	"HarryPotter3": {
		title: "Harry Potter and the Prisoner of Azkaban",
		year: 2004,
		runtime: "2h 22m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "Alfonso Cuarón",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Time Travel", "Werewolf"],
		rating: "9.6/10",
		desc: "A young wizard faces ominous omens and a fugitive’s escape, uncovering secrets that will alter his understanding of the past.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter4", "HarryPotter5", "HarryPotter6","HarryPotter7","HarryPotter8"],
        poster: "movies/harrypotter/hp3.jpg"
	},
	"HarryPotter4": {
		title: "Harry Potter and the Goblet of Fire",
		year: 2005,
		runtime: "2h 37m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "Mike Newell",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Tournament", "Dark Lord"],
		rating: "8.6/10",
		desc: "Thrust into a perilous tournament, a young wizard confronts deadly challenges and a dark resurgence that signals the return of an ancient threat.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter5", "HarryPotter6","HarryPotter7","HarryPotter8"],
        poster: "movies/harrypotter/hp4.jpg"
	},
	"HarryPotter5": {
		title: "Harry Potter and the Order of the Phoenix",
		year: 2007,
		runtime: "2h 18m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "David Yates",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Rebellion", "Prophecy"],
		rating: "8.7/10",
		desc: "Haunted by visions and disbelief, a young wizard rallies allies against hidden tyranny as a shadowy power tightens its grip on the wizarding world.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter4","HarryPotter6","HarryPotter7","HarryPotter8"],
        poster: "movies/harrypotter/hp5.jpg"
	},
	"HarryPotter6": {
		title: "Harry Potter and the Half-Blood Prince",
		year: 2009,
		runtime: "2h 33m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "David Yates",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Romance", "Horcruxes"],
		rating: "8.7/10",
		desc: "As darkness spreads beyond the shadows, a young wizard delves into a mysterious textbook and buried memories, uncovering a path that leads ever closer to a rising evil’s true power.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter4","HarryPotter5","HarryPotter7","HarryPotter8"],
		poster: "movies/harrypotter/hp6.jpg"
	},
	"HarryPotter7": {
		title: "Harry Potter and the Deathly Hallows: Part 1",
		year: 2010,
		runtime: "2h 26m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "David Yates",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Journey", "War"],
		rating: "8.5/10",
		desc: "On the run from a tightening regime, three young wizards hunt for elusive relics, confronting betrayal, sacrifice, and the looming dread of a world slipping into darkness.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter4","HarryPotter5","HarryPotter6","HarryPotter8"],
		poster: "movies/harrypotter/hp7.jpg"
	},
	"HarryPotter8": {
		title: "Harry Potter and the Deathly Hallows: Part 2",
		year: 2011,
		runtime: "2h 10m",
		genres: ["Fantasy", "Action", "Adventure"],
		director: "David Yates",
		cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"],
		franchise: "HarryPotter",
		keywords: ["Magic", "Battle", "Finale"],
		rating: "8.5/10",
		desc: "In a final clash between hope and tyranny, a young wizard returns to where it all began, facing destiny, loss, and the ultimate battle that will decide the fate of the wizarding world.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter4","HarryPotter5","HarryPotter6","HarryPotter7"],
		poster: "movies/harrypotter/hp8.jpg"
	},
	"TheMatrix2": {
		title: "The Matrix Reloaded",
		year: 2003,
		runtime: "2h 18m",
		genres: ["Action", "Sci-Fi"],
		director: "The Wachowskis",
		cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
		franchise: "Matrix",
		keywords: ["Simulation", "Dystopian", "Kung Fu"],
		rating: "8.6/10",
		desc: "A liberating hero races to uncover deeper layers of control, confronting new foes and revelations that challenge everything he believes about fate and freedom.",
		similar: ["Inception", "Dark City", "Equilibrium"],
		sequels: ["TheMatrix1", "TheMatrix3", "TheMatrix4"],
        poster: "movies/matrix/The Matrix2.jpg"
	},
	"TheMatrix3": {
		title: "The Matrix Revolutions",
		year: 2003,
		runtime: "2h 09m",
		genres: ["Action", "Sci-Fi"],
		director: "The Wachowskis",
		cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
		franchise: "Matrix",
		keywords: ["Simulation", "Dystopian", "Kung Fu"],
		rating: "8.8/10",
		desc: "As the war reaches its breaking point, a chosen fighter battles on two fronts—both human and machine—to forge a final path toward peace.",
		similar: ["Inception", "Dark City", "Equilibrium"],
		sequels: ["TheMatrix1", "TheMatrix2", "TheMatrix4"],
        poster: "movies/matrix/The Matrix3.jpg"
	},
	"TheMatrix4": {
		title: "The Matrix Resurrections",
		year: 2021,
		runtime: "2h 28m",
		genres: ["Action", "Sci-Fi"],
		director: "The Wachowskis",
		cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
		franchise: "Matrix",
		keywords: ["Simulation", "Dystopian", "Kung Fu"],
		rating: "5.9/10",
		desc: "Drawn back into a reality he once escaped, a weary legend confronts illusions, lost memories, and a renewed struggle for truth in a world more deceptive than ever.",
		similar: ["Inception", "Dark City", "Equilibrium"],
		sequels: ["TheMatrix1", "TheMatrix2", "TheMatrix3"],
        poster: "movies/matrix/The Matrix4.jpg"
	}
};

function showMovieDetails(movieId) {
	const movie = movieData[movieId];
	if (!movie) return;

	document.getElementById("sidebarTitle").textContent = movie.title;
	document.getElementById("sidebarYear").textContent = `${movie.year} • ${movie.runtime}`;
	document.getElementById("sidebarGenres").textContent = movie.genres.join(" • ");
	document.getElementById("sidebarRating").textContent = `⭐ ${movie.rating}`;
	document.getElementById("sidebarDesc").textContent = movie.desc;

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
	container.addEventListener("click", () => {
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

// --- Persistence Logic ---

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

    //franchise (sequels)
    if (target.franchise && rated.franchise && target.franchise === rated.franchise) {
        score += 10;
    }

    //genres
    target.genres.forEach(g => {
        if (rated.genres.includes(g)) {
            score += 5;
        }
    });

    //directors
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

    //sequels if not in franchise and similar films
    if (rated.similar && rated.similar.includes(targetMovieId)) score += 2;
    if (rated.sequels && rated.sequels.includes(targetMovieId)) score += 2; 

    return score;
}

function updateRecommendations() {
    const currentUser = localStorage.getItem("currentUser");
    const container = document.getElementById("aipicked");

    if (!currentUser) {
        container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">Please sign in to view recommendations.</p>`;
        return;
    }

    const ratings = getRatings()[currentUser];
    
    if (!ratings || Object.keys(ratings).length === 0) {
        container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">Welcome, <strong>${currentUser}</strong>! Start rating movies to get personalized picks.</p>`;
        return;
    }

    const watchedMovies = Object.keys(ratings);
    const movieScores = {};

    Object.keys(movieData).forEach(candidateId => {
        if (watchedMovies.includes(candidateId)) return;

        let totalScore = 0;

        watchedMovies.forEach(ratedId => {
            const userRating = parseInt(ratings[ratedId]);
            if (userRating > 0) {
                const similarity = calculateSimilarity(candidateId, ratedId);
                totalScore += similarity * userRating;
            }
        });

        if (totalScore > 0) {
            movieScores[candidateId] = totalScore;
        }
    });

    const sortedMovies = Object.keys(movieScores).sort((a, b) => movieScores[b] - movieScores[a]);

    if (sortedMovies.length === 0) {
        container.innerHTML = `<p style="color: #ddc8c4; padding: 20px;">No recommendations found yet. Try rating different genres!</p>`;
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

updateRecommendations();

let lastUser = localStorage.getItem("currentUser");
setInterval(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser !== lastUser) {
        lastUser = currentUser;
        updateRecommendations();
    }
}, 1000);