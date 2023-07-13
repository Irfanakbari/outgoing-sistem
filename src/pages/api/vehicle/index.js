import Vehicle from "@/models/Vehicle";
import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import Pallet from "@/models/Pallet";
import {Op} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const vehicles = await Vehicle.findAll({
                    include: [Customer]
                })
                res.status(200).json({
                    ok : true,
                    data : vehicles
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            const { name, customer} = req.body;
            try {
                // Dapatkan daftar valet berdasarkan kode_project untuk mencari urutan kosong
                const vehicles = await Vehicle.findAll({ where: { kode: { [Op.like]: `${customer}%` } } });

                let nextId;
                if (vehicles.length > 0) {
                    const vehicleNumbers = vehicles.map(palet => {
                        const vehicleId = palet['kode'];
                        const numberString = vehicleId.slice(customer.length);
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= vehicles.length + 1; i++) {
                        if (!vehicleNumbers.includes(i)) {
                            nextId = i;
                            break;
                        }
                    }

                    // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                    if (!nextId) {
                        const lastNumber = Math.max(...vehicleNumbers);
                        nextId = lastNumber + 1;
                    }
                } else {
                    // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                    nextId = 1;
                }

                const nextIdFormatted = nextId.toString();
                const palletKode =  customer + nextIdFormatted;

                await Vehicle.create({
                    kode: palletKode,
                    name: name,
                    customer: customer
                });
                // Redirect ke halaman sukses atau halaman lain yang Anda inginkan
                res.status(200).json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, error: 'Failed to create line' });
            }
            break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
