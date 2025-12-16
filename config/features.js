/**
 * Feature Flags Configuration
 * Controla características temporales del sitio
 */

export const FEATURES = {
  holidayMode: {
    // Controlar con variable de entorno
    enabled: process.env.NEXT_PUBLIC_HOLIDAY_MODE === 'true',
    startDate: '2024-12-15',
    endDate: '2025-01-10',
    autoDisable: true, // Se desactiva automáticamente después de endDate
  }
}

/**
 * Helper para verificar si el modo festivo está activo
 * Considera tanto el flag enabled como las fechas de inicio/fin
 */
export const isHolidayModeActive = () => {
  const { enabled, startDate, endDate, autoDisable } = FEATURES.holidayMode;
  
  // Si no está habilitado, retornar false inmediatamente
  if (!enabled) return false;
  
  // Si no hay auto-disable, retornar el valor de enabled
  if (!autoDisable) return enabled;
  
  // Verificar si estamos dentro del rango de fechas
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return now >= start && now <= end;
};

/**
 * Configuración de elementos festivos
 */
export const HOLIDAY_CONFIG = {
  showBanner: true,       // Banner superior "Felices Fiestas"
  showSnowEffect: false,  // Efecto de nieve (puede afectar performance)
  showBadges: true,       // Badges en navbar y componentes
  showRibbons: true,      // Ribbons en property cards
  bannerMessage: "✨ Felices Fiestas 2025 | Encuentra tu hogar ideal para el nuevo año",
  bannerDismissible: true, // Usuario puede cerrar el banner
};
