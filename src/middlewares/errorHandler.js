export function errorHandler(err, req, res, next) {
    if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
    }

    if (err.code === "P2002") {
        // Erreur Prisma : champ unique
        return res.status(409).json({ error: "Email déjà utilisé" });
    }

    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
}
