import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const EMAILJS_SERVICE_ID = "service_oa0wyfi";
const EMAILJS_TEMPLATE_ID = "template_01kqoto";
const EMAILJS_PUBLIC_KEY = "REzB-c3NtiRv4DmKS";

app.post("/send-email", async (req, res) => {
  console.log("Body recibido:", req.body);

  // Extraer email y código del cuerpo (template_params)
  const email = req.body.template_params?.to_email;
  const code = req.body.template_params?.user_otp;

  if (!email || !code) {
    return res.status(400).json({ error: "Faltan campos to_email o user_otp en template_params" });
  }

  // Calcular tiempo de expiración (15 minutos más)
  const now = new Date();
  const expiration = new Date(now.getTime() + 15 * 60000);
  const time = expiration.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        origin: "http://localhost",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          passcode: code,
          time: time,
        },
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

