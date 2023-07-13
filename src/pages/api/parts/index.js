import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import {Op} from "sequelize";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
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
                    console.log(error);
                    res.status(500).json({ success: false, error: error.message });
                }
            }
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
