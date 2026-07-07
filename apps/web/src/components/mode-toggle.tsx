import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button className="border-neobrutalist shadow-neobrutalist hover-neobrutalist bg-white dark:bg-zinc-800 text-black dark:text-white size-8 cursor-pointer rounded-none" />}>
        <div className="relative flex items-center justify-center size-full">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-black dark:text-white" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-black dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 text-black dark:text-white border-neobrutalist shadow-neobrutalist p-1 rounded-none min-w-[120px] mt-1">
        <DropdownMenuItem className="cursor-pointer px-3 py-1.5 hover:bg-neo-yellow dark:hover:bg-neo-yellow hover:text-black dark:hover:text-black font-bold text-xs select-none outline-none border-b border-black last:border-0" onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer px-3 py-1.5 hover:bg-neo-yellow dark:hover:bg-neo-yellow hover:text-black dark:hover:text-black font-bold text-xs select-none outline-none border-b border-black last:border-0" onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer px-3 py-1.5 hover:bg-neo-yellow dark:hover:bg-neo-yellow hover:text-black dark:hover:text-black font-bold text-xs select-none outline-none" onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
