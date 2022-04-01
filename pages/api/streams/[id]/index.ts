import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
  } = req;

  const stream = await client.stream.findUnique({
    where: {
      id: +id,
    },
    include: {
      messages: {
        select: {
          message: true,
          id: true,
          user: {
            select: {
              id: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  if (!stream) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  return res.status(200).json({ ok: true, stream });
};

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: true,
  })
);
