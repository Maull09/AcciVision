import Link from "next/link";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 flex flex-col items-center justify-between border-b-2 bg-white py-3 text-neutral-500 lg:flex-row lg:px-10">
      {/* Title */}
      <h1 className="text-xl font-extrabold tracking-wide text-blue-600">AcciVision</h1>

      {/* Navigation */}
      <nav className="mt-3 flex space-x-6 lg:mt-0">
        <Link href="/home" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Home
        </Link>
        <Link href="/map" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Map
        </Link>
        <Link href="/monitoring" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Monitoring
        </Link>
        <Link href="/reporting" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Reporting
        </Link>
        <Link href="/accident" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Accident
        </Link>
        <Link href="/notification" className="text-base font-medium text-blue-500 hover:text-blue-700">
          Notifications
        </Link>
      </nav>

      {/* User Menu */}
      <div className="mt-3 lg:mt-0">
        <ClerkLoading>
          <Loader className="h-6 w-6 animate-spin text-blue-500" />
        </ClerkLoading>

        <ClerkLoaded>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
};
