import React from "react";

export const EditProductSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" /> {/* Back Button */}
        <div className="space-y-2">
          <div className="h-9 w-48 bg-gray-200 rounded" /> {/* Title */}
          <div className="h-4 w-32 bg-gray-100 rounded" /> {/* Subtitle */}
        </div>
      </div>

      <div className="space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="h-7 w-40 bg-gray-200 rounded mb-4" /> {/* Section Title */}
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-100 rounded" /> {/* Name Input */}
            <div className="h-24 w-full bg-gray-100 rounded" /> {/* Textarea */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        {/* Card 2: Category Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="h-7 w-56 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
          {/* Detail Preview Placeholder */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
             <div className="h-4 w-1/3 bg-gray-200 rounded" />
             <div className="h-4 w-2/3 bg-gray-200 rounded" />
             <div className="w-32 h-32 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Card 3: Pricing Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="h-7 w-32 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>

        {/* Card 4: Images Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="flex gap-4">
             <div className="w-48 h-48 bg-gray-200 rounded-lg" /> {/* Cover Image */}
             <div className="flex-1 space-y-2 py-2">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-50 rounded" />
             </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
};