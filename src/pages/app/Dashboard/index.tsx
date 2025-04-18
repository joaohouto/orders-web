import { AppHeader } from "@/components/app-header";

export function DashboardPage() {
  return (
    <>
      <AppHeader routes={[{ path: "", title: "Painel" }]} />

      <div className="w-full md:max-w-[600px] mx-auto p-8">
        <img src="https://i.gifer.com/oNR.gif" />
      </div>
    </>
  );
}
