import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { token },
  } = req;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    select: {
      userId: true,
    },
  });
  if (!foundToken) {
    return res.status(404).json({ ok: false, error: "User does not found" });
  }
  req.session.user = {
    id: foundToken.userId,
  };

  await req.session.save();

  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  return res.json({ ok: true });
};

export default withApiSession(
  withHandler({
    method: "POST",
    handler,
    isPrivate: false,
  })
);
