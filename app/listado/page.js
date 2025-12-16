import PropertyListing from '@/components/property-listing';
import SearchBar from '@/components/SearchBar';
import React from 'react';
import Head from 'next/head';

/**
 * Página de listado de propiedades en alquiler
 * Muestra todas las propiedades disponibles para alquiler
 */
const ListadoAlquilerPage = () => {
    return (
        <div className="min-h-screen bg-background overflow-visible pt-20">
            <Head>
                <title>Propiedades en Alquiler | MS Negocios Inmobiliarios</title>
                <meta name="description" content="Encuentra las mejores propiedades en alquiler en MS Negocios Inmobiliarios." />
            </Head>
            {/* Barra de búsqueda sin efectos especiales para listado */}
            <div className="container mx-auto px-6 relative z-50 mb-4 pt-4">
                <SearchBar minimal={true} />
            </div>
            {/* Espacio adicional para asegurar que las sugerencias tengan suficiente área para mostrarse */}
            <div className="h-8"></div>
            {/* Listado de propiedades con fondo y diseño minimalista */}
            <div className="container mx-auto px-6 relative z-10 bg-card border border-border shadow-minimalist rounded-xl">
                <PropertyListing initialListingType="rent" />
            </div>
        </div>
    );
};

export default ListadoAlquilerPage; 