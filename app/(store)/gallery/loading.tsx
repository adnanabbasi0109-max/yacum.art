export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Title skeleton */}
        <div className="animate-pulse mb-12">
          <div className="h-10 w-48 bg-bg-secondary rounded" />
          <div className="h-4 w-72 bg-bg-secondary rounded mt-4" />
        </div>

        {/* Filter bar skeleton */}
        <div className="animate-pulse flex gap-3 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-bg-secondary rounded-full" />
          ))}
        </div>

        {/* Grid of 6 skeleton cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-bg-secondary rounded" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 bg-bg-secondary rounded" />
                <div className="h-3 w-1/2 bg-bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
