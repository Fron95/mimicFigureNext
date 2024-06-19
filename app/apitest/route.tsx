// pages/api/hello.ts (TypeScript API route)
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export async function GET() {
  return Response.json({ messages : "hello world from next" });
}
