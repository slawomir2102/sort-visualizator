// nextui imports
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

// icons imports
import { MoonIcon, SunIcon } from "@nextui-org/shared-icons";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Ensure the theme is defined and provide a fallback
  const currentTheme = theme || "light";

  const changeTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <div>
      <Switch
        checked={currentTheme === "dark"}
        onChange={changeTheme}
        size="lg"
        color="primary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <SunIcon className={className} />
          ) : (
            <MoonIcon className={className} />
          )
        }
      />
    </div>
  );
}
