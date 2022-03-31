import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
  } = req;

  try {
    const alreadyExists = await client.fav.findFirst({
      where: {
        productId: +id,
        userId: user?.id,
      },
    });
    if (alreadyExists) {
      await client.fav.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: +id,
            },
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
