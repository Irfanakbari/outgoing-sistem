import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                if (req.user.role !== 'super' && req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                res.status(200).json({
                    data : 'Oke'
                });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
    }
}
const protectedAPIHandler = checkCookieMiddleware(handler);


export default protectedAPIHandler;
