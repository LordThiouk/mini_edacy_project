"use server"

import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Product, User } from "@/lib/types"

export async function getDashboardData(): Promise<{ user: User | null; products: Product[] }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { user: null, products: [] }
    }

    const products = await sql`
      SELECT * FROM "Product" 
      WHERE "userId" = ${user.id} 
      ORDER BY "createdAt" DESC
    `

    return {
      user,
      products: products as Product[],
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to load dashboard data")
  }
}
