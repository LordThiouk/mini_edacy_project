"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, UserIcon } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    })
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

  if (!user) {
    return null // Router will redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Package className="h-6 w-6 mr-2" />
          <span className="font-bold">ProductHub</span>
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
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">{user.name}</CardTitle>
              <CardDescription className="text-center">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ID Utilisateur</Label>
                <div className="p-2 rounded-md bg-muted text-sm font-mono">{user.id}</div>
              </div>
              <div className="space-y-2">
                <Label>Membre depuis</Label>
                <div className="p-2 rounded-md bg-muted">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/dashboard">
                <Button variant="outline">Retour au Dashboard</Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                Déconnexion
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2023 ProductHub. Tous droits réservés.</p>
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
