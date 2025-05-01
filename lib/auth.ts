"use server"

import { cookies } from "next/headers"
import { sql } from "./db"
import { generateId } from "./db"
import type { LoginData, RegisterData, User } from "./types"

// Fonction pour hacher un mot de passe (dans un vrai projet, utilisez bcrypt)
function hashPassword(password: string): string {
  // Ceci est une simulation - dans un vrai projet, utilisez bcrypt ou argon2
  return password + "_hashed"
}

// Fonction pour vérifier un mot de passe (dans un vrai projet, utilisez bcrypt.compare)
function verifyPassword(password: string, hashedPassword: string): boolean {
  // Ceci est une simulation - dans un vrai projet, utilisez bcrypt.compare
  return hashedPassword === password + "_hashed"
}

export async function registerUser(data: RegisterData): Promise<User> {
  // Vérifier si l'email existe déjà
  const existingUser = await sql`SELECT * FROM "User" WHERE email = ${data.email}`

  if (existingUser.length > 0) {
    throw new Error("Cet email est déjà utilisé")
  }

  const userId = generateId()
  const hashedPassword = hashPassword(data.password)
  const now = new Date()

  // Créer le nouvel utilisateur
  await sql`
    INSERT INTO "User" (id, name, email, password, "createdAt", "updatedAt")
    VALUES (${userId}, ${data.name}, ${data.email}, ${hashedPassword}, ${now}, ${now})
  `

  // Récupérer l'utilisateur créé (sans le mot de passe)
  const newUser = await sql`SELECT id, name, email, "createdAt", "updatedAt" FROM "User" WHERE id = ${userId}`

  return newUser[0] as User
}

export async function loginUser(data: LoginData): Promise<User> {
  // Trouver l'utilisateur par email
  const users = await sql`SELECT * FROM "User" WHERE email = ${data.email}`

  if (users.length === 0) {
    throw new Error("Email ou mot de passe incorrect")
  }

  const user = users[0]

  // Vérifier le mot de passe
  if (!verifyPassword(data.password, user.password)) {
    throw new Error("Email ou mot de passe incorrect")
  }

  // Stocker l'ID de l'utilisateur dans un cookie
  cookies().set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semaine
    path: "/",
  })

  // Retourner l'utilisateur sans le mot de passe
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export async function logout(): Promise<void> {
  // Supprimer le cookie
  cookies().delete("userId")
}

export async function getCurrentUser(): Promise<User | null> {
  // Récupérer l'ID de l'utilisateur depuis le cookie
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  // Récupérer l'utilisateur depuis la base de données
  const users = await sql`
    SELECT id, name, email, "createdAt", "updatedAt" 
    FROM "User" 
    WHERE id = ${userId}
  `

  if (users.length === 0) {
    return null
  }

  return users[0] as User
}
