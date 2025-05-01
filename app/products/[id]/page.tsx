"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Edit, Trash2, ArrowLeft } from "lucide-react"
import { getProductByIdAction, deleteProductAction } from "./actions"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const { product, isOwner } = await getProductByIdAction(params.id)
        setProduct(product)
        setIsOwner(isOwner)
      } catch (error) {
        console.error("Error loading product:", error)
        setError("Impossible de charger les détails du produit")
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du produit",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id, toast])

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      return
    }

    setDeleting(true)
    try {
      await deleteProductAction(params.id)
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      })
      router.push("/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Chargement du produit...</p>
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

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Produit non trouvé</CardTitle>
            <CardDescription>Le produit que vous recherchez n'existe pas ou a été supprimé.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/products">
              <Button>Retour aux produits</Button>
            </Link>
          </CardFooter>
        </Card>
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Connexion
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Inscription
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour aux produits
            </Link>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription className="text-lg">{product.price} F CFA</CardDescription>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Catégorie</h3>
                  <p className="text-muted-foreground">{product.category}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Stock</h3>
                  <p className="text-muted-foreground">{product.stock} unités</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Ajouté le {new Date(product.createdAt).toLocaleDateString()}
              </div>
              {product.updatedAt !== product.createdAt && (
                <div className="text-sm text-muted-foreground">
                  Mis à jour le {new Date(product.updatedAt).toLocaleDateString()}
                </div>
              )}
            </CardFooter>
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
