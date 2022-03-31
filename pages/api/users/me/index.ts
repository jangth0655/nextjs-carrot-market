import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    session: { user },
  } = req;
  const profile = await client.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!profile) {
    return res.status(401).json({ ok: false, error: "Profile does not found" });
  }

  return res.json({ ok: true, profile });
};

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: true,
  })
);
