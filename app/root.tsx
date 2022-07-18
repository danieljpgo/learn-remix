import type { LinksFunction } from "@remix-run/node";
import { Links, useCatch } from "@remix-run/react";
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
    <Document>
      <Outlet />
    </Document>
  );
}

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
};
function Document(props: DocumentProps) {
  const { children, title = `Remix: So great, it's funny!` } = props;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

type ErrorBoundaryProps = {
  error: Error;
};
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const { error } = props;

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}
