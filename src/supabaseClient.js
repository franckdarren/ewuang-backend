// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321' // ton instance locale
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'ton_anon_key_local' // clé trouvée dans supabase/.env.local

export const supabase = createClient(supabaseUrl, supabaseKey)
