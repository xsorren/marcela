import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange, minimal = false }) {
  if (totalPages <= 1) return null;
  
  const minimalStyles = minimal ? {
    container: "mt-16 flex justify-center items-center gap-3",
    button: "h-10 w-10 rounded-xl border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all duration-200",
    activeButton: "h-10 w-10 rounded-xl bg-brand-brown-500 text-white hover:bg-brand-brown-600 border-brand-brown-500",
    icon: "h-4 w-4 text-neutral-600"
  } : {
    container: "mt-12 flex justify-center items-center gap-2",
    button: "h-9 w-9 rounded-md border text-zinc-800 hover:bg-zinc-100",
    activeButton: "h-9 w-9 rounded-md bg-zinc-800 text-white",
    icon: "h-4 w-4"
  };

  return (
    <div className={minimalStyles.container}>
      {/* Botón Anterior */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${minimalStyles.button} ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
        aria-label="Página anterior"
      >
        <ChevronLeft className={minimalStyles.icon} />
      </Button>
      
      {/* Numeración de páginas */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i + 1)}
            className={
              currentPage === i + 1 
                ? minimalStyles.activeButton
                : minimalStyles.button
            }
            aria-label={`Página ${i + 1}`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      
      {/* Botón Siguiente */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${minimalStyles.button} ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
        aria-label="Página siguiente"
      >
        <ChevronRight className={minimalStyles.icon} />
      </Button>
    </div>
  );
} 