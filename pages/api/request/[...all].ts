import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export default async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
    const target = req.headers["miru-url"] as string;
    if (!target) {
        res.redirect("https://miru.js.org");
        return;
    }

    await httpProxyMiddleware(req, res, {
        target,
        changeOrigin: true,
        headers: {
            "user-agent": (req.headers["miru-ua"] ?? req.headers["user-agent"]) as string,
            referer: (req.headers["miru-referer"] ?? req.headers["referer"]) as string
        },
        pathRewrite: [
            {
                patternStr: "^/api/request",
                replaceStr: ""
            }
        ]
    });
}

