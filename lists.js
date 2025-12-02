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
            <button class="remove-movie-btn" title="Remove from list" onclick="removeMovieFromList('${id}', event)">×</button>
            <img class="moviepicture" src="${movie.poster}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
        `;
        
        // Open details on click (using movies.js function)
        div.addEventListener("click", () => showMovieDetails(id));
        grid.appendChild(div);
    });
}


const createListBtn = document.getElementById("addNewListBtn");
const createListDropdown = document.getElementById("createListDropdown");
const createListInput = document.getElementById("newListNameInput");
const confirmCreateBtn = document.getElementById("confirmCreateListBtn");

if (createListBtn) {
    // Toggle Dropdown
    createListBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns(); // Close other open menus
        createListDropdown.classList.toggle("active");
        
        // Focus input when opened
        if (createListDropdown.classList.contains("active")) {
            createListInput.value = ""; // Clear previous text
            createListInput.focus();
        }
    });

    // Handle Create Click
    confirmCreateBtn.addEventListener("click", (e) => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) return;

        const newName = createListInput.value.trim();
        if (!newName) return;

        const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
        
        if (allData[currentUser][newName]) {
            alert("List already exists!");
            return;
        }

        // Create the list
        allData[currentUser][newName] = [];
        localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
        
        // Update UI
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

function removeMovieFromList(movieId, event) {
    event.stopPropagation();
    const currentUser = localStorage.getItem("currentUser");

    if (!confirm("Remove this movie from the list?")) return;

    const allData = JSON.parse(localStorage.getItem("smartflix_user_lists") || "{}");
    const list = allData[currentUser][currentSelectedList];

    allData[currentUser][currentSelectedList] = list.filter(id => id !== movieId);
    localStorage.setItem("smartflix_user_lists", JSON.stringify(allData));
    
    renderListsSidebar();
}