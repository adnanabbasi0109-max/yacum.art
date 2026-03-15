export default function ArtworkLoading() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image skeleton */}
          <div className="animate-pulse">
            <div className="aspect-[3/4] bg-bg-secondary rounded" />
          </div>

          {/* Right: Details skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-3/4 bg-bg-secondary rounded" />
            <div className="h-4 w-1/2 bg-bg-secondary rounded" />
            <div className="space-y-2 mt-8">
              <div className="h-3 w-full bg-bg-secondary rounded" />
              <div className="h-3 w-full bg-bg-secondary rounded" />
              <div className="h-3 w-2/3 bg-bg-secondary rounded" />
            </div>
            <div className="h-px bg-bg-secondary my-6" />
            <div className="h-6 w-32 bg-bg-secondary rounded" />
            <div className="flex gap-4 mt-6">
              <div className="h-12 flex-1 bg-bg-secondary rounded" />
              <div className="h-12 w-12 bg-bg-secondary rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
