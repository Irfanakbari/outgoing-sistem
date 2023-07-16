import Customer from "@/models/Customer";
import Pallet from "@/models/Pallet";
import Vehicle from "@/models/Vehicle";
import {Op} from "sequelize";
import checkCookieMiddleware from "@/pages/api/middleware";
import Part from "@/models/Part";
import pallet from "@/models/Pallet";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const { customer, vehicle } = req.query;
                // Menentukan parameter halaman dan batasan data
                const page = parseInt(req.query.page) || 1; // Halaman saat ini (default: 1)
                const limit = parseInt(req.query.limit) || 20; // Batasan data per halaman (default: 10)

                // Menghitung offset berdasarkan halaman dan batasan data
                const offset = (page - 1) * limit;

                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where

                if (customer && vehicle) {
                    whereClause = {
                        '$Customer.kode$': customer,
                        '$Vehicle.kode$': vehicle,
                    };
                } else if (customer) {
                    whereClause = {
                        '$Customer.kode$': customer,
                    };
                } else if (vehicle) {
                    whereClause = {
                        '$Vehicle.kode$': vehicle,
                    };
                }

                const pallets = await Pallet.findAndCountAll({
                    where: whereClause,
                    include: [Vehicle, Customer, Part],
                    limit,
                    offset,
                });

                // Menghitung total halaman berdasarkan jumlah data dan batasan per halaman
                const totalPages = Math.ceil(pallets.count / limit);

                res.status(200).json({
                    ok: true,
                    data: pallets.rows,
                    totalPages,
                    currentPage: page,
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;
        case 'POST':
            const { vehicle, part, name, customer } = req.body;

            try {
                // Dapatkan data project berdasarkan kode_project
                const vehicles = await Vehicle.findOne({
                    where: {
                        kode: vehicle
                    }
                });

                if (!vehicles) {
                    return res.status(404).json({ success: false, error: 'Vehicle not found' });
                }

                // Dapatkan daftar valet berdasarkan kode_project untuk mencari urutan kosong
                const pallets = await Pallet.findAll({ where: { kode: { [Op.like]: `${customer}${vehicle}${part}%` } } });

                let nextId;
                if (pallets.length > 0) {
                    const palletNumbers = pallets.map(palet => {
                        const palletId = palet['kode'];
                        const numberString = palletId.slice(customer.length + vehicle.length + part.length);
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= pallets.length + 1; i++) {
                        if (!palletNumbers.includes(i)) {
                            nextId = i;
                            break;
                        }
                    }

                    // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                    if (!nextId) {
                        const lastNumber = Math.max(...palletNumbers);
                        nextId = lastNumber + 1;
                    }
                } else {
                    // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                    nextId = 1;
                }

                const nextIdFormatted = nextId.toString().padStart(3, '0');
                const palletKode =  customer + vehicle + part + nextIdFormatted;

                await Pallet.create({
                    kode: palletKode,
                    name,
                    vehicle: vehicle,
                    part: part,
                    customer: customer
                });

                res.status(200).json({ success: true });

            } catch (error) {
                res.status(500).json({ success: false, error: 'Failed to save Pallet' });
            }
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
