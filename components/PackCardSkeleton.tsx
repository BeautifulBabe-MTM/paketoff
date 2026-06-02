export default function PackCardSkeleton() {
  return (
    <div className="animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-xl h-64 w-full">
       <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-t-xl" />
       <div className="p-4 space-y-2">
         <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
         <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
       </div>
    </div>
  )
}