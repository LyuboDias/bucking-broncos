import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8 space-y-4">
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
        <div className="text-sm text-muted-foreground">
          If you were trying to create a new race, please try again or contact support.
        </div>
      </div>
    </div>
  )
}
