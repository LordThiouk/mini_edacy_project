"use server"

import { sql } from "@/lib/db"
import type { Product } from "@/lib/types"

export async function getAllProductsAction(): Promise<Product[]> {
  try {
    const products = await sql`SELECT * FROM "Product" ORDER BY "createdAt" DESC`
    return products as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to load products")
  }
}
