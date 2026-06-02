import { FeaturedStores } from "./components/featured-stores";
import { SiteFooter } from "@/components/footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1 bg-muted">
        <FeaturedStores />
      </main>
      <SiteFooter />
    </div>
  );
}
