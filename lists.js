/* ==========================================
   Logic for lists.html
   ========================================== */

let currentSelectedList = null;

document.addEventListener("DOMContentLoaded", () => {
    initListsPage();
});

// Refresh page logic when user logs in/out via the top bar
const originalCheckLoginState = checkLoginState; // Hook into existing function
checkLoginState = function() {
    originalCheckLoginState();
    initListsPage(); // Re-run our logic
};

function initListsPage() {
    const currentUser = localStorage.getItem("currentUser");
    const container = document.getElementById("listContentArea");
    const message = document.getElementById("notSignedInMessage");
    const sidebarList = document.getElementById("userListsList");

    if (!currentUser) {
        container.style.display = "none";
        sidebarList.innerHTML = "";
        message.style.display = "block";
        return;
    }

    container.style.display = "block";
    message.style.display = "none";
    
    // Load lists from storage
    renderListsSidebar();
}

/* --- SIDEBAR LOGIC --- */

function renderListsSidebar() {
    const currentUser = localStorage.getItem("currentUser");
    const listContainer = document.getElementById("userListsList");
    
    // Get Data
    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    let userLists = allData[currentUser] || {};

    // If empty, create default
    if (Object.keys(userLists).length === 0) {
        userLists = { "Watchlist": [] };
        allData[currentUser] = userLists;
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
    }

    listContainer.innerHTML = "";

    const listNames = Object.keys(userLists);
    
    // Default to first list if none selected
    if (!currentSelectedList || !userLists[currentSelectedList]) {
        currentSelectedList = listNames[0];
    }

    listNames.forEach(name => {
        const li = document.createElement("li");
        li.className = "list-sidebar-item";
        if (name === currentSelectedList) li.classList.add("active");
        
        li.textContent = name;
        li.innerHTML = `<span class="list-name">${name}</span> <span class="count-badge">${userLists[name].length}</span>`;
        
        li.addEventListener("click", () => {
            currentSelectedList = name;
            renderListsSidebar(); // Re-render to update active class
            renderListContent(name);
        });

        listContainer.appendChild(li);
    });

    // Render the content for the currently selected list
    renderListContent(currentSelectedList);
}

/* --- MAIN CONTENT LOGIC --- */

function renderListContent(listName) {
    const titleEl = document.getElementById("activeListTitle");
    const grid = document.getElementById("activeListGrid");
    const currentUser = localStorage.getItem("currentUser");
    
    titleEl.textContent = listName;
    grid.innerHTML = "";

    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    const movieIds = allData[currentUser][listName] || [];

    if (movieIds.length === 0) {
        grid.innerHTML = `<p class="empty-state" style="width:100%">This list is empty. Go explore and add some movies!</p>`;
        return;
    }

    movieIds.forEach(id => {
        const movie = movieData[id];
        if (!movie) return;

        const div = document.createElement("div");
        div.className = "movie-container list-movie-card";
        
        div.innerHTML = `
            <div class="action-wrapper remove-wrapper">
                <button class="remove-movie-btn" title="Remove from list">×</button>
                <div class="action-menu">
                    <p style="color:white; margin-bottom:5px;">Remove?</p>
                    <button class="primary-btn small-btn danger-btn confirm-remove">Yes</button>
                </div>
            </div>
            <img class="moviepicture" src="${movie.poster}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
        `;
        
        const removeBtn = div.querySelector(".remove-movie-btn");
        const confirmMenu = div.querySelector(".action-menu");
        const confirmBtn = div.querySelector(".confirm-remove");

        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".list-movie-card .action-menu.active").forEach(m => m.classList.remove("active"));
            confirmMenu.classList.toggle("active");
        });

        confirmBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeMovieFromList(id);
        });

        div.addEventListener("mouseleave", () => {
             confirmMenu.classList.remove("active");
        });
        
        div.addEventListener("click", (e) => openExpandedView(id, e.currentTarget));
        grid.appendChild(div);
    });
}

function performRemoval(movieId) {
    const currentUser = localStorage.getItem("currentUser");
    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    const list = allData[currentUser][currentSelectedList];

    allData[currentUser][currentSelectedList] = list.filter(id => id !== movieId);
    
    localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
    
    renderListsSidebar();
}


/* ==========================================
   ACTIONS: ADD / REMOVE / RENAME
   ========================================== */

// --- 1. CREATE NEW LIST (This was missing!) ---
const createListBtn = document.getElementById("addNewListBtn");
const createListDropdown = document.getElementById("createListDropdown");
const createListInput = document.getElementById("newListNameInput");
const confirmCreateBtn = document.getElementById("confirmCreateListBtn");

