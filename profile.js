const supabaseUrl = "https://db.cqrnlcrpnyyhxghqwpnm.supabase.co";
const supabaseKey = "YOUR_SUPABASE_KEY"; // Replace with your actual Supabase API Key

document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const bankName = document.getElementById("bankName").value;
    const accountNumber = document.getElementById("accountNumber").value;

    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
            full_name: fullName,
            phone: phone,
            bank_name: bankName,
            account_number: accountNumber
        })
    });

    if (response.ok) {
        alert("Profile saved successfully!");
    } else {
        alert("Error saving profile.");
    }
});
