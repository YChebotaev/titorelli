export function BotListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
        <div className="bg-white">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex space-x-4 p-4 border-b border-gray-200 last:border-b-0"
            >
              {[...Array(7)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-10 bg-gray-200 rounded animate-pulse flex-1"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
