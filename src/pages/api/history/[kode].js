import Customer from "@/models/Customer";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                if (req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                const customerId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Customer.destroy({
                    where: {
                        kode: customerId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Customer deleted successfully"
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
