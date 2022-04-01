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

  const sales = await client.sale.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
    },
  });
  if (!sales) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }

  return res.status(200).json({ ok: true, sales });
};

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: true,
  })
);
