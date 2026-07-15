"use client";

import useUser from "@/hooks/useUser";
import Avatar from "../ui/Avatar";
import LinkButtons from "../user/LinkButtons";
import Link from "next/link";

type Props = {
  username: string;
  slug: string;
};

export default function PostUserProfile({ username, slug }: Props) {
  const { userProfile } = useUser(slug);

  return (
    <div className="mt-3">
      {userProfile && (
        <div className="p-10 flex gap-6 items-center justify-center">
          <Link
            href={`/${slug}`}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar
              imageUrl={userProfile?.image}
              username={username}
              type="xl"
            />
            <p className="font-semibold hover:underline cursor-pointer">
              {username}
            </p>
          </Link>
          {userProfile?.links && <LinkButtons links={userProfile?.links} />}
        </div>
      )}
    </div>
  );
}
