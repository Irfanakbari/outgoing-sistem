import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                if (req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                const parts = await Part.findAll({
                    include: [Customer]
                })
                res.status(200).json({
                    ok : true,
                    data : parts
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            const { name, customer, kode } = req.body;
            try {
                if (req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                await Part.create({
                    kode: customer + kode,
                    name: name,
                    customer: customer,
                });
                res.status(200).json({ success: true });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    const field = error.errors[0].path;
                    const message = `Duplikat data pada kolom ${field}`;
                    res.status(400).json({ success: false, error: message });
                } else {
                    res.status(500).json({ success: false, error: error.message });
                }
            }
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
