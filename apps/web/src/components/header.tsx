import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import {Scale} from "lucide-react";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <div className="bg-amber-100 dark:bg-zinc-900 border-b-4 border-black py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">

        <Link to="/" className="text-xl font-black tracking-tighter text-black hover:no-underline flex items-center gap-2 select-none">
          <span className="bg-neo-yellow border-neobrutalist px-2 py-1 shadow-neobrutalist hover-neobrutalist inline-flex items-center gap-2">
            <Scale className="size-5 text-black" strokeWidth={2.5} />
            JUDGE_SYS
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {links.map(({ to, label }) => {
              return (
                <Link
                  key={to}
                  to={to}
                  className="font-bold text-black dark:text-white border-neobrutalist px-3.5 py-1 bg-white dark:bg-zinc-800 shadow-neobrutalist hover-neobrutalist active:translate-x-0 active:translate-y-0"
                  activeProps={{
                    className: "bg-neo-pink text-black dark:text-black"
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
