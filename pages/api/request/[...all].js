import httpProxyMiddleware from "next-http-proxy-middleware";
export default function GET(req, res) {
    let target = "";
    console.log(req);
    target = req.headers["miru-url"];
    if (!target) {
        res.redirect("https://miru.0n0.dev");
        return;
    }

    return httpProxyMiddleware(req, res, {
        target,
        changeOrigin: true,
        headers: {
            "user-agent": req.headers["miru-ua"] ?? req.headers["user-agent"],
            referer: req.headers["miru-referer"] ?? req.headers["referer"],
        },
        pathRewrite: [{
            patternStr: '^/api/request',
            replaceStr: ''
        }]
    });


};