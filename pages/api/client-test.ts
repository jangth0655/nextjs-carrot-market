import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return res.json({ ok: true, hello: "hello" });
};

export default handler;
