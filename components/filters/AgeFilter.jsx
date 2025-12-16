import { Button } from "../ui/button";

export default function AgeFilter({ value = "any", onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Opciones de antigüedad</h4>
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
          onClick={() => onChange("new")}
          className={`rounded-xl text-sm py-3 cursor-pointer transition-all duration-200 font-medium ${value === "new" 
            ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-md" 
            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 hover:border-brand-brown-300"}`}
        >
          Nueva construcción
        </Button>
        <Button 
          onClick={() => onChange("old")}
          className={`rounded-xl text-sm py-3 cursor-pointer transition-all duration-200 font-medium ${value === "old" 
            ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-md" 
            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 hover:border-brand-brown-300"}`}
        >
          Construcción antigua
        </Button>
      </div>
    </div>
  );
} 