import { Button } from "../ui/button";

export default function GarageFilter({ value = "any", onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Opciones de cochera</h4>
        {value !== "any" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-brand-brown-600 p-1 h-7 hover:bg-brand-brown-50 cursor-pointer rounded-md"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => onChange("yes")}
          className={`rounded-xl text-sm py-3 cursor-pointer transition-all duration-200 font-medium ${value === "yes" 
            ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-md" 
            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 hover:border-brand-brown-300"}`}
        >
          Con cochera
        </Button>
        <Button 
          onClick={() => onChange("no")}
          className={`rounded-xl text-sm py-3 cursor-pointer transition-all duration-200 font-medium ${value === "no" 
            ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-md" 
            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 hover:border-brand-brown-300"}`}
        >
          Sin cochera
        </Button>
      </div>
    </div>
  );
} 