import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useCatch,
  useTransition,
} from "@remix-run/react";
import { z } from "zod";
import { db } from "~/lib/db.server";
import { getUserId, requireUserId } from "~/server/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    //@TODO unauthorized abstration
    throw new Response("Unauthorized", { status: 401 });
  }
  return json({});
};

const schema = z.object({
  name: z.string().min(3, { message: "That joke's name is too short" }),
  content: z.string().min(10, { message: "That joke is too short" }),
});

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const validation = schema.safeParse({
    name: form.get("name"),
    content: form.get("content"),
  });

  if (!validation.success) {
    return json(
      {
        fieldErrors: { ...validation.error.formErrors.fieldErrors },
        fields: {
          name: form.get("name"),
          content: form.get("content"),
        },
      },
      { status: 400 }
    );
  }
  const { name, content } = validation.data;
  const joke = await db.joke.create({
    data: { name, content, jokesterId: userId },
  });

  return redirect(`/jokes/${joke.id}`);
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  console.log(transition);

  if (transition.submission) {
    const validation = schema.safeParse({
      name: transition.submission.formData.get("name"),
      content: transition.submission.formData.get("content"),
    });

    if (validation.success) {
      return (
        <div>
          <p>Here's your hilarious joke:</p>
          <p>{validation.data.content}</p>
          <Link to=".">{validation.data.name} Permalink</Link>
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button type="submit" className="button" disabled>
              Delete
            </button>
          </Form>
        </div>
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={actionData?.fields?.name}
            aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.name ? "name-error" : undefined
            }
          />
          {actionData?.fieldErrors?.name && (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="content">Content: </label>
          <textarea
            id="content"
            name="content"
            defaultValue={actionData?.fields?.content}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.content) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.content ? "content-error" : undefined
            }
          />
          {actionData?.fieldErrors?.content && (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          )}
        </div>
        <div>
          {actionData?.formError && (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          )}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}
