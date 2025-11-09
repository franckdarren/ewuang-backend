import express from "express";
import cors from "cors";
// import userRoutes from "./routes/user.routes.js";
// import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/api/users", userRoutes);

// gestion des erreurs globales
// app.use(errorHandler);

export default app;