if (createListBtn) {
    createListBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        createListDropdown.classList.toggle("active");
        
        if (createListDropdown.classList.contains("active")) {
            createListInput.value = "";
            createListInput.focus();
        }
    });

    confirmCreateBtn.addEventListener("click", (e) => {
        const currentUser = localStorage.getItem("currentUser");
        const newName = createListInput.value.trim();
        
        if (!newName) return;

        const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
        
        if (allData[currentUser][newName]) {
            alert("List already exists!");
            return;
        }

        allData[currentUser][newName] = [];
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
        
        currentSelectedList = newName;
        renderListsSidebar();
        createListDropdown.classList.remove("active");
    });
}


// --- 2. RENAME LOGIC (Dropdown) ---
const renameToggleBtn = document.getElementById("renameToggleBtn");
const renameDropdown = document.getElementById("renameDropdown");
const renameInput = document.getElementById("renameInput");
const confirmRenameBtn = document.getElementById("confirmRenameBtn");

if (renameToggleBtn) {
    renameToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        renameDropdown.classList.toggle("active");
        
        if (renameDropdown.classList.contains("active")) {
            renameInput.value = currentSelectedList;
            renameInput.focus();
        }
    });

    confirmRenameBtn.addEventListener("click", (e) => {
        const currentUser = localStorage.getItem("currentUser");
        const newName = renameInput.value.trim();
        
        if (!newName || newName === currentSelectedList) {
            renameDropdown.classList.remove("active");
            return;
        }

        const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
        
        if (allData[currentUser][newName]) {
            alert("A list with this name already exists.");
            return;
        }

        allData[currentUser][newName] = allData[currentUser][currentSelectedList];
        delete allData[currentUser][currentSelectedList];
        
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
        
        currentSelectedList = newName;
        renderListsSidebar();
        renameDropdown.classList.remove("active");
    });
}


// --- 3. DELETE LOGIC (Dropdown) ---
const deleteToggleBtn = document.getElementById("deleteToggleBtn");
const deleteDropdown = document.getElementById("deleteDropdown");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

if (deleteToggleBtn) {
    deleteToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        deleteDropdown.classList.toggle("active");
    });

    confirmDeleteBtn.addEventListener("click", () => {
        const currentUser = localStorage.getItem("currentUser");
        const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
        
        if (currentSelectedList === "Watchlist") {
            alert("You cannot delete your default Watchlist.");
            deleteDropdown.classList.remove("active");
            return;
        }

        delete allData[currentUser][currentSelectedList];
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));

        currentSelectedList = null; 
        deleteDropdown.classList.remove("active");
        renderListsSidebar();
    });
}


// --- 4. GLOBAL CLICK HANDLER ---
document.addEventListener("click", (e) => {
    // Check Create Dropdown
    if (createListDropdown && !createListDropdown.contains(e.target) && e.target !== createListBtn) {
        createListDropdown.classList.remove("active");
    }
    // Check Rename Dropdown
    if (renameDropdown && !renameDropdown.contains(e.target) && e.target !== renameToggleBtn) {
        renameDropdown.classList.remove("active");
    }
    // Check Delete Dropdown
    if (deleteDropdown && !deleteDropdown.contains(e.target) && e.target !== deleteToggleBtn) {
        deleteDropdown.classList.remove("active");
    }
});

function closeAllDropdowns() {
    if (createListDropdown) createListDropdown.classList.remove("active");
    if (renameDropdown) renameDropdown.classList.remove("active");
    if (deleteDropdown) deleteDropdown.classList.remove("active");
}

function removeMovieFromList(movieId) {
    const currentUser = localStorage.getItem("currentUser");
    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    const list = allData[currentUser][currentSelectedList];

    allData[currentUser][currentSelectedList] = list.filter(id => id !== movieId);
    
    localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
    
    renderListContent(currentSelectedList);
    renderListsSidebar();
}

let activeTriggerElement = null;

