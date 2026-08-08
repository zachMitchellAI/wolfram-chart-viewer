// server/api/hello.ts
export default defineEventHandler((event) => {
  console.log(event);
  return { message: 'Hello from the server!' }
})