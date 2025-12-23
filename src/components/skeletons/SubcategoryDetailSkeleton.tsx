import React from "react";

export const SubcategoryDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" /> {/* Back Button */}
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded" /> {/* Title */}
            <div className="h-4 w-32 bg-gray-100 rounded" /> {/* Subtitle */}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" /> {/* Edit Button */}
          <div className="h-10 w-24 bg-gray-200 rounded-lg" /> {/* Delete Button */}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Image Card Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
            <div className="w-full aspect-square bg-gray-100 rounded-lg" />
          </div>

          {/* Stats Card Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-6 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded" /> {/* Name */}
            
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-100 rounded" /> {/* Description */}
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Parent Category Card */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded" />
                <div className="h-8 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};