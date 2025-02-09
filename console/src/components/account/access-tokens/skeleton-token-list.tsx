import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonTokenList() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4 py-3 px-4 text-sm font-medium text-gray-500 border-b">
        <div className="col-span-2">Name</div>
        <div className="col-span-3">Description</div>
        <div className="col-span-2">Created At</div>
        <div className="col-span-2">Last Used</div>
        <div className="col-span-3">Actions</div>
      </div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 py-4 px-4 items-center">
          <div className="col-span-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="col-span-3 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

