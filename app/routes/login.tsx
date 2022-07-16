import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, Link, useSearchParams } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/lib/db.server";
import { login } from "~/server/session.server";
import loginCSS from "~/styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: loginCSS }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const schema = z.object({
    username: z
      .string()
      .min(3, { message: "Usernames must be at least 3 characters long" }),
    password: z
      .string()
      .min(6, { message: "Passwords must be at least 6 characters long" }),
    loginType: z.enum(["login", "register"]),
    redirectTo: z.string(),
  });
  const validation = schema.safeParse({
    username: form.get("username"),
    password: form.get("password"),
    loginType: form.get("loginType"),
    redirectTo: form.get("redirectTo"),
  });

  // @TODO
  // const redirectTo = validateUrl(form.get("redirectTo") || "/jokes");

  if (
    !validation.success &&
    validation.error.errors.some((error) => error.code === "invalid_type")
  ) {
    return json(
      { formError: `Form not submitted correctly.` },
      { status: 400 }
    );
  }
  if (!validation.success) {
    return json(
      {
        fieldErrors: { ...validation.error.formErrors.fieldErrors },
        fields: {
          username: form.get("username"),
          password: form.get("password"),
        },
      },
      { status: 400 }
    );
  }
  const { password, username, loginType } = validation.data;

  switch (loginType) {
    case "login": {
      // login to get the user *
      // if there's no user, return the fields and a formError *
      // if there is a user, create their session and redirect to /jokes
      const user = await login({ username, password });
      if (!user) {
        return json(
          {
            formError: `Username/Password combination is incorrect`,
            fields: {
              username: form.get("username"),
              password: form.get("password"),
            },
          },
          { status: 400 }
        );
      }

      return json(
        { fields: validation.data, formError: "Not implemented" },
        { status: 400 }
      );
    }
    case "register": {
      const user = await db.user.findFirst({
        where: { username: validation.data.username },
      });
      if (user) {
        return json(
          {
            fields: validation.data,
            formError: `User with username ${validation.data.username} already exists`,
          },
          { status: 400 }
        );
      }

      // create the user
      // create their session and redirect to /jokes
      return json(
        { fields: validation.data, formError: "Not implemented" },
        { status: 400 }
      );
    }
    default: {
      return json(
        { fields: validation.data, formError: `Login type invalid` },
        { status: 400 }
      );
    }
  }
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

// function validateUrl(url: any) {
//   console.log(url);
//   let urls = ["/jokes", "/", "https://remix.run"];
//   if (urls.includes(url)) {
//     return url;
//   }
//   return "/jokes";
// }