import { Settings } from "packages/types/settings";

declare global {
  interface Window {
    settings: Settings;
  }
}
