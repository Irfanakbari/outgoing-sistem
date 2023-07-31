import History from "@/models/History";
import checkCookieMiddleware from "@/pages/api/middleware";
import {Op} from "sequelize";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const {  start, end, search, page } = req.query;
            try {
                let histories;
                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where
                if (search) {
                    whereClause = {
                        'id_part': {
                            [Op.substring]: search.toString()
                        }
                    }
                }
                if (start && end) {
                    const startDate = new Date(start);
                    startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
                    const endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.between]: [startDate.toISOString(), endDate.toISOString()],
                        },
                    };
                } else if (start) {
                    const startDate = new Date(start);
                    startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.gte]: startDate.toISOString(),
                        },
                    };
                } else if (end) {
                    const endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.lte]: endDate.toISOString(),
                        },
                    };
                }

                // Menghitung offset berdasarkan halaman dan batasan data
                const offset = (parseInt(page || 1) - 1) * 20;
                histories = await History.findAndCountAll({
                    where: whereClause,
                    limit: 20,
                    offset: offset,
                });

                const totalPages = Math.ceil(histories.count / parseInt('20'));

                res.status(200).json({
                    ok: true,
                    data: histories.rows,
                    totalPages,
                    currentPage: parseInt(page),
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;
        case 'POST':
            try {
                const { id_part } = req.body;
                await History.create(
                    {
                        id_part
                    },
                );

                res.status(201).json({
                    ok: true,
                    data: "Sukses"
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
