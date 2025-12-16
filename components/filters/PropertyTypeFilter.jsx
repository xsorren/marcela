import { Button } from "../ui/button";

const propertyTypes = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Departamento" },
  { value: "land", label: "Terreno" },
  { value: "office", label: "Oficina" },
  { value: "commercial", label: "Local Comercial" },
  { value: "country_house", label: "Casa de Country" }
];

export default function PropertyTypeFilter({ value, onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Tipo de propiedad</h4>
        {value && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-brand-green-500 p-1 h-7 hover:bg-brand-green-50 cursor-pointer"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {propertyTypes.map((type) => (
          <Button 
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`rounded-lg text-sm py-2 cursor-pointer transition-colors duration-200 border ${value === type.value 
              ? "bg-brand-green-500 text-white hover:bg-brand-green-600 border-brand-green-500" 
              : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-brand-green-300"}`}
          >
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
}