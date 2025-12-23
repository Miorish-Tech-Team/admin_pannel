import React from "react";

export const EditCategorySkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-48 bg-gray-200 rounded" /> {/* Title */}
        <div className="h-5 w-64 bg-gray-100 rounded" /> {/* Subtitle */}
      </div>

      {/* Form Card Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full space-y-6">
        
        {/* Input: Category Name */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-100 rounded-lg" />
        </div>

        {/* Textarea: Description */}
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-100 rounded-lg" />
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          {/* Large Upload Box */}
          <div className="w-full h-64 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center space-y-3">
             <div className="w-12 h-12 bg-gray-100 rounded-full" />
             <div className="h-4 w-40 bg-gray-100 rounded" />
             <div className="h-3 w-24 bg-gray-50 rounded" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <div className="h-11 w-28 bg-gray-200 rounded-lg" /> {/* Cancel */}
          <div className="h-11 w-40 bg-gray-200 rounded-lg" /> {/* Update */}
        </div>

      </div>
    </div>
  );
};