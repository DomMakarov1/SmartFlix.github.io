const movieData = {
	"Inception": {
		title: "Inception",
		year: 2010,
		runtime: "2h 28m",
		genres: ["Action", "Sci-Fi", "Thriller"],
		rating: "8.8/10",
		desc: "A skilled thief who steals secrets through dream-sharing technology...",
		similar: ["TheMatrix", "Interstellar", "Tenet"],
		sequels: []
	},
	"TheMatrix": {
		title: "The Matrix",
		year: 1999,
		runtime: "2h 16m",
		genres: ["Action", "Sci-Fi"],
		rating: "8.7/10",
		desc: "A hacker discovers the shocking truth about reality and his role in the war against its controllers.",
		similar: ["Inception", "Dark City", "Equilibrium"],
		sequels: ["The Matrix Reloaded", "The Matrix Revolutions", "The Matrix Resurrections"]
	},
	"HarryPotter1": {
		title: "Harry Potter and the Philosopher's Stone",
		year: 2001,
		runtime: "2h 32m",
		genres: ["Fantasy", "Action", "Adventure"],
		rating: "9.6/10",
		desc: "A young wizard discovers a hidden power within his school, drawing him into a perilous quest for an artifact of immortality.",
		similar: [],
		sequels: ["HarryPotter2", "HarryPotter3", "HarryPotter4", "HarryPotter5"]
	},
	"HarryPotter2": {
		title: "Harry Potter and the Chamber of Secrets",
		year: 2002,
		runtime: "2h 38m",
		genres: ["Fantasy", "Action", "Adventure"],
		rating: "9.4/10",
		desc: "A young wizard confronts an ancient chamber within his school, unraveling a sinister mystery bound to a dark legacy.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter3", "HarryPotter4", "HarryPotter5"]
	},
	"HarryPotter3": {
		title: "Harry Potter and the Prisoner of Azkaban",
		year: 2004,
		runtime: "2h 22m",
		genres: ["Fantasy", "Action", "Adventure"],
		rating: "9.6/10",
		desc: "A young wizard faces ominous omens and a fugitive’s escape, uncovering secrets that will alter his understanding of the past.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter4", "HarryPotter5"]
	},
	"HarryPotter4": {
		title: "Harry Potter and the Goblet of Fire",
		year: 2005,
		runtime: "2h 37m",
		genres: ["Fantasy", "Action", "Adventure"],
		rating: "8.6/10",
		desc: "Thrust into a perilous tournament, a young wizard confronts deadly challenges and a dark resurgence that signals the return of an ancient threat.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter5"]
	},
	"HarryPotter5": {
		title: "Harry Potter and the Order of the Phoenix",
		year: 2007,
		runtime: "2h 18m",
		genres: ["Fantasy", "Action", "Adventure"],
		rating: "8.7/10",
		desc: "Haunted by visions and disbelief, a young wizard rallies allies against hidden tyranny as a shadowy power tightens its grip on the wizarding world.",
		similar: [],
		sequels: ["HarryPotter1", "HarryPotter2", "HarryPotter3", "HarryPotter4"]
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
        // If saved, hide "Mark as Watched" and show the rating options
        markBtn.style.display = "none";
        markBtn.style.opacity = "0";
        
        optionsDiv.classList.remove("hidden");
        optionsDiv.style.display = "flex";
        optionsDiv.classList.add("active");
        optionsDiv.classList.add("has-selection"); // Compress mode

        // Find the correct button and select it
        const targetBtn = document.querySelector(`.rate-btn[data-rating="${savedRating}"]`);
        if (targetBtn) {
            targetBtn.classList.add("selected");
            
            // Re-create the X button visually
            const xBtn = document.createElement("span");
            xBtn.className = "reset-rating";
            xBtn.innerHTML = "&#10005;";
            
            // Re-attach the exact same listener logic 
            // ( Ideally, extract the X listener to a named function to avoid code duplication, 
            //   but for now, copy-pasting the X logic here works )
            xBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeRating(movieId); // Delete from storage

                // UI Reset
                optionsDiv.classList.remove("has-selection");
                targetBtn.classList.remove("selected");
                xBtn.remove();
                optionsDiv.classList.remove("active");
                
                setTimeout(() => {
                    optionsDiv.classList.add("hidden"); 
                    optionsDiv.style.display = "none";
                    markBtn.style.display = "block";
                    setTimeout(() => markBtn.style.opacity = "1", 10);
                }, 300);
            });
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
            
            xBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                
                removeRating(movieId);

                optionsDiv.classList.remove("has-selection");
                this.classList.remove("selected");
                xBtn.remove();

                optionsDiv.classList.remove("active");
                optionsDiv.style.display = "none";
                markBtn.style.display = "block";
                setTimeout(() => markBtn.style.opacity = "1", 10);
            });

            this.appendChild(xBtn);
        }

        const saved = saveRating(movieId, ratingValue);
        
        if (!saved) {
            optionsDiv.classList.remove("has-selection");
            this.classList.remove("selected");
            const xBtn = this.querySelector(".reset-rating");
            if(xBtn) xBtn.remove();
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
	const scroller = document.getElementById("aipicked");
	if (!scroller) return;

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
})();

// --- Persistence Logic ---

function getRatings() {
    // FIX: The || "{}" must be OUTSIDE the getItem parenthesis
    return JSON.parse(localStorage.getItem("movieRatings") || "{}");
}

function getUserRating(movieId) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return null;
    
    const ratings = getRatings();
    // Safely check if the user and movie exist
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