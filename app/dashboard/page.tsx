"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Plus, Settings, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { getDashboardData } from "./actions"
import type { Product, User } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardData()

        if (!data.user) {
          router.push("/login")
          return
        }

        setUser(data.user)
        setProducts(data.products)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setError("Une erreur est survenue lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Package className="h-6 w-6 mr-2" />
          <span className="font-bold">Edacy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/products">
            Produits
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Déconnexion
          </Button>
        </nav>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Bienvenue, {user?.name}! Gérez vos produits et votre compte.</p>
            </div>
            <Link href="/products/new">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Nouveau produit
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Vos produits</CardTitle>
                <CardDescription>
                  Vous avez {products.length} produit{products.length !== 1 ? "s" : ""} dans votre catalogue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">{products.length}</span>
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      Voir tous
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Profil</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Produits récents</h2>
            {products.length === 0 ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore de produits</p>
                <Link href="/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un produit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 3).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <CardDescription>{product.price} F CFA</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 Edacy. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Conditions d'utilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  )
}
