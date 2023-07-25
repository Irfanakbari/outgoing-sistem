import Vehicle from "@/models/Vehicle";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                if (req.user.role !== 'super' && req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                const projectId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Vehicle.destroy({
                    where: {
                        kode: projectId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Project deleted successfully"
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
                if (req.user.role !== 'super' && req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                const customerId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const newVehicle = req.body; // Anggap req.body berisi data pelanggan baru
                await Vehicle.update(newVehicle,{
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
