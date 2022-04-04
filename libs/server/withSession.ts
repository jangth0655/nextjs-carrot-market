import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOption = {
  cookieName: "carrotSession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOption);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOption);
}
