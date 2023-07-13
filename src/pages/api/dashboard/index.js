import Pallet from "@/models/Pallet";
import checkCookieMiddleware from "@/pages/api/middleware";
import {Sequelize, where} from "sequelize";
import History from "@/models/History";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const stokPallet = await Pallet.findAll({
                    where: {
                        status: 1,
                    },
                    attributes: [
                        'part',
                        [Sequelize.fn('COUNT', Sequelize.col('part')), 'total'],
                    ],
                    group: 'part',
                });

                const totalPallet = await Pallet.count()
                const totalStokPallet = await Pallet.count({
                    where: {
                        status: 1,
                    },
                })
                const totalPalletKeluar = await Pallet.count({
                    where: {
                        status: 0
                    }
                })
                const totalPalletRepair = await Pallet.count({
                    where:{
                        status: 3
                    }
                })

                const palletKeluar = await Pallet.findAll({
                    where: {
                        status: 0
                    },
                    limit: 5,
                    order: [['updated_at', 'DESC']]
                });

                const palletMasuk = await Pallet.findAll({
                    where: {
                        status: 1
                    },
                    limit: 5,
                    order: [['updated_at', 'DESC']]
                });

                const historyPallet = await History.findAll({
                    limit: 5,
                    include: [Pallet],
                    order: [['updated_at', 'DESC'], ['masuk', 'DESC']]
                })

                res.status(200).json({
                    data : {
                        chartStok : stokPallet,
                        totalPallet,
                        totalStokPallet,
                        totalPalletKeluar,
                        totalPalletRepair,
                        historyPallet,
                        palletKeluar,
                        palletMasuk
                    }
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
    }
}
const protectedAPIHandler = checkCookieMiddleware(handler);

export default handler;
