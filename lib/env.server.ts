// @TODO runtime zod validation
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const env = {
  sessionSecret: process.env.SESSION_SECRET,
};
