const loginBtn = document.getElementById("login");
const overlay = document.getElementById("overlay");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const username = document.getElementById("username");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

function checkLoginState() {
    const currentUser = localStorage.getItem("currentUser");
    const userDisplay = document.getElementById("userDisplay");

    if (currentUser) {
        //Currently logged in
        if (userDisplay) userDisplay.textContent = `Welcome, ${currentUser}`;
        loginBtn.textContent = "Sign Out";
        username.textContent = currentUser;
    } else {
        //Currently logged out
        if (userDisplay) userDisplay.textContent = "";
        loginBtn.textContent = "Sign In";
        username.textContent = "";
    }
}

checkLoginState();

loginBtn.addEventListener("click", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
    	//Logout
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("currentUser");
            alert("You have been logged out.");
            checkLoginState();
        }
    } else {
        //Login
        overlay.style.display = "flex";
        showLogin();
    }
});

function closeModal() {
	overlay.style.display = "none";
	clearInputs();
}

function clearInputs() {
	document.querySelectorAll("#loginModal input").forEach(input => {
		input.value = "";
	});
}

function showSignup() {
	loginForm.style.display = "none";
	signupForm.style.display = "block";
	clearInputs();
}

function showLogin() {
	signupForm.style.display = "none";
	loginForm.style.display = "block";
	clearInputs();
}

overlay.addEventListener("click", (e) => {
	if (e.target === overlay) closeModal();
});

function getAccounts() {
	return JSON.parse(localStorage.getItem("accounts") || "[]");
}

function saveAccounts(accounts) {
	localStorage.setItem("accounts", JSON.stringify(accounts));
}

function hashPassword(password) {
	let nums = password.split("").map(c => c.charCodeAt(0));
	nums = nums.map(n => (n * 7 + 13) % 256);
	nums.reverse();
	nums = nums.map((n, i) => n ^ i);
	return nums.map(n => n.toString(16).padStart(2, "0")).join("");
}

signupForm.querySelector("button").addEventListener("click", () => {
	const username = signupUsername.value.trim();
	const email = signupEmail.value.trim();
	const password = signupPassword.value;

	if (!username || !email || !password) {
		alert("Please fill in all fields.");
		return;
	}

	const passwordRegex = /^(?=.*[A-Z]).{8,20}$/;
	if (!passwordRegex.test(password)) {
		alert("Password must be 8–20 characters and include at least one capital letter.");
		return;
	}

	const accounts = getAccounts();

	if (accounts.some(acc => acc.username === username)) {
		alert("Username already exists.");
		return;
	}

	if (accounts.some(acc => acc.email === email)) {
		alert("Email already exists.");
		return;
	}

	const hashed = hashPassword(password);
	accounts.push({ username, email, password: hashed });
	saveAccounts(accounts);
	alert("Account created successfully! You can now sign in.");
	showLogin();
});

loginForm.querySelector("button").addEventListener("click", () => {
	const username = loginUsername.value.trim();
    const password = loginPassword.value;

    if (!username || !password) {
        alert("Please fill in both fields.");
        return;
    }

    const accounts = getAccounts();
    const user = accounts.find(acc => acc.username.toLowerCase() === username.toLowerCase() || acc.email === username);

    if (!user) {
        alert("User not found.");
        return;
    }

    if (user.password !== hashPassword(password)) {
        alert("Incorrect password.");
        return;
    }

    localStorage.setItem("currentUser", user.username); 
    
    alert(`Welcome back, ${user.username}!`);

    checkLoginState();
    
    closeModal();
});