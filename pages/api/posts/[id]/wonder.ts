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
    const alreadyExists = await client.wondering.findFirst({
      where: {
        userId: user?.id,
        postId: +id,
      },
      select: {
        id: true,
      },
    });
    if (alreadyExists) {
      await client.wondering.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.wondering.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: +id,
            },
          },
        },
      });
    }

    return res.json({ ok: true });
  } catch (error) {}
};

export default withApiSession(
  withHandler({
    method: ["POST"],
    handler,
    isPrivate: false,
  })
);
