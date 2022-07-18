import { db } from "~/lib/db.server";
import { getUserId, getUserSession, cookieSession } from "./session.server";
import bcrypt from "bcryptjs";
import { redirect } from "@remix-run/node";

type LoginForm = {
  username: string;
  password: string;
};

export async function login(form: LoginForm) {
  const user = await db.user.findUnique({ where: { username: form.username } });
  if (!user) return undefined;

  const isCorrectPassword = await bcrypt.compare(
    form.password,
    user.passwordHash
  );
  if (!isCorrectPassword) return undefined;

  return {
    id: user.id,
    username: user.username,
  };
}

type RegisterForm = {
  username: string;
  password: string;
};

export async function register(form: RegisterForm) {
  const passwordHash = await bcrypt.hash(form.password, 10);
  const user = await db.user.create({
    data: { username: form.username, passwordHash },
  });
  return {
    id: user.id,
    username: user.username,
  };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await cookieSession.destroySession(session),
    },
  });
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  } catch {
    throw logout(request);
  }
}
