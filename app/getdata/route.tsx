import { NextApiRequest, NextApiResponse } from "next";
import { Josefin_Sans } from "next/font/google";

// DataItem 인터페이스 정의
interface DataItem {
  name: string;
  available: boolean;
  // 여기에 data 객체의 다른 속성들을 추가할 수 있습니다.
}

const datas: DataItem[] = require("@/files/data.json");

export async function GET(req: Request, res: NextApiResponse) {
  if (req.method === "GET") {
    return Response.json({ datas });
  } else {
    res.setHeader("Allow", ["GET"]);
    // res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
