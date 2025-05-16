import { cn } from "@/lib/utils"

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <header
      className={cn(
        `flex items-center justify-center p-4 bg-white shadow-xs border-b-1 fixed top-0 left-0 w-full z-10`,
        className,
      )}
    >
      <h1 className="text-3xl font-black text-amber-400 ">Alliance Book</h1>
    </header>
  )
}
