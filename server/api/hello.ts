import { env } from "node:process";
// server/api/hello.ts
export default defineEventHandler((event) => {
  console.log(event);
  // console.log(env);
  return { message: "Hello from the server!" };
});
