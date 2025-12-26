import React from 'react';

const PendingProductsSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 flex items-center gap-4 bg-white"
          style={{ borderColor: '#E5E7EB' }} // matching your lightgray
        >
          {/* Product Image Skeleton */}
          <div className="relative w-20 h-20 rounded-lg bg-gray-200 shrink-0" />

          {/* Product Details Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/3 bg-gray-200 rounded" /> {/* Product Name */}
            <div className="h-4 w-1/4 bg-gray-100 rounded" /> {/* Brand Name */}
            <div className="h-3 w-1/5 bg-gray-50 rounded mt-2" /> {/* Seller Info */}
            <div className="h-6 w-16 bg-gray-200 rounded mt-3" /> {/* Price */}
          </div>

          {/* Actions Skeleton */}
          <div className="flex gap-2">
            <div className="w-20 h-9 bg-gray-100 rounded-md" /> {/* View Button */}
            <div className="w-24 h-9 bg-gray-200 rounded-md" /> {/* Approve Button */}
            <div className="w-20 h-9 bg-gray-100 rounded-md" /> {/* Reject Button */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingProductsSkeleton;