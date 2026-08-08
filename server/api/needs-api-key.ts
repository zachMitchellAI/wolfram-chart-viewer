import {env} from "node:process";

export default defineEventHandler((_event) => {
  return { result: !(env["OPENROUTER_API_KEY"] || false) }
})