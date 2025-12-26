import React from 'react';

const SupportTicketsSkeleton = ({ rows = 5 }) => {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full">
        {/* Table Header Skeleton */}
        <thead className="bg-gray-100">
          <tr>
            {["Ticket #", "Seller", "Subject", "Status", "Created", "Messages", "Actions"].map((header) => (
              <th key={header} className="px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body Skeleton */}
        <tbody className="divide-y divide-gray-100">
          {[...Array(rows)].map((_, i) => (
            <tr key={i}>
              {/* Ticket # */}
              <td className="px-6 py-4">
                <div className="h-5 w-12 bg-gray-200 rounded" />
              </td>

              {/* Seller */}
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
              </td>

              {/* Subject & Description */}
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-64 bg-gray-100 rounded" />
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </td>

              {/* Created */}
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </td>

              {/* Messages */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full" />
                  <div className="h-4 w-4 bg-gray-100 rounded" />
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="h-8 w-20 bg-gray-200 rounded-lg" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTicketsSkeleton;