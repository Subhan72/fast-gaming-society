const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({
  origin: "http://localhost:5173",
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    // Handle POST request
    if (req.method === "POST") {
      const { email, content } = req.body;
      const mailOptions = {
        from: functions.config().gmail.email,
        to: email,
        subject: "Invitation to Fast Gaming Society",
        text: content,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.set("Access-Control-Allow-Origin", "http://localhost:5173");
          return res.status(500).send({
            success: false,
            error: error.toString(),
          });
        }
        res.set("Access-Control-Allow-Origin", "http://localhost:5173");
        return res.status(200).send({
          success: true,
          info: info.response,
        });
      });
    } else {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
      return res.status(405).send({ error: "Only POST requests are allowed" });
    }
  });
});
