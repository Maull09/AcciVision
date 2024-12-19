import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  auth,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Header = () => {
  const { userId } = auth();

  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b-2 border-slate-200 bg-white shadow-sm px-4">
      <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
        <Link href="/" className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/vehicle_16143676.png" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl font-extrabold tracking-wide text-blue-600">
            AcciVision
          </h1>
        </Link>

        <div className="flex gap-x-3">
        <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button size="lg" variant="ghost">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>          

        </div>
      </div>
    </header>
  );
};
