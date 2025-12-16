import { Label } from "../ui/label";

export default function ExpensesFilter({ value = [0, 500], onChange, onClear }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-neutral-700">Rango de expensas (USD)</h4>
        {(value[0] > 0 || value[1] < 500) && (
          <button 
            type="button"
            onClick={onClear}
            className="text-brand-brown-600 p-1 h-7 hover:bg-brand-brown-50 text-xs rounded-md transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="px-2">
        <div className="relative pt-8 pb-8">
          <div className="absolute h-2 w-full bg-neutral-200 rounded-full mt-2"></div>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={value[0]}
            onChange={e => onChange([parseInt(e.target.value), value[1]])}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-brown-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
            style={{ zIndex: 10 }}
          />
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={value[1]}
            onChange={e => onChange([value[0], parseInt(e.target.value)])}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-brown-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
            style={{ zIndex: 11 }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="space-y-1">
          <Label className="text-neutral-500 text-xs">Mínimo</Label>
          <div className="text-neutral-700 font-medium">${value[0]}</div>
        </div>
        <div className="space-y-1">
          <Label className="text-neutral-500 text-xs">Máximo</Label>
          <div className="text-neutral-700 font-medium">${value[1]}</div>
        </div>
      </div>
    </div>
  );
} 