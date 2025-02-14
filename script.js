// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const GITHUB_REPO = "Ceodevcop/CTok";

// Generate Unique UID (iDEV<CountryAbbr>000001)
async function generateUID(country) {
    const countryAbbr = getCountryAbbreviation(country);
    if (!countryAbbr) {
        alert("Invalid country name!");
        return null;
    }

    // Fetch existing profiles from GitHub
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/profiles.json`);
    const profiles = response.ok ? await response.json() : [];

    // Find the last UID used for this country
    const filteredProfiles = profiles.filter(p => p.uid.startsWith(`iDEV${countryAbbr}`));
    const lastUID = filteredProfiles.length > 0 ? filteredProfiles[filteredProfiles.length - 1].uid : `iDEV${countryAbbr}000000`;

    // Generate next UID
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

// Handle User Registration
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

    // Save to Firebase Firestore
    await db.collection("profiles").doc(uid).set(profileData);
    
    // Update GitHub (Placeholder)
    await saveProfileToGitHub(profileData);

    alert(`Profile submitted! Your UID is: ${uid}`);
});

// Save Profile to GitHub (GitHub API Authentication Required)
async function saveProfileToGitHub(profileData) {
    console.log("Saving profile to GitHub (placeholder function):", profileData);
}

// Handle Admin Approval
async function approveProfile(uid) {
    await db.collection("profiles").doc(uid).update({ approved: true });
    alert(`Profile ${uid} Approved!`);
}

// Chat System
document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const message = document.getElementById("chatMessage").value;
    document.getElementById("chatBox").innerHTML += `<p>User: ${message}</p>`;
    document.getElementById("chatMessage").value = "";
});

// Admin Chat Monitoring
function viewAllChats() {
    console.log("Admin viewing all chats...");
}

// Handle Image Upload (Max 4 images, 1MB each)
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
