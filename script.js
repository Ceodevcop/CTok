const GITHUB_REPO = "username/matchmaking-site";  
const GITHUB_TOKEN = "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";  

document.getElementById("profileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const location = document.getElementById("location").value;
    const hobbies = document.getElementById("hobbies").value.split(",").map(h => h.trim());
    const interests = document.getElementById("interests").value.split(",").map(i => i.trim());
    const files = document.getElementById("imageUpload").files;

    if (!name || !age || !location || files.length === 0) {
        alert("All fields and at least one image are required!");
        return;
    }

    let uploadedImageUrls = [];
    for (let i = 0; i < files.length; i++) {
        try {
            const url = await uploadImageToGitHub(files[i], i);
            uploadedImageUrls.push(url);
        } catch (error) {
            alert("Error uploading image " + (i + 1));
            return;
        }
    }

    const profileData = { name, age, location, hobbies, interests, images: uploadedImageUrls, approved: false };
    await saveProfileToGitHub(profileData);
    alert("Profile submitted for admin approval!");
});
