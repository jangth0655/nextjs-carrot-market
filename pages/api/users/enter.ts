import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body.email);

  return res.json({ ok: true });
};

export default withHandler("POST", handler);
