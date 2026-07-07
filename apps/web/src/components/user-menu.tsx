import { Link, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-8 w-24 border-neobrutalist shadow-neobrutalist rounded-none" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button className="border-neobrutalist shadow-neobrutalist hover-neobrutalist bg-neo-yellow text-black font-bold h-8 px-4 cursor-pointer rounded-none">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="border-neobrutalist shadow-neobrutalist hover-neobrutalist bg-white dark:bg-zinc-800 text-black dark:text-white font-bold h-8 w-8 p-0 cursor-pointer rounded-full" />
        }
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
          <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-zinc-900 text-black dark:text-white border-neobrutalist shadow-neobrutalist p-1 rounded-none min-w-[180px] mt-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-1.5 font-black text-xs select-none">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="h-0.5 bg-black my-1" />
          <DropdownMenuItem className="px-3 py-1.5 font-bold text-xs select-none text-gray-700 dark:text-zinc-300">{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer px-3 py-1.5 hover:bg-red-400 hover:text-black dark:hover:text-black font-bold text-xs select-none outline-none border-t border-black mt-1"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
