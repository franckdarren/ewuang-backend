import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Middleware pour vérifier le JWT Supabase
const supabaseAuth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant" });
    }
    const token = authHeader.replace("Bearer ", "");

    // Récupère la clé publique de Supabase
    const client = jwksClient({
        jwksUri: `${process.env.SUPABASE_URL}/auth/v1/keys`
    });
    function getKey(header, callback) {
        client.getSigningKey(header.kid, function (err, key) {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token invalide" });
        }
        req.user = decoded;
        next();
    });
}

export { supabaseAuth };
