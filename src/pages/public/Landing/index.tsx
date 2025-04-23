import { FeaturedStores } from "./components/featured-stores";
import { SiteFooter } from "./components/footer";
import { Header } from "@/components/header";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <FeaturedStores />
      </main>
      <SiteFooter />
    </div>
  );
}
