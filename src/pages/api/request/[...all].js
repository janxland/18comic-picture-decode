import httpProxyMiddleware from "next-http-proxy-middleware"
export default function proxy(req, res) {
    let target = "";
    target = req.headers["miru-url"];
    console.log(target)
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