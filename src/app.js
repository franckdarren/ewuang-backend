import express from "express";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { supabase } from './supabaseClient.js'
import cors from "cors";
import { prisma } from './prismaClient.js'

const app = express();


// ==========================
// MiddlewareS
// ==========================

app.use(cors()); // CORS
app.use(express.json()); // JSON
app.use(errorHandler); // Gestion des erreurs globales
app.use(cors({
    origin: "*", // Autorise toutes les origines (à restreindre en production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


// ==========================
// ROUTES
// ==========================


/**
 * 🧾 INSCRIPTION
 */
app.post("/signup", async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        // Étape 1 : création du compte Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) return res.status(400).json({ error: authError.message });

        const authUser = authData.user;

        // Étape 2 : enregistrement du profil utilisateur dans ta BDD
        const user = await prisma.users.create({
            data: {
                auth_id: authUser.id,  // assure-toi que la colonne existe dans ta table
                email,
                name,
                role,
                solde: 0,
            },
        });

        return res.json({
            message: "Utilisateur créé avec succès",
            user: {
                ...user,
                id: user.id.toString()   // Convertit le BigInt en string
            },
        });
    } catch (err) {
        // ← ici tu remplaces ton ancien catch
        console.error("Erreur signup :", err);
        return res.status(500).json({ error: err.message || "Erreur interne du serveur" });
    }
});


/**
 * 🔐 CONNEXION
 */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(401).json({ error: error.message });

    // Récupérer l'utilisateur dans ta table via Prisma
    const user = await prisma.users.findUnique({
        where: { email },
    });

    if (!user)
        return res
            .status(404)
            .json({ error: "Utilisateur non trouvé dans la base locale" });

    res.json({
        message: "Connexion réussie",
        user,
        access_token: data.session.access_token,
    });
});

/**
 * 🧠 MIDDLEWARE DE VÉRIFICATION DU TOKEN
 */
const verifyAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user)
        return res.status(401).json({ error: "Token invalide" });

    req.authUser = data.user;
    next();
};

/**
 * 👤 PROFIL (ROUTE PROTÉGÉE)
 */
app.get("/profile", verifyAuth, async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { auth_id: req.authUser.id },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    res.json({ user });
});


app.post("/logout", async (req, res) => { // Déconnexion
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Déconnexion réussie" });
});




export default app;
