import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleXIcon } from "lucide-react";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export function SortableImage({ field, index, form, remove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FormField
        control={form.control}
        name={`images.${index}`}
        render={({ field }) => (
          <FormItem>
            <div className="relative w-fit">
              <img
                src={field.value}
                className="size-[100px] border rounded-md object-contain"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="absolute right-0 top-0"
              >
                <CircleXIcon />
              </Button>
            </div>
            <FormControl>
              <Input className="hidden" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
