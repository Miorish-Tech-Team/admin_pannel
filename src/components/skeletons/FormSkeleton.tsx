import React from "react";

export const FormSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse space-y-6">
      <div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};
