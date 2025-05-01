"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Product } from "@/lib/types"

export async function getProductByIdAction(id: string): Promise<{ product: Product | null; isOwner: boolean }> {
  try {
    const products = await sql`SELECT * FROM "Product" WHERE id = ${id}`

    if (products.length === 0) {
      return { product: null, isOwner: false }
    }

    const product = products[0] as Product

    // Vérifier si l'utilisateur actuel est le propriétaire
    const currentUser = await getCurrentUser()
    const isOwner = currentUser ? product.userId === currentUser.id : false

    return { product, isOwner }
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to load product")
  }
}

export async function deleteProductAction(id: string): Promise<void> {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      throw new Error("Vous devez être connecté pour supprimer un produit")
    }

    // Vérifier si le produit existe et appartient à l'utilisateur
    const products = await sql`SELECT * FROM "Product" WHERE id = ${id}`

    if (products.length === 0) {
      throw new Error("Produit non trouvé")
    }

    const product = products[0] as Product

    // Vérifier si l'utilisateur est le propriétaire
    if (product.userId !== currentUser.id) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce produit")
    }

    // Supprimer le produit
    await sql`DELETE FROM "Product" WHERE id = ${id}`
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
