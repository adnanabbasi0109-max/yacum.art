export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title skeleton */}
        <div className="animate-pulse mb-12">
          <div className="h-10 w-52 bg-bg-secondary rounded" />
        </div>

        {/* Tabs skeleton */}
        <div className="animate-pulse flex gap-1 border-b border-border-subtle mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-24 bg-bg-secondary rounded my-3 mx-2" />
          ))}
        </div>

        {/* Content area skeleton */}
        <div className="animate-pulse border border-border-subtle rounded-sm min-h-[300px] p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-bg-secondary rounded-full mb-6" />
            <div className="h-4 w-40 bg-bg-secondary rounded mb-3" />
            <div className="h-3 w-24 bg-bg-secondary rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
