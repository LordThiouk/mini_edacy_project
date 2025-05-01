"use server"

import { sql, generateId } from "./db"
import type { Product, ProductData } from "./types"
import { getCurrentUser } from "./auth"

export async function getAllProducts(): Promise<Product[]> {
  const products = await sql`SELECT * FROM "Product" ORDER BY "createdAt" DESC`
  return products as Product[]
}

export async function getProductsByUser(userId: string): Promise<Product[]> {
  const products = await sql`
    SELECT * FROM "Product" 
    WHERE "userId" = ${userId} 
    ORDER BY "createdAt" DESC
  `
  return products as Product[]
}

export async function getProductById(id: string): Promise<Product> {
  const products = await sql`SELECT * FROM "Product" WHERE id = ${id}`

  if (products.length === 0) {
    throw new Error("Produit non trouvé")
  }

  return products[0] as Product
}

export async function createProduct(data: ProductData): Promise<Product> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("Vous devez être connecté pour créer un produit")
  }

  const productId = generateId()
  const now = new Date()

  await sql`
    INSERT INTO "Product" (
      id, name, description, price, stock, category, "userId", "createdAt", "updatedAt"
    ) VALUES (
      ${productId}, ${data.name}, ${data.description}, ${data.price}, ${data.stock}, 
      ${data.category}, ${currentUser.id}, ${now}, ${now}
    )
  `

  const newProduct = await sql`SELECT * FROM "Product" WHERE id = ${productId}`
  return newProduct[0] as Product
}

export async function updateProduct(id: string, data: ProductData): Promise<Product> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("Vous devez être connecté pour modifier un produit")
  }

  // Vérifier si le produit existe et appartient à l'utilisateur
  const existingProducts = await sql`
    SELECT * FROM "Product" WHERE id = ${id}
  `

  if (existingProducts.length === 0) {
    throw new Error("Produit non trouvé")
  }

  const existingProduct = existingProducts[0]

  // Vérifier si l'utilisateur est le propriétaire
  if (existingProduct.userId !== currentUser.id) {
    throw new Error("Vous n'êtes pas autorisé à modifier ce produit")
  }

  const now = new Date()

  // Mettre à jour le produit
  await sql`
    UPDATE "Product" SET
      name = ${data.name},
      description = ${data.description},
      price = ${data.price},
      stock = ${data.stock},
      category = ${data.category},
      "updatedAt" = ${now}
    WHERE id = ${id}
  `

  const updatedProduct = await sql`SELECT * FROM "Product" WHERE id = ${id}`
  return updatedProduct[0] as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("Vous devez être connecté pour supprimer un produit")
  }

  // Vérifier si le produit existe et appartient à l'utilisateur
  const existingProducts = await sql`
    SELECT * FROM "Product" WHERE id = ${id}
  `

  if (existingProducts.length === 0) {
    throw new Error("Produit non trouvé")
  }

  const existingProduct = existingProducts[0]

  // Vérifier si l'utilisateur est le propriétaire
  if (existingProduct.userId !== currentUser.id) {
    throw new Error("Vous n'êtes pas autorisé à supprimer ce produit")
  }

  // Supprimer le produit
  await sql`DELETE FROM "Product" WHERE id = ${id}`
}
