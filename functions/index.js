const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

admin.initializeApp();

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password"
    }
});

// Twilio Configuration
const twilioClient = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");

// Admin Email
const adminEmail = "admin-email@gmail.com";

// Function to send email
exports.sendEmail = functions.https.onRequest(async (req, res) => {
    const { user, subject, message, type, amount } = req.body;

    const htmlMessage = `
        <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #007bff;">Pi-Store Notification</h2>
            <p>${message}</p>
            ${amount ? `<p><strong>Amount:</strong> ${amount} Pi</p>` : ""}
        </div>
    `;

    try {
        await transporter.sendMail({
            from: "Pi-Store <your-email@gmail.com>",
            to: user,
            subject: subject,
            html: htmlMessage
        });

        if (type === "transaction") {
            await transporter.sendMail({
                from: "Pi-Store <your-email@gmail.com>",
                to: adminEmail,
                subject: "New Transaction Alert",
                html: `<p>User: ${user} - Amount: ${amount} Pi</p>`
            });
        }

        res.status(200).send("Email Sent Successfully");
    } catch (error) {
        res.status(500).send("Email Failed: " + error.toString());
    }
});

// Function to send SMS
exports.sendSMS = functions.https.onRequest(async (req, res) => {
    const { phone, message } = req.body;

    try {
        await twilioClient.messages.create({
            body: message,
            from: "YOUR_TWILIO_PHONE_NUMBER",
            to: phone
        });
        res.status(200).send("SMS Sent Successfully");
    } catch (error) {
        res.status(500).send("SMS Failed: " + error.toString());
    }
});
