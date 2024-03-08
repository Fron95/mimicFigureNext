import { NextApiRequest, NextApiResponse } from "next";
type ResponseData = {
  message: string;
};



export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
  if (req.method === "POST") {
    const receivedData = await req.json();
    console.log("transferData💔", receivedData);
    console.log("type is💔", typeof receivedData)
    try {
      const url = `https://myself-nathan-eur-organised.trycloudflare.com/quote`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...receivedData }),
      });
      const data = await response.json();
      console.log("data💔", data);
      return Response.json({ data });
    } catch (error) {
      console.log("error💔(sibal/route)", error);
      const errorData = {
        quote: "sorry. ERROR occurred. please try again.",
        summary: receivedData.summary,
      };
      console.log("errorData💔",typeof errorData);
      return Response.json({data : errorData});
    }
  } else {
    res.status(405).json({ message: "We only support POST" });
  }
}
