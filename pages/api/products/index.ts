import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { name, price, description },
    session: { user },
  } = req;

  if (req.method === "GET") {
    try {
      const products = await client.product.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      });
      if (!products) {
        return res
          .status(401)
          .json({ ok: false, error: "Product does not found" });
      }
      return res.json({
        ok: true,
        products,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ ok: false, error });
    }
  }

  if (req.method === "POST") {
    try {
      const product = await client.product.create({
        data: {
          name,
          price,
          description,
          image: "xxxx",
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      if (!product) {
        return res
          .status(401)
          .json({ ok: false, error: "Product does not found" });
      }

      return res.json({ ok: true, product });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ ok: false, error });
    }
  }
};

export default withApiSession(
  withHandler({
    method: ["POST", "GET"],
    handler,
    isPrivate: false,
  })
);
