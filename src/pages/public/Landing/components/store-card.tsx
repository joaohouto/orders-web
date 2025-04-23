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
      <Card className="p-0 overflow-hidden transition-all hover:shadow-lg">
        <img
          src={banner || "/placeholder.svg"}
          alt={`Banner da loja ${name}`}
          className="object-cover h-32 w-full"
        />
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-3">
            <img
              src={icon || "/placeholder.svg"}
              alt={`Logo da loja ${name}`}
              className="object-cover h-20 w-20 rounded-full border-4 border-background -mt-16"
            />
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{slug}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
