import { Button } from "../ui/button";

const roomOptions = [1, 2, 3, 4, 5, "6+"];

export default function RoomsFilter({ value, onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Número de ambientes</h4>
        {value && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-brand-brown-500 p-1 h-7 hover:bg-brand-brown-50 cursor-pointer"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {roomOptions.map((num) => (
          <Button 
            key={num}
            onClick={() => onChange(num.toString())}
            className={`rounded-lg text-sm py-2 cursor-pointer transition-colors duration-200 border ${value === num.toString() 
              ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 border-brand-brown-500" 
              : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-brand-brown-300"}`}
          >
            {num} {num === 1 ? "ambiente" : "ambientes"}
          </Button>
        ))}
      </div>
    </div>
  );
}