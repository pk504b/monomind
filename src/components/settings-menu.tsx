import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LaptopMinimal,
  Moon,
  Settings,
  Sun,
  SunMoon,
  Timer,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { dbMethods, useLiveQuery } from "@/lib/db";

export default function SettingsMenu() {
  const { setTheme } = useTheme();
  const settings = useLiveQuery(() => dbMethods.getSettings(), []);
  const resolvedSettings = settings || dbMethods.seedSettings;

  const toggleIs12Hour = (val: boolean) => {
    dbMethods.updateSettings({ is12Hour: val });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="group fixed bottom-4 right-4 "
        >
          <Settings className="group-hover:-rotate-30 transition-transform duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground select-none">
            Settings
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className={
                    resolvedSettings.theme === "light" ? "bg-accent" : ""
                  }
                >
                  <Sun />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className={
                    resolvedSettings.theme === "dark" ? "bg-accent" : ""
                  }
                >
                  <Moon />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className={
                    resolvedSettings.theme === "system" ? "bg-accent" : ""
                  }
                >
                  <LaptopMinimal />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Clock</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => toggleIs12Hour(true)}
                  className={resolvedSettings.is12Hour ? "bg-accent" : ""}
                >
                  <SunMoon />
                  12 Hour
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toggleIs12Hour(false)}
                  className={!resolvedSettings.is12Hour ? "bg-accent" : ""}
                >
                  <Timer />
                  24 Hour
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
