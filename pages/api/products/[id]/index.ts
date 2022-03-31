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
    const product = await client.product.findUnique({
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
      },
    });
    const terms = product?.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));

    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: +id,
          },
        },
      },
    });

    if (!product) {
      return res
        .status(401)
        .json({ ok: false, error: "product does not found" });
    }

    const isLiked = Boolean(
      await client.fav.findFirst({
        where: {
          productId: +id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );

    return res.json({ ok: true, product, isLiked, relatedProducts });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ ok: false, error });
  }
};

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
    isPrivate: false,
  })
);
