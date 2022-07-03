import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { db } from "lib/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const schema = z.object({
    name: z.string().min(3, { message: "That joke's name is too short" }),
    content: z.string().min(10, { message: "That joke is too short" }),
  });

  const validation = schema.safeParse({
    name: form.get("name"),
    content: form.get("content"),
  });

  if (!validation.success) {
    return json(
      {
        fieldErrors: { ...validation.error.formErrors.fieldErrors },
        fields: { name: form.get("name"), content: form.get("content") },
      },
      { status: 400 }
    );
  }
  const { name, content } = validation.data;
  const joke = await db.joke.create({ data: { name, content } });

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

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
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
      </form>
    </div>
  );
}
