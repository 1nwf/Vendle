import { changeColorscheme, settings } from "../state/settings";

export default function Titlebar() {
  const toggleTheme = () => {
    changeColorscheme(!settings.lightTheme);
  };
  return (
    <div
      class={`w-screen  bg-transparent ${settings.theme.appFg} absolute pb-2 z-50 `}
      style="-webkit-app-region: drag"
    >
      <div class="flex content-center items-center align-middle mt-1 ml-3">
        <div class="ml-18 pt-1 text-sm">TitleBar</div>
        <button
          class="ml-4 pt-1 text-sm hover:cursor-pointer"
          onClick={toggleTheme}
        >
          {settings.lightTheme ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
