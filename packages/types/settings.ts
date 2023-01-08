export interface Colorscheme {
  editorBg: string;
  editorFg: string;
  editorFont: string;
  appBg: string;
  appFg: string;
  sidePanelBg: string;
  sidePanelFg: string;
  commandsPopupBg: string;
  commandsPopupFg: string;
}
export interface Theme {
  lightTheme: Colorscheme;
  darkTheme: Colorscheme;
}

export interface Settings {
  allowEditing: boolean;
  menuItmes: never[];
  isLightTheme: boolean;
  lightTheme: Colorscheme;
  darkTheme: Colorscheme;
  overlayPopupCommands: {
    tag: string;
    name: string;
  };
  username: string;
  themeName: string;
  sidepanelShown: boolean;
  pfpPath: "";
  theme: Colorscheme;
}
