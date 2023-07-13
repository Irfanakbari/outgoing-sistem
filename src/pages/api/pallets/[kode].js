import Pallet from "@/models/Pallet";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const idPallet = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Pallet.destroy({
                    where: {
                        kode: idPallet
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Valet deleted successfully"
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