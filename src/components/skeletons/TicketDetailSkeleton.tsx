import React from "react";

export const TicketDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-full" /> {/* Badge */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-7 w-3/4 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-50 rounded" />
              <div className="h-4 w-full bg-gray-50 rounded" />
              <div className="h-4 w-2/3 bg-gray-50 rounded" />
            </div>
            {/* Attachment Placeholder */}
            <div className="mt-6 h-64 w-full bg-gray-100 rounded-lg" />
          </div>

          {/* Conversation Thread Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            
            {/* Customer Message (Left) */}
            <div className="p-4 bg-gray-50 rounded-lg mr-8 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              <div className="h-4 w-full bg-gray-100 rounded" />
            </div>

            {/* Admin Message (Right) */}
            <div className="p-4 bg-blue-50/50 rounded-lg ml-8 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-blue-100 rounded" />
                <div className="h-3 w-16 bg-blue-100 rounded" />
              </div>
              <div className="h-4 w-full bg-blue-100 rounded" />
            </div>
          </div>

          {/* Reply Section Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-28 bg-gray-200 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded-lg" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Repeatable Sidebar Card */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-gray-100 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-12 bg-gray-50 rounded" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-gray-100 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-12 bg-gray-50 rounded" />
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};