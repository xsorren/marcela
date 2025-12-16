export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white border-2 border-brand-brown-500 rounded-xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-brand-brown-50 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E8] via-white to-[#F5F0E8] animate-pulse"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Price (highlighted like actual card) */}
        <div className="h-6 bg-brand-brown-200 rounded-lg w-32"></div>
        
        {/* Location */}
        <div className="h-4 bg-neutral-200 rounded-lg w-1/2"></div>
        
        {/* Title */}
        <div className="h-5 bg-neutral-200 rounded-lg w-3/4"></div>
        
        {/* Features */}
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded w-full"></div>
          <div className="h-3 bg-neutral-100 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
} 