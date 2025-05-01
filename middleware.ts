import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes qui nécessitent une authentification
const protectedRoutes = ["/dashboard", "/profile", "/products/new"]

// Routes qui ne sont accessibles que pour les utilisateurs non authentifiés
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value
  const path = request.nextUrl.pathname

  // Vérifier si l'utilisateur tente d'accéder à une route protégée sans être authentifié
  if (protectedRoutes.some((route) => path.startsWith(route)) && !userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Vérifier si l'utilisateur tente d'accéder à une route d'authentification alors qu'il est déjà authentifié
  if (authRoutes.includes(path) && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si l'utilisateur tente d'accéder à une route d'édition ou de suppression de produit
  if (path.match(/\/products\/[^/]+\/(edit|delete)/) && !userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/products/new", "/products/:id/edit", "/login", "/register"],
}
