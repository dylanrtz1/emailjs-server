const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const EMAILJS_SERVICE_ID = "service_oa0wyfi";
const EMAILJS_TEMPLATE_ID = "template_01kqoto";
const EMAILJS_PUBLIC_KEY = "REzB-c3NtiRv4DmKS";

app.post("/send-email", async (req, res) => {
  const { email, code } = req.body;

  // Calculamos la hora actual + 15 minutos
  const now = new Date();
  const expiration = new Date(now.getTime() + 15 * 60000);
  const time = expiration.toLocaleTimeString("es-ES", {
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
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
          user_email: email,
          passcode: code,
          time: time
        }
      }),
    });

    if (response.ok) {
      res.status(200).json({ message: "Correo enviado con éxito" });
    } else {
      const err = await response.text();
      res.status(500).json({ error: err });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

