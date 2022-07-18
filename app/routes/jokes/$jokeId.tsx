import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/lib/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.jokeId) throw new Error("Joke not found");
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true },
  });
  if (!joke) throw new Error("Joke not found");
  return json(joke);
};

type LoaderData = Joke;

export default function JokeRoute() {
  const joke = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
