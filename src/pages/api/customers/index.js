import Customer from "@/models/Customer";
import checkCookieMiddleware from "@/pages/api/middleware";
import {where} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const customers = await Customer.findAll()
                res.status(200).json({
                    ok : true,
                    data : customers
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            try {
                const newCustomer = req.body; // Anggap req.body berisi data pelanggan baru
                const customer = await Customer.create(newCustomer);
                res.status(201).json({
                    ok: true,
                    data: customer
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
