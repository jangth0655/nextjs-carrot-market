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
    body: { email, phone, name },
  } = req;
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (!profile) {
      return res
        .status(401)
        .json({ ok: false, error: "Profile does not found" });
    }

    return res.json({ ok: true, profile });
  }

  if (req.method === "POST") {
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({ ok: false, error: "Email already token" });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      return res.json({ ok: true });
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({ ok: false, error: "Phone already token" });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      return res.json({ ok: true });
    }
    if (name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }
    return res.json({ ok: true });
  }
};

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
    isPrivate: true,
  })
);
