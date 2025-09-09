import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <AlertOctagon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, you don&apos;t have permission to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
