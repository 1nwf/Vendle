import { settings } from "./state/settings";
declare global {
  interface Window {
    settings: typeof settings;
  }
}
