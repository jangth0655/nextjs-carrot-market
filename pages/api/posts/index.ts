import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const parsedLatitude = parseFloat(latitude.toString());
    const parsedLongitude = parseFloat(longitude.toString());
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
      },
      where: {
        latitude: {
          gte: parsedLatitude - 0.01,
          lte: parsedLatitude + 0.01,
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        },
      },
    });
    if (!posts) {
      return res.status(404).json({ ok: false, error: "Not found post" });
    }
    return res.status(200).json({ ok: true, posts });
  }

  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;
    try {
      const post = await client.post.create({
        data: {
          latitude,
          longitude,
          question,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return res.status(201).json({ ok: true, post });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, error });
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
