import { useNavigate, useParams } from "react-router-dom";
import ArrowLeftIcon from "@/assets/icons/icon-arrow-left.svg?react";
import FontSerifIcon from "@/assets/icons/icon-font-serif.svg?react";
import FontSansSerifIcon from "@/assets/icons/icon-font-sans-serif.svg?react";
import FontMonoIcon from "@/assets/icons/icon-font-monospace.svg?react";
import LightIcon from "@/assets/icons/icon-sun.svg?react";
import DarkIcon from "@/assets/icons/icon-moon.svg?react";
import SystemIcon from "@/assets/icons/icon-system-theme.svg?react";
import { useSettingsStore, type Font, type Theme } from "@/stores/settingsStore";
import { useState } from "react";

const SettingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setting } = useParams<{ setting: string }>();
  const { theme, font, setTheme, setFont } = useSettingsStore();

  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);
  const [selectedFont, setSelectedFont] = useState<Font>(font);

  const themeOptions: { title: Theme; subtitle: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { title: "Light", subtitle: "Pick a clean and classic light theme.", Icon: LightIcon },
    { title: "Dark", subtitle: "Select a sleek and modern dark theme.", Icon: DarkIcon },
    { title: "System", subtitle: "Adapts to your device's theme.", Icon: SystemIcon },
  ];

  const fontOptions: { title: Font; subtitle: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { title: "Sans-serif", subtitle: "Clean and modern, easy to use.", Icon: FontSansSerifIcon },
    { title: "Serif", subtitle: "Classic and elegant for a timeless feel.", Icon: FontSerifIcon },
    { title: "Monospace", subtitle: "Code-like, great for a technical vibe.", Icon: FontMonoIcon },
  ];

  const isTheme = setting === "theme";
  const options = isTheme ? themeOptions : fontOptions;
  const title = isTheme ? "Color Theme" : "Font Theme";
  const subtitle = isTheme ? "Choose your color theme:" : "Choose your font theme:";

  const isSelected = (optTitle: string) =>
    isTheme ? selectedTheme === optTitle : selectedFont === optTitle;

  const handleSelect = (optTitle: Theme | Font) => {
    if (isTheme) setSelectedTheme(optTitle as Theme);
    else setSelectedFont(optTitle as Font);
  };

  const handleApply = () => {
    if (isTheme) setTheme(selectedTheme);
    else setFont(selectedFont);
  };

  return (
    <div className="grow flex flex-col px-200 py-300 text-neutral-950 dark:text-white overflow-y-auto">
      <button
        onClick={() => navigate("/settings")}
        className="flex gap-050 items-center text-neutral-600 dark:text-neutral-400"
      >
        <ArrowLeftIcon className="w-[18px] h-[18px]" />
        Settings
      </button>
      <h2 className="text-[20px] font-bold py-150">{title}</h2>

      <div className="flex flex-col gap-250">
        <p className="text-[14px] text-neutral-600 dark:text-neutral-300">{subtitle}</p>
        <ul className="flex flex-col gap-200">
          {options.map(({ title: optTitle, subtitle: optSub, Icon }) => (
            <li key={optTitle}>
              <button
                onClick={() => handleSelect(optTitle)}
                className={`flex items-center gap-200 py-200 px-200 border w-full rounded-12 dark:border-neutral-800 ${
                  isSelected(optTitle)
                    ? "bg-neutral-100 dark:bg-neutral-800"
                    : ""
                }`}
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-200">
                    <div className="border w-[40px] h-[40px] flex justify-center items-center rounded-12 bg-neutral-0 dark:bg-neutral-950 dark:border-neutral-800">
                      <Icon className="w-6 h-6 dark:text-neutral-300" />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="font-bold text-[14px]">{optTitle}</h3>
                      <p className="text-[12px] text-neutral-500">{optSub}</p>
                    </div>
                  </div>
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-2 ${
                      isSelected(optTitle)
                        ? "border-[4px] border-blue-500"
                        : "border-neutral-200 dark:border-neutral-600"
                    }`}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleApply}
          className="w-[132px] text-[14px] self-end bg-blue-500 px-200 py-150 rounded-8 text-white hover:bg-blue-700 focus:outline outline-offset-2 outline-2 outline-neutral-400"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default SettingPage;
