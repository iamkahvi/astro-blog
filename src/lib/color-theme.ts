import { themeMap } from "../components/colorThemes.mjs";

export enum Themes {
  Classic = "classic",
  Bubblegum = "bubblegum",
  Pastel = "pastel",
  Artic = "artic",
  Forest = "forest",
  Purple = "purple",
  Blue = "blue",
  Dark = "dark",
}

export const getCurrentColorTheme = () => {
  return window.localStorage.getItem("color-theme") as Themes;
};

export const getInitialColorMode = () => {
  const persistedColorPreference = window.localStorage.getItem("color-theme");
  const hasPersistedPreference = typeof persistedColorPreference === "string";

  if (hasPersistedPreference) {
    return persistedColorPreference;
  }

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const hasMediaQueryPreference = typeof mql.matches === "boolean";

  if (hasMediaQueryPreference && mql.matches) {
    return "dark";
  }

  return "classic";
};

export const setRootStyles = (theme: any) => {
  const root = document.documentElement;
  // @ts-ignore
  Object.entries(themeMap[theme]).forEach((val) => {
    const [k, v] = val;
    // @ts-ignore
    root.style.setProperty(k, v);

    // Ugly fix for selection color
    if (k == "--c-main") {
      root.style.setProperty("--c-main-selection", v + "50");
    }
  });
};

export const setTheme = (theme?: Themes) => {
  const t = theme ?? randTheme(getCurrentColorTheme());
  // @ts-ignore
  window.localStorage.setItem("color-theme", t);
  setRootStyles(t);
};

const randTheme = (currTheme: Themes): Themes => {
  const theme = Object.entries(themeMap)[
    Math.floor(Math.random() * Object.values(themeMap).length)
  ][0] as Themes;

  return theme !== currTheme ? theme : randTheme(currTheme);
};
