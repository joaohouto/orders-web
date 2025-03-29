import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useParams } from "react-router";

export function AppHeader({
  routes,
}: {
  routes: { path: string; title: string }[];
}) {
  const { storeSlug } = useParams();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {routes?.map((route, index) => (
              <>
                {index !== routes.length - 1 ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/app/${storeSlug}/${route.path}`}>
                        {route.title}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{route.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}

                {index !== routes.length - 1 && <BreadcrumbSeparator />}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
