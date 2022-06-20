import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import baseCSS from "~/styles/index.css";

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
          </ul>
        </nav>
      </div>
    </div>
  );
}
