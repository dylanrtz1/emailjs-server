import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import moment from "moment-timezone";  // ✅ Agregado para manejar zonas horarias correctamente

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
  const code = req.body.template_params?.passcode;  // ✅ Verifica que realmente se envía `passcode`

  console.log("Email recibido antes de enviar a EmailJS:", email);

  if (!email || !code) {
    console.log("Error: Faltan campos to_email o passcode");
    return res.status(400).json({ error: "Faltan campos to_email o passcode en template_params" });
  }

  // ✅ Obtener la hora actual en Ecuador y sumar 15 minutos
  const now = moment().tz("America/Guayaquil");
  const expirationTime = now.add(15, "minutes").format("HH:mm");  // ✅ Ajuste correcto de la hora de expiración

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
          expiration_time: expirationTime  // ✅ Ahora la hora enviada es correcta
        },
      }),
    });

    const responseText = await response.text();
    console.log("Respuesta de EmailJS:", responseText);

    if (response.ok) {
      res.status(200).json({ message: "Correo enviado con éxito", expiration_time: expirationTime });
    } else {
      res.status(500).json({ error: responseText });
    }
  } catch (error) {
    console.log("Error en la solicitud a EmailJS:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

