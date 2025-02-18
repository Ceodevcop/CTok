/*
// 🔥 Firebase Configuration (Ensure your API key is secured!)
const firebaseConfig = {
    apiKey: "YOUR_NEW_API_KEY",
    authDomain: "ctok-app.firebaseapp.com",
    projectId: "ctok-app",
    storageBucket: "ctok-app.appspot.com",
    messagingSenderId: "991407836421",
    appId: "1:991407836421:web:5f8c275e0168ba573ffb6c"
};
//pi Network 
const PiNetwork = window.Pi;
PiNetwork.init({ version: "2.0", sandbox: true });

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Generate Unique UID (Format: iDEV<CountryAbbr>000001)
async function generateUID(country) {
    const countryAbbr = country.substring(0, 3).toUpperCase();
    const profilesRef = db.collection("profiles");
    const snapshot = await profilesRef.where("uid", ">=", `iDEV${countryAbbr}`).get();
    const nextNumber = snapshot.size + 1;
    return `iDEV${countryAbbr}${String(nextNumber).padStart(6, "0")}`;
}

document.getElementById("profileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get Form Data
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const location = document.getElementById("location").value;
    const country = document.getElementById("country").value;
    const hobbies = document.getElementById("hobbies").value.split(",").map(h => h.trim());
    const interests = document.getElementById("interests").value.split(",").map(i => i.trim());

    // Generate Unique UID
    const uid = await generateUID(country);
    if (!uid) return;

    // Save Profile to Firestore
    try {
        await db.collection("profiles").doc(uid).set({
            uid, name, age, location, country, hobbies, interests, approved: false
        });

        alert(`Profile Submitted! Your UID: ${uid}`);
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile. Check console for errors.");
    }
});

// Upload Images (Max 4, 1MB Each)
document.getElementById("imageUpload").addEventListener("change", async function (event) {
    const files = event.target.files;
    if (files.length > 4) {
        alert("You can upload a maximum of 4 images.");
        return;
    }

    for (let file of files) {
        if (file.size > 1048576) {
            alert("Each file must be 1MB or smaller.");
            return;
        }

        const storageRef = storage.ref(`profile_pictures/${file.name}`);
        await storageRef.put(file);
        console.log("Image uploaded:", file.name);
    }
});

// Approve Profile (Admin)
async function approveProfile(uid) {
    await db.collection("profiles").doc(uid).update({ approved: true });
    alert(`Profile ${uid} Approved!`);
}

// Handle User Chat Submission
document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const message = document.getElementById("chatMessage").value;
    document.getElementById("chatBox").innerHTML += `<p>User: ${message}</p>`;
    document.getElementById("chatMessage").value = "";
});

// Admin Chat Monitoring
function viewAllChats() {
    console.log("Admin viewing all chats...");
}*/
const GITHUB_REPO = "Ceodevcop/CTok";
const PROFILES_JSON = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/profiles.json`;

// Generate Unique UID
async function generateUID(country) {
    const countryAbbr = getCountryAbbreviation(country);
    if (!countryAbbr) {
        alert("Invalid country name!");
        return null;
    }

    const response = await fetch(PROFILES_JSON);
    const profiles = response.ok ? await response.json() : [];

    const filteredProfiles = profiles.filter(p => p.uid.startsWith(`iDEV${countryAbbr}`));
    const lastUID = filteredProfiles.length > 0 ? filteredProfiles[filteredProfiles.length - 1].uid : `iDEV${countryAbbr}000000`;

    const nextNumber = parseInt(lastUID.slice(-6)) + 1;
    if (nextNumber > 999999) {
        alert("UID limit reached for this country!");
        return null;
    }

    return `iDEV${countryAbbr}${String(nextNumber).padStart(6, "0")}`;
}

// Get Country Abbreviation
function getCountryAbbreviation(country) {
    const countryMap = {
        "United States": "USA", "India": "IND", "Nigeria": "NGA", "Canada": "CAN", "United Kingdom": "GBR",
        "France": "FRA", "Germany": "DEU", "Brazil": "BRA", "China": "CHN", "Japan": "JPN"
    };
    return countryMap[country] || null;
}

// Handle User Registration (Sandbox)
document.getElementById("profileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const location = document.getElementById("location").value;
    const country = document.getElementById("country").value;
    const hobbies = document.getElementById("hobbies").value.split(",").map(h => h.trim());
    const interests = document.getElementById("interests").value.split(",").map(i => i.trim());

    const uid = await generateUID(country);
    if (!uid) return;

    const profileData = { uid, name, age, location, country, hobbies, interests, approved: false };

    await saveProfileToGitHub(profileData);
    alert(`Profile submitted! Your UID is: ${uid}`);
});

// Save Profile to GitHub (Sandbox Mode)
async function saveProfileToGitHub(profileData) {
    console.log("Saving profile:", profileData);

    alert("Sandbox Mode: Profile saved locally. (No actual GitHub write support)");
}

// Handle Admin Approval
function approveProfile(uid) {
    console.log(`Admin approved: ${uid}`);
}

// Handle Image Upload (4 images max, 1MB each)
document.getElementById("imageUpload").addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 4) {
        alert("You can upload a maximum of 4 images.");
        return;
    }

    for (let file of files) {
        if (file.size > 1048576) {
            alert("Each file must be 1MB or smaller.");
            return;
        }
        console.log("Sandbox Mode: Image upload simulated for", file.name);
    }
});

