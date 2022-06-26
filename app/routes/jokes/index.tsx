import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [joke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
    select: { id: true, name: true, content: true },
  });

  return json(joke);
};

type LoaderData = Joke;

export default function JokesIndexRoute() {
  const joke = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  );
}
