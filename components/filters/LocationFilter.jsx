import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const locations = [
  "Navarro", 
  "Las marianas", 
  "Villa Moll", 
  "Almeyra", 
  "Lobos", 
  "Marcos Paz", 
  "General Las Heras", 
  "Mercedes"
];

export default function LocationFilter({ value = [], onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Selecciona la ubicación</h4>
        {value.length > 0 && (
          <button 
            type="button"
            onClick={onClear}
            className="text-brand-brown-600 p-1 h-7 hover:bg-brand-brown-50 text-xs rounded-md transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
        {locations.map((location) => (
          <div key={location} className="flex items-center space-x-2">
            <Checkbox 
              id={`location-${location}`} 
              checked={value.includes(location)}
              onCheckedChange={() => onChange(location)}
              className="border-brand-brown-300 text-brand-brown-600 data-[state=checked]:bg-brand-brown-500 data-[state=checked]:border-brand-brown-500 cursor-pointer"
            />
            <Label 
              htmlFor={`location-${location}`} 
              className="text-neutral-700 cursor-pointer hover:text-brand-brown-600 transition-colors text-sm"
              onClick={() => onChange(location)}
            >
              {location}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
} 