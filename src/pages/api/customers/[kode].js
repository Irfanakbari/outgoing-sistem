import Customer from "@/models/Customer";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
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
        case 'PUT':
            try {
                const customerId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const newCustomer = req.body; // Anggap req.body berisi data pelanggan baru
                const customer = await Customer.update(newCustomer,{
                    where: {
                        kode : customerId
                    }
                });
                res.status(201).json({
                    ok: true,
                    data: "Success"
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
