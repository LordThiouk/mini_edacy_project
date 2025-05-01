import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Création d'une connexion à la base de données Neon
export const sql = neon(process.env.DATABASE_URL!)

// Création d'une instance Drizzle pour des requêtes plus structurées
export const db = drizzle(sql)

// Fonction utilitaire pour générer des IDs uniques
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
