import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { phone, email },
  } = req;
  const user = phone ? { phone } : { email } ? { email } : null;
  if (!user) {
    return res.status(400).json({ ok: false, error: "Not found" });
  }
  const payload = Math.floor(100000 + Math.random() * 90000) + "";
  try {
    const token = await client.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              ...user,
            },
            create: {
              name: "Anonymous",
              ...user,
            },
          },
        },
      },
    });
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
};

export default withHandler({
  method: "POST",
  handler,
  isPrivate: false,
});

/* if (phone) {
  await twilioClient.messages.create({
    messagingServiceSid: process.env.TWILIO_MSID,
    to: process.env.MY_PHONE!,
    body: `Your login token is ${payload}.`,
  });
} else if (email) {
  const email = await mail.send({
    from: "jangth0655@naver.com",
    to: "jangth0655@gamil.com",
    subject: "Your Carrot Market Verification Email",
    text: `Your token is ${payload}.`,
    html: `<h1>Your token is ${payload}</h1>`,
  });
  console.log(email);
}
 */
