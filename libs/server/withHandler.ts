import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST" | "DELETE";
type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

interface ConfigType {
  method: Method[];
  handler: Handler;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !method.includes(req.method as Method)) {
      return res.status(405).json({ error: "Request method is not correct" });
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Plz Login" });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: " Server not working" });
    }
  };
}
