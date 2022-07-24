import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import baseCSS from "~/styles/index.css";

export const meta: MetaFunction = () => ({
  title: "Remix: So great, it's funny!",
  description: "Remix jokes app. Learn Remix and laugh at the same time!",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: baseCSS }];
};

export default function IndexRouter() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
            <li>
              <Link to="jokes.rss" reloadDocument>
                RSS
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
