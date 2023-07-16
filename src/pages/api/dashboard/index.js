import Pallet from "@/models/Pallet";
import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import History from "@/models/History";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const customers = await Customer.findAll()


                const customerPromises = customers.map(async (customer) => {
                    const palletCounts = {};

                    palletCounts['total'] = await Pallet.count({
                        where: {
                            customer: customer['kode'],
                        }
                    });

                    palletCounts['keluar'] = await Pallet.count({
                        where: {
                            customer: customer['kode'],
                            status: 0
                        }
                    });

                    palletCounts['tersedia'] = await Pallet.count({
                        where: {
                            customer: customer['kode'],
                            status: 1
                        }
                    });

                    palletCounts['maintenance'] = await Pallet.count({
                        where: {
                            customer: customer['kode'],
                            status: 3
                        }
                    });

                    return {
                        customer: customer['name'],
                        Total: palletCounts.total,
                        Tersedia: palletCounts.tersedia,
                        Keluar: palletCounts.keluar,
                        Maintenance: palletCounts.maintenance
                    };
                });

                const customerPallets = await Promise.all(customerPromises);


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

                const historyPallet = await History.findAll({
                    limit: 5,
                    include: [Pallet],
                    order: [['updated_at', 'DESC'], ['masuk', 'DESC']]
                })

                res.status(200).json({
                    data : {
                        chartStok : customerPallets,
                        totalPallet,
                        totalStokPallet,
                        totalPalletKeluar,
                        totalPalletRepair,
                        historyPallet
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
