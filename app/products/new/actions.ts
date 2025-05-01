"use server"

import { sql, generateId } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Product, ProductData } from "@/lib/types"

export async function createProductAction(data: ProductData): Promise<Product> {
  try {
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
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}
