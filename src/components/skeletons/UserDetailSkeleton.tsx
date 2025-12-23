import React from "react";

export const UserDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-9 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* User Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-gray-50 rounded" />
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Section Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-50 rounded" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
                    <div className="h-3 w-12 bg-gray-50 rounded ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg space-y-3">
                  <div className="flex gap-2">
                     <div className="h-4 w-20 bg-gray-100 rounded" />
                     <div className="h-4 w-24 bg-gray-50 rounded" />
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded" />
                  <div className="h-3 w-2/3 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 border border-gray-100 rounded-lg space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  <div className="h-3 w-1/2 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};