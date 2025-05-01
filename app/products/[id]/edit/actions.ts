"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Product, ProductData } from "@/lib/types"

export async function getProductForEditAction(id: string): Promise<Product> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      throw new Error("Vous devez être connecté pour modifier un produit")
    }

    const products = await sql`SELECT * FROM "Product" WHERE id = ${id}`

    if (products.length === 0) {
      throw new Error("Produit non trouvé")
    }

    const product = products[0] as Product

    // Vérifier si l'utilisateur est le propriétaire
    if (product.userId !== currentUser.id) {
      throw new Error("Vous n'êtes pas autorisé à modifier ce produit")
    }

    return product
  } catch (error) {
    console.error("Error fetching product for edit:", error)
    throw error
  }
}

export async function updateProductAction(id: string, data: ProductData): Promise<Product> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      throw new Error("Vous devez être connecté pour modifier un produit")
    }

    // Vérifier si le produit existe et appartient à l'utilisateur
    const existingProducts = await sql`SELECT * FROM "Product" WHERE id = ${id}`

    if (existingProducts.length === 0) {
      throw new Error("Produit non trouvé")
    }

    const existingProduct = existingProducts[0] as Product

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
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}
