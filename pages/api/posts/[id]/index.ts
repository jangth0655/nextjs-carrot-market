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
    const post = await client.post.findUnique({
      where: {
        id: +id,
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            name: true,
          },
        },
        answers: {
          select: {
            answer: true,
            createdAt: true,
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            answers: true,
            wonderings: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ ok: false, error: "No found page" });
    }
    const isWondering = Boolean(
      await client.wondering.findFirst({
        where: {
          postId: +id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    return res.status(200).json({ ok: true, post, isWondering });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
};

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: false,
  })
);
