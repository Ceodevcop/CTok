// 🔥 Firebase Configuration (Ensure your API key is secured!)
const firebaseConfig = {
    apiKey: "YOUR_NEW_API_KEY",
    authDomain: "ctok-app.firebaseapp.com",
    projectId: "ctok-app",
    storageBucket: "ctok-app.appspot.com",
    messagingSenderId: "991407836421",
    appId: "1:991407836421:web:5f8c275e0168ba573ffb6c"
};

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

// Handle Profile Submission
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

    await db.collection("profiles").doc(uid).set(profileData);
    alert(`Profile Submitted! Your UID: ${uid}`);
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
}
