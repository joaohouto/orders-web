import { useParams } from "react-router";

export function StorePage() {
  const params = useParams();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full md:w-[720px] flex flex-col p-8 gap-4">
        <img className="w-full h-[200px] bg-muted rounded-xl" />

        <div className="flex items-center gap-4">
          <img src="" className="size-[100px] bg-muted rounded-xl" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Direito Aquidauana
          </h1>
        </div>
      </div>
    </div>
  );
}
