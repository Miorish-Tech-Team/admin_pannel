"use client";

import { colors } from "@/utils/color";

export function WareHouseSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title */}
      <div className="space-y-2">
        <div
          className="h-8 w-64 rounded-md"
          style={{ backgroundColor: colors.lightgray }}
        />
        <div
          className="h-4 w-96 rounded-md"
          style={{ backgroundColor: colors.lightgray }}
        />
      </div>

      {/* Action bar */}
      <div className="flex justify-between items-center">
        <div
          className="h-4 w-40 rounded-md"
          style={{ backgroundColor: colors.lightgray }}
        />
        <div
          className="h-10 w-48 rounded-md"
          style={{ backgroundColor: colors.lightgray }}
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg border p-6 space-y-4"
            style={{ borderColor: colors.lightgray }}
          >
            {/* Card header */}
            <div className="space-y-2">
              <div
                className="h-5 w-2/3 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
              <div
                className="h-4 w-1/2 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
            </div>

            {/* Address lines */}
            <div className="space-y-2">
              <div
                className="h-4 w-full rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
              <div
                className="h-4 w-5/6 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
              <div
                className="h-4 w-3/4 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
            </div>

            {/* Phone */}
            <div
              className="h-4 w-1/3 rounded-md"
              style={{ backgroundColor: colors.lightgray }}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <div
                className="h-8 flex-1 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
              <div
                className="h-8 flex-1 rounded-md"
                style={{ backgroundColor: colors.lightgray }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
