document.getElementById("connect-wallet").addEventListener("click", function() {
    const apiKey = "ku2pc1gatt21dvcucrjakhogw8mtvot8wrjmqylc4kutjcoihkbfcz4q0wivlz4h";
    alert("Connecting to Pi Wallet... API Key: " + apiKey);
    document.getElementById("wallet-status").innerText = "Wallet Connected!";
});
