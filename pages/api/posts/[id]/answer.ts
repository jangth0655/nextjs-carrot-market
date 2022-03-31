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
    body: { answer },
  } = req;

  try {
    const post = await client.post.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true,
      },
    });
    if (!post) {
      return res.status(404).json({ ok: false, error: "Not found post" });
    } else {
      const newAnswer = await client.answer.create({
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
          answer,
        },
      });
      return res.status(201).json({ ok: true, newAnswer });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, error });
  }
};

export default withApiSession(
  withHandler({
    method: ["POST"],
    handler,
    isPrivate: false,
  })
);
