export function Skeleton({ className = '', height, width, circle = false }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/90 dark:bg-slate-700/50 ${
        circle ? 'rounded-full' : 'rounded-xl'
      } ${className}`}
      style={{
        height: height || undefined,
        width: width || undefined,
      }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3.5 bg-slate-200/90 rounded-md animate-pulse ${
            i === lines - 1 ? 'w-3/5' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-24"></div>
        <div className="w-8 h-8 rounded-xl bg-slate-200"></div>
      </div>
      <div className="h-7 bg-slate-200 rounded-lg w-28"></div>
      <div className="h-3 bg-slate-200 rounded w-36"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded-md flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 py-3.5 px-3 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-4 bg-slate-100 rounded-md ${
                  c === 0 ? 'w-32' : c === 1 ? 'w-24' : 'flex-1'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-36 rounded-2xl bg-slate-200/80 w-full" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <div className="h-5 bg-slate-200 rounded w-48"></div>
          <div className="h-48 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-72 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <div className="h-5 bg-slate-200 rounded w-36"></div>
          <div className="h-48 bg-slate-100 rounded-full mx-auto w-48"></div>
        </div>
      </div>
    </div>
  );
}
