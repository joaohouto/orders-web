import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface StoreCardProps {
  name: string;
  icon: string;
  banner: string;
  slug: string;
}

export function StoreCard({ name, icon, banner, slug }: StoreCardProps) {
  return (
    <Link to={`/${slug}`}>
      <Card className="py-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center gap-4 px-4 py-3 pr-6">
          <img
            src={icon || "/placeholder.svg"}
            alt={`Logo da loja ${name}`}
            className="object-cover h-14 w-14 rounded-xl border bg-muted flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight">{name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">/{slug}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
