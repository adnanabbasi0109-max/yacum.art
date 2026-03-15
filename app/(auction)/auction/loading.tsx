export default function AuctionLoading() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header skeleton */}
        <div className="animate-pulse mb-12">
          <div className="h-10 w-56 bg-bg-secondary rounded" />
          <div className="h-4 w-80 bg-bg-secondary rounded mt-4" />
        </div>

        {/* Grid of 2 auction skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse border border-border-subtle rounded-sm p-6"
            >
              <div className="aspect-[4/3] bg-bg-secondary rounded mb-6" />
              <div className="space-y-3">
                <div className="h-5 w-3/4 bg-bg-secondary rounded" />
                <div className="h-3 w-1/2 bg-bg-secondary rounded" />
                <div className="h-px bg-bg-secondary my-4" />
                <div className="flex justify-between">
                  <div className="h-6 w-28 bg-bg-secondary rounded" />
                  <div className="h-6 w-20 bg-bg-secondary rounded" />
                </div>
                <div className="h-10 w-full bg-bg-secondary rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
