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
    try {
      const {
        result: {
          uid,
          rtmps: { streamKey, url },
        },
      } = await (
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
            },
            body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
          }
        )
      ).json();
      const stream = await client.stream.create({
        data: {
          cloudflareId: uid,
          cloudflareKey: streamKey,
          cloudflareUrl: url,
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({ ok: false, e });
    }
  }
  if (req.method === "GET") {
    //pagination
    const streams = await client.stream.findMany({
      take: 5,
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
