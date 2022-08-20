import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import FileData from "./pages/file/data";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/home")),
  },
  {
    path: "/file/:id",
    component: lazy(() => import("./pages/file")),
    data: FileData,
  },
  {
    path: "/plugins//:name/:type?",
    component: lazy(() => import("./pages/plugin")),
  },
];
