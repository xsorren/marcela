import PropertyListing from '@/components/property-listing';
import SearchBar from '@/components/SearchBar';
import React from 'react';

const Page = () => {
    return (
        <div className="min-h-screen bg-background overflow-visible">
            <div className="relative z-50 mb-16">
                <SearchBar />
            </div>
            <div className="h-16"></div>
            <div className="relative z-10 bg-[#2c2c2c]">
                <PropertyListing initialListingType="sale" />
            </div>
        </div>
    );
};

export default Page;