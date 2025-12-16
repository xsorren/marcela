import { MapPin } from "lucide-react";

export default function MapboxSuggestions({ suggestions, onSelect, onClose }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: '100px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '600px',
        backgroundColor: 'white',
        border: '3px solid #D4AF37',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        zIndex: 999999,
        maxHeight: '350px',
        overflowY: 'auto',
        display: suggestions.length > 0 ? 'block' : 'none'
      }}
    >
      <div style={{ 
        backgroundColor: '#D4AF37', 
        color: 'white', 
        padding: '10px', 
        textAlign: 'center',
        position: 'relative',
        top: 0
      }}>
        {suggestions.length} {suggestions.length === 1 ? 'ubicación encontrada' : 'ubicaciones encontradas'}
      </div>
      <ul style={{ margin: 0, padding: 0 }}>
        {suggestions.map((suggestion) => (
          <li 
            key={suggestion.id}
            style={{ 
              padding: '12px 15px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: 'white'
            }}
            onClick={() => onSelect(suggestion)}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
          >
            <span style={{ marginRight: '10px', color: '#D4AF37', flexShrink: 0 }}>
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, color: '#333' }}>{suggestion.text}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                {suggestion.place_type === 'address' 
                  ? 'Dirección' 
                  : suggestion.place_type === 'place' 
                  ? 'Ciudad' 
                  : suggestion.place_type === 'neighborhood' 
                  ? 'Barrio' 
                  : suggestion.place_type}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '8px', 
        textAlign: 'center' 
      }}>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '5px 10px'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
          onMouseOut={e => e.currentTarget.style.color = '#666'}
        >
          Cerrar sugerencias
        </button>
      </div>
    </div>
  );
} 