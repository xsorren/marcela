"use client"

import { useState } from "react"

export default function FilterPanel({ filterId, isOpen, onClose }) {
  if (!isOpen) return null;

  const filterContent = {
    tipo: (
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
          <input type="checkbox" className="rounded-md border-brand-brown-300 text-brand-brown-500 focus:ring-brand-brown-500" />
          <span className="text-neutral-700 font-medium">Casa</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
          <input type="checkbox" className="rounded-md border-brand-brown-300 text-brand-brown-500 focus:ring-brand-brown-500" />
          <span className="text-neutral-700 font-medium">Departamento</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
          <input type="checkbox" className="rounded-md border-brand-brown-300 text-brand-brown-500 focus:ring-brand-brown-500" />
          <span className="text-neutral-700 font-medium">PH</span>
        </label>
      </div>
    ),
    // ... other filter contents
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-neutral-200 p-6 z-50">
      {filterContent[filterId]}
    </div>
  );
}
