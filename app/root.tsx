import type { LinksFunction } from "@remix-run/node";
import { Links } from "@remix-run/react";
import { LiveReload, Outlet } from "@remix-run/react";
import globalCSS from "~/styles/global.css";
import globalMediumCSS from "~/styles/global-medium.css";
import globalLargeCSS from "~/styles/global-large.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalCSS,
    },
    {
      rel: "stylesheet",
      href: globalMediumCSS,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeCSS,
      media: "screen and (min-width: 1280px)",
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
