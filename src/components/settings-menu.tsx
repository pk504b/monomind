import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function SettingsDialog() {
  const { setTheme, theme: currentTheme } = useTheme();
  const settings = useLiveQuery(() => dbMethods.getSettings(), []);
  const resolvedSettings = settings || dbMethods.seedSettings;

  const toggleIs12Hour = (val: boolean) => {
    dbMethods.updateSettings({ is12Hour: val });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="group fixed bottom-4 right-4"
        >
          <Settings className="group-hover:-rotate-30 transition-transform duration-300" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase text-muted-foreground">Theme</div>
            <div className="flex gap-2">
              <Button
                variant={currentTheme === "light" ? "default" : "secondary"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="size-4" />
                Light
              </Button>
              <Button
                variant={currentTheme === "dark" ? "default" : "secondary"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="size-4" />
                Dark
              </Button>
              <Button
                variant={currentTheme === "system" ? "default" : "secondary"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setTheme("system")}
              >
                <LaptopMinimal className="size-4" />
                System
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase text-muted-foreground">
              Time Format
            </div>
            <div className="flex gap-2">
              <Button
                variant={resolvedSettings.is12Hour ? "default" : "secondary"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => toggleIs12Hour(true)}
              >
                <SunMoon className="size-4" />
                12 Hour
              </Button>
              <Button
                variant={!resolvedSettings.is12Hour ? "default" : "secondary"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => toggleIs12Hour(false)}
              >
                <Timer className="size-4" />
                24 Hour
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <DialogClose asChild>
            <Button variant="secondary" size="sm">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
