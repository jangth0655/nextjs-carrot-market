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
    body: { price, name, description },
  } = req;
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        price,
        name,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(201).json({ ok: true, stream });
  }
  if (req.method === "GET") {
    //pagination
    const streams = await client.stream.findMany({
      take: 5,
      skip: 10,
    });
    if (!streams) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    return res.status(200).json({ ok: true, streams });
  }
};

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
    isPrivate: true,
  })
);
