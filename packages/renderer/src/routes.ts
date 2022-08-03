import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/home")),
  },
  {
    path: "/settings",
    component: lazy(() => import("./pages/settings")),
  },
  {
    path: "/file/:id",
    component: lazy(() => import("./pages/file")),
  },
  {
    path: "/plugins/:name",
    component: lazy(() => import("./pages/plugin")),
  },
];
