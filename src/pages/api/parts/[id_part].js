import checkCookieMiddleware from "@/pages/api/middleware";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const projectId = req.query.id_part; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Part.destroy({
                    where: {
                        id_part: projectId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Part deleted successfully"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
