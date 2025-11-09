import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
const PORT = 4000;

app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
