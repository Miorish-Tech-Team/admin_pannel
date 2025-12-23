import React from "react";

export const ProductDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" /> {/* Back button */}
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded" /> {/* Title */}
            <div className="h-4 w-32 bg-gray-100 rounded" /> {/* Product Code */}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" /> {/* Edit btn */}
          <div className="h-10 w-24 bg-gray-200 rounded-lg" /> {/* Delete btn */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="w-full aspect-square bg-gray-100 rounded-lg" />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-gray-100 rounded-lg" />
              <div className="aspect-square bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-5 w-1/4 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-50 rounded" />
              <div className="h-4 w-5/6 bg-gray-50 rounded" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};