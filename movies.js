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
