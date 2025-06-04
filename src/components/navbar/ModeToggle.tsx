"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", icon: Sun, label: "Light mode" },
  { id: "system", icon: Monitor, label: "System mode" },
  { id: "dark", icon: Moon, label: "Dark mode" },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 p-1 rounded-full bg-muted w-fit">
        <div className="p-2 rounded-full">
          <div className="h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-3 p-1 rounded-full bg-muted shadow-inner dark:shadow-none w-fit relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {themes.map(({ id, icon: Icon, label }) => {
        const isSelected = theme === id;
        return (
          <motion.button
            key={id}
            onClick={() => setTheme(id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative p-2 rounded-full transition-colors text-muted-foreground hover:text-foreground"
            )}
            aria-label={label}
          >
            {isSelected && (
              <motion.div
                layoutId="modeToggleActive"
                className="absolute inset-0 rounded-full bg-background shadow-sm z-0"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon className="h-5 w-5 relative z-10" />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
