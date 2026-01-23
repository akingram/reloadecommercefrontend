export const SkeletonProductCard = ({ viewMode = "grid" }) => (
  <div
    className={`overflow-hidden rounded-lg bg-card shadow-card animate-pulse ${
      viewMode === "list" ? "flex flex-row" : ""
    }`}
  >
    <div
      className={`relative ${viewMode === "list" ? "w-1/3 h-48" : "h-64"} bg-muted`}
    />
    <div
      className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}
    >
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
      <div
        className={`flex items-center ${
          viewMode === "list" ? "justify-between mt-4" : "justify-between mt-2"
        }`}
      >
        <div className="h-4 bg-muted rounded w-20" />
        <div className="h-8 bg-muted rounded w-16" />
      </div>
    </div>
  </div>
);

// Reuse SkeletonCollectionCard and SkeletonCategoryCard from Home.jsx if needed
export const SkeletonCollectionCard = () => (
  <div className="overflow-hidden rounded-lg bg-card shadow-card animate-pulse">
    <div className="relative h-64 bg-muted" />
    <div className="absolute bottom-4 left-4">
      <div className="h-4 bg-muted rounded w-32 mb-2" />
      <div className="h-3 bg-muted rounded w-16" />
    </div>
  </div>
);

export const SkeletonCategoryCard = () => (
  <div className="text-center animate-pulse">
    <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 bg-muted" />
    <div className="h-4 bg-muted rounded w-20 mx-auto mb-1" />
    <div className="h-3 bg-muted rounded w-16 mx-auto" />
  </div>
);