import { NextApiRequest, NextApiResponse } from "next";
type ResponseData = {
  message: string;
};

export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
  if (req.method === "POST") {
    const receivedData = await req.json();
    console.log("transferData💔", receivedData);

    const url = `https://myself-nathan-eur-organised.trycloudflare.com/quote`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...receivedData }),
    }); 
    const data = await response.json();
    console.log("data💔", data);    
    return Response.json({ data });
  } else {
    res.status(405).json({ message: "We only support POST" });
  }
}
