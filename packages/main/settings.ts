export const defaultLight = {
  editorBg:
    "--tw-bg-opacity: 1;background-color: rgba(243, 244, 246, var(--tw-bg-opacity));",
  editorFg:
    "--tw-text-opacity: 1;color: rgba(55, 65, 81, var(--tw-text-opacity));",
  editorFont:
    'font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";',
  appBg:
    "--tw-bg-opacity: 1;background-color: rgba(255, 255, 255, var(--tw-bg-opacity));",
  appFg: "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
  sidePanelBg:
    "--tw-bg-opacity: 1;background-color: rgba(229, 231, 235, var(--tw-bg-opacity));",
  sidePanelFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
  commandsPopupBg:
    "--tw-bg-opacity: 1;background-color: rgba(209, 213, 219, var(--tw-bg-opacity));",
  commandsPopupFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
};
export const defaultDark = {
  editorBg:
    "--tw-bg-opacity: 1;background-color: rgba(31, 41, 55, var(--tw-bg-opacity));",
  editorFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  editorFont:
    'font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";',
  appBg:
    "--tw-bg-opacity: 1;background-color: rgba(31, 41, 55, var(--tw-bg-opacity));",
  appFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  sidePanelBg:
    "--tw-bg-opacity: 1;background-color: rgba(17, 24, 39, var(--tw-bg-opacity));",
  sidePanelFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  commandsPopupBg:
    "--tw-bg-opacity: 1;background-color: rgba(209, 213, 219, var(--tw-bg-opacity));",
  commandsPopupFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
};

export const defaultSettings = {
  allowEditing: true,
  menuItmes: [],
  isLightTheme: true,
  lightTheme: defaultLight,
  darkTheme: defaultDark,
  overLayPopupCommands: [
    {
      tag: "h1",
      name: "title",
    },
    {
      tag: "h2",
      name: "heading",
    },
    {
      tag: "h3",
      name: "subheading",
    },
    {
      tag: "p",
      name: "paragraph",
    },
    {
      tag: "li",
      name: "list",
    },
  ],
  username: "No User Name",
  themeName: "default",
  sidepanelShown: true,
  pfpPath: "",
  get theme() {
    return this.isLightTheme ? this.lightTheme : this.darkTheme;
  },
};
