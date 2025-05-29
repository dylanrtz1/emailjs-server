const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const EMAILJS_SERVICE_ID = "service_oa0wyfi";
const EMAILJS_TEMPLATE_ID = "template_01kqoto";
const EMAILJS_PUBLIC_KEY = "REzB-c3NtiRv4DmKS";

app.post("/send-email", async (req, res) => {
  const { email, code } = req.body;

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "origin": "http://localhost",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        verification_code: code
      }
    }),
  });

  if (response.ok) {
    res.status(200).json({ message: "Correo enviado con éxito" });
  } else {
    const err = await response.text();
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