function openExpandedView(movieId, triggerElement) {
    const movie = movieData[movieId];
    if (!movie) return;

    activeTriggerElement = triggerElement; 
    const modal = document.getElementById("movie-expand-modal");
    const card = document.querySelector(".expand-card");
    const slider = document.getElementById("expand-slider");
    
    // RESET STATE
    card.classList.remove("trailer-mode"); 
    document.getElementById("trailer-container").innerHTML = "";

    // 1. Populate Text Data
    document.getElementById("expand-img").src = movie.poster;
    const bgBlur = document.getElementById("expand-bg-blur");
    if (bgBlur) bgBlur.style.backgroundImage = `url('${movie.poster}')`;

    document.getElementById("expand-title").textContent = movie.title;
    document.getElementById("expand-year").textContent = movie.year;
    document.getElementById("expand-rating").textContent = `⭐ ${movie.rating}`;
    document.getElementById("expand-runtime").textContent = movie.runtime;
    
    if (typeof renderGenreList === "function") {
        renderGenreList("expand-genres", movie.genres);
    } else {
        document.getElementById("expand-genres").textContent = movie.genres.join(" • ");
    }

    document.getElementById("expand-desc").textContent = movie.desc;
    document.getElementById("expand-link").href = movie.link || "#";
    
    // Setup Trailer Button
    const trailerBtn = document.getElementById("watch-trailer-btn");
    trailerBtn.onclick = () => enterTrailerMode(movie);

    // 2. Animation Start Position
    const startRect = triggerElement.getBoundingClientRect();
    
    card.classList.add("poster-only");     
    card.classList.add("animating-start"); 
    
    card.style.top = `${startRect.top}px`;
    card.style.left = `${startRect.left}px`;
    card.style.width = `${startRect.width}px`;
    card.style.height = `${startRect.height}px`;
    card.style.borderRadius = "8px";

    modal.classList.add("active");
    void card.offsetWidth;

    // 3. PHASE 1: Fly to Center
    // Must match the CSS height of .expand-card (600px)
    const midHeight = 555; 
    const midWidth = 333;  
    const midTop = (window.innerHeight - midHeight) / 2;
    const midLeft = (window.innerWidth - midWidth) / 2; 

    card.classList.remove("animating-start"); 
    card.style.top = `${midTop}px`;
    card.style.left = `${midLeft}px`;
    card.style.width = `${midWidth}px`;
    
    // EXPLICITLY set the full height here so it animates to it
    card.style.height = `${midHeight}px`; 
    card.style.borderRadius = "12px";

    // 4. PHASE 2: Expand Width
    setTimeout(() => {
        const finalWidth = 900; 
        const finalLeft = (window.innerWidth - finalWidth) / 2;

        card.classList.remove("poster-only"); 
        card.style.width = `${finalWidth}px`;
        card.style.left = `${finalLeft}px`;
        // Height stays at 600px from Phase 1
    }, 300); 
}

function enterTrailerMode(movie) {
    const card = document.querySelector(".expand-card");
    const container = document.getElementById("trailer-container");
    
    // Trigger CSS Animations
    card.classList.add("trailer-mode");

    // Load Video Logic
    let videoId = "dQw4w9WgXcQ"; // Default fallback
    
    if (movie.trailer) {
        videoId = movie.trailer;
    } else if (movie.link && movie.link.includes("youtube.com/watch?v=")) {
        videoId = movie.link.split("v=")[1].split("&")[0];
    } else {
        videoId = "zSWdZVtXT7E"; 
    }

    // Calculate Origin
    const origin = window.location.origin === "file://" ? "*" : window.location.origin;

    // Inject Iframe using youtube-nocookie.com
    container.innerHTML = `
        <iframe 
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&origin=${origin}" 
            title="YouTube video player"
            frameborder="0"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
}

// Return to Details Logic
const backToDetailsBtn = document.getElementById("back-to-details-btn");
if(backToDetailsBtn) {
    backToDetailsBtn.addEventListener("click", () => {
        const card = document.querySelector(".expand-card");
        
        // Remove class to reverse animations
        card.classList.remove("trailer-mode");
        
        // Clear video after slide animation (0.5s)
        setTimeout(() => {
            document.getElementById("trailer-container").innerHTML = "";
        }, 500);
    });
}

function closeExpandedView() {
    const modal = document.getElementById("movie-expand-modal");
    const card = document.querySelector(".expand-card");

    if (!activeTriggerElement) {
        modal.classList.remove("active");
        return;
    }

    card.classList.remove("trailer-mode");
    document.getElementById("trailer-container").innerHTML = "";

    // 1. PHASE 1: Collapse Width
    card.classList.add("poster-only");
    
    const midHeight = 550;
    const midWidth = 333;
    const midLeft = (window.innerWidth - midWidth) / 2;
    const midTop = (window.innerHeight - midHeight) / 2;
    
    card.style.width = `${midWidth}px`;
    card.style.height = `${midHeight}px`; // Ensure height stays full during width collapse
    card.style.left = `${midLeft}px`;
    card.style.top = `${midTop}px`;

    // 2. PHASE 2: Return to Thumbnail
    setTimeout(() => {
        const targetRect = activeTriggerElement.getBoundingClientRect();

        card.classList.add("animating-start"); 
        
        card.style.top = `${targetRect.top}px`;
        card.style.left = `${targetRect.left}px`;
        card.style.width = `${targetRect.width}px`;
        
        // NOW we allow the height to shrink back to the small card size
        card.style.height = `${targetRect.height}px`; 
        
        card.style.borderRadius = "8px";
        
        modal.classList.remove("active"); 
    }, 300); 
}

// Event Listeners
const closeExpandBtn = document.getElementById("close-expand-btn");
const expandModal = document.getElementById("movie-expand-modal");

if(closeExpandBtn) {
    closeExpandBtn.addEventListener("click", closeExpandedView);
}

if(expandModal) {
    expandModal.addEventListener("click", (e) => {
        if (e.target === expandModal) {
            closeExpandedView();
        }
    });
}