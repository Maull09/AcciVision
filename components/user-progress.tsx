import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UserProgressProps = {
  userName: string;
  profileImageSrc: string;
};

export const UserProgress = ({ userName, profileImageSrc }: UserProgressProps) => {
  return (
    <div className="flex w-full items-center justify-end px-6 py-4">
      <div className="flex items-center ">
        <Link href="/profile">
          <Button variant="ghost">
            <Image
              src={profileImageSrc || "/book_5221784.png"}
              alt={userName}
              className="rounded-md border"
              width={32}
              height={32}
            />
          </Button>
        </Link>
        <span className="font-semibold">{userName}</span>
      </div>
    </div>
  );
};
