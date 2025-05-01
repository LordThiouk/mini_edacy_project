import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, ShieldCheck, Users } from "lucide-react"

export default function Home() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Connexion
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Inscription
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Gérez votre inventaire de produits
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Une plateforme simple et efficace pour gérer vos produits. Créez, visualisez, modifiez et supprimez
                    vos produits en toute simplicité.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1">
                      Commencer maintenant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg" variant="outline">
                      Voir les produits
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Product Management"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=550&width=750"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Fonctionnalités</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tout ce dont vous avez besoin pour gérer efficacement vos produits
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Gestion de produits</h3>
                <p className="text-muted-foreground">
                  Créez, visualisez, modifiez et supprimez vos produits en quelques clics.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Gestion des utilisateurs</h3>
                <p className="text-muted-foreground">
                  Système d'authentification sécurisé pour gérer vos utilisateurs.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Sécurité</h3>
                <p className="text-muted-foreground">
                  Protection des données et authentification sécurisée pour vos utilisateurs.
                </p>
              </div>
            </div>
          </div>
        </section>
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
