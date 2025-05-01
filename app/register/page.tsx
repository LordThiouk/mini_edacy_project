"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { registerUser } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await registerUser(formData)
      router.push("/login?registered=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Package className="h-8 w-8 mr-2" />
            <span className="font-bold text-2xl">Edacy</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center">Entrez vos informations pour créer un compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            En vous inscrivant, vous acceptez nos{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Politique de confidentialité
            </Link>
            .
          </div>
          <div className="text-sm text-center">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
