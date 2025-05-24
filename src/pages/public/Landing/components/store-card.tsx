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
      <Card className="py-2 px-8 pl-2 overflow-hidden transition-all hover:shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={icon || "/placeholder.svg"}
            alt={`Logo da loja ${name}`}
            className="object-cover h-20 w-20 rounded-xl border"
          />
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{slug}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
