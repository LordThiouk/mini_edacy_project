"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowLeft } from "lucide-react"
import { createProductAction } from "./actions"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Électronique",
  "Vêtements",
  "Maison",
  "Jardin",
  "Sports",
  "Jouets",
  "Alimentation",
  "Beauté",
  "Santé",
  "Autre",
]

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "1",
    category: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.name.trim()) throw new Error("Le nom du produit est requis")
      if (!formData.description.trim()) throw new Error("La description est requise")
      if (!formData.price.trim() || isNaN(Number(formData.price))) throw new Error("Prix invalide")
      if (!formData.stock.trim() || isNaN(Number(formData.stock))) throw new Error("Stock invalide")
      if (!formData.category) throw new Error("La catégorie est requise")

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
      }

      const newProduct = await createProductAction(productData)

      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      })

      router.push(`/products/${newProduct.id}`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer le produit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Connexion
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Inscription
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour aux produits
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nouveau produit</CardTitle>
              <CardDescription>Ajoutez un nouveau produit à votre catalogue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nom du produit"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description détaillée du produit"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (F CFA)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="1"
                      required
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Link href="/products">
                    <Button variant="outline" type="button">
                      Annuler
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Création en cours..." : "Créer le produit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
