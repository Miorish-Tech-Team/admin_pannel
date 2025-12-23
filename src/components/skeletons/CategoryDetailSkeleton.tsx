import React from "react";

export const CategoryDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full" /> {/* Back Button */}
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded" /> {/* Title */}
            <div className="h-4 w-32 bg-gray-100 rounded" /> {/* Subtitle */}
          </div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg" /> {/* Edit Button */}
      </div>

      {/* Main Category Card Skeleton */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-96 bg-gray-200" /> {/* Image Placeholder */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" /> {/* Label */}
            <div className="h-16 w-full bg-gray-100 rounded" /> {/* Description */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-8 w-12 bg-gray-100 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-8 w-12 bg-gray-100 rounded" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-40 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Subcategories Grid Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6" /> {/* Section Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4 space-y-3">
              <div className="w-full h-32 bg-gray-200 rounded-lg" /> {/* Sub Image */}
              <div className="h-5 w-3/4 bg-gray-200 rounded" /> {/* Sub Title */}
              <div className="h-10 w-full bg-gray-100 rounded" /> {/* Sub Desc */}
              <div className="h-3 w-20 bg-gray-100 rounded" /> {/* Sub Count */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};