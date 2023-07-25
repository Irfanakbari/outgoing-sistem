import Pallet from "@/models/Pallet";
import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import History from "@/models/History";
import {Op} from "sequelize";
import moment from "moment";
import * as sequelize from "sequelize";
import Vehicle from "@/models/Vehicle";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                if (req.user.role !== 'super' && req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }

                let customers;
                let historyPallet;
                let totalPaletMendep;
                let paletMendep;
                let totalStokPallet;
                let totalPallet;
                let totalPalletRepair;
                let totalPalletKeluar;

                if (req.user.role === 'super') {
                    // Jika user memiliki role 'super', tampilkan semua data Customer tanpa batasan departemen
                    customers = await Customer.findAll();
                    historyPallet = await History.findAll({
                        limit: 5,
                        include: [Pallet],
                        order: [['updated_at', 'DESC'], ['masuk', 'DESC']],
                    });

                    paletMendep = await History.findAll({
                        attributes: [
                            [sequelize.literal('Pallet.customer'), 'customer'], // Mengganti 'Pallet.customer' dengan 'Customer.name'
                            [sequelize.fn('count', sequelize.col('History.id')), 'total'],
                        ],
                        where: {
                            keluar: {
                                [Op.lt]: moment().subtract(1, 'week').toDate(),
                            },
                        },
                        include: [
                            {
                                model: Pallet,
                                attributes: ['kode'],
                                where: {
                                    status: 0
                                }
                            }
                        ],
                        group: [sequelize.literal('Pallet.customer')], // Mengganti 'Pallet.customer' dengan 'Customer.name'
                        raw: true
                    });

                    totalPaletMendep = await History.count({
                        where: {
                            keluar: {
                                [Op.lt]: moment().subtract(1, 'week').toDate(),
                            },
                        },
                        include: {
                            model: Pallet,
                            where: {
                                status: 0
                            }
                        }
                    });

                    totalPallet = await Pallet.count();

                    totalStokPallet = await Pallet.count({
                        where: {
                            status: 1,
                        },
                    });

                    totalPalletKeluar = await Pallet.count({
                        where: {
                            status: 0,
                        },
                    });

                    totalPalletRepair = await Pallet.count({
                        where: {
                            status: 3,
                        },
                    });
                } else if (req.user.role === 'admin') {
                    // Jika user memiliki role 'admin', tampilkan data Customer dengan departemen yang sesuai
                    const allowedDepartments = req.department.map((department) => department.department_id);
                    customers = await Customer.findAll()

                    historyPallet = await History.findAll({
                        limit: 5,
                        include: [
                            {
                                model: Pallet,
                                include: [
                                    {
                                        model: Vehicle,
                                        attributes: ['name', 'department'], // Memuat atribut department_id dari Customer
                                        where: {
                                            department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                        },
                                    },
                                ],
                            },
                        ],
                        where: {
                            '$Pallet.Vehicle.department$': { [Op.in]: allowedDepartments },
                        },
                        order: [['updated_at', 'DESC'], ['masuk', 'DESC']],
                    });

                    paletMendep = await History.findAll({
                        attributes: [
                            [sequelize.literal('Pallet.customer'), 'customer'], // Mengganti 'Pallet.customer' dengan 'Customer.name'
                            [sequelize.fn('count', sequelize.col('History.id')), 'total'],
                        ],
                        where: {
                            keluar: {
                                [Op.lt]: moment().subtract(1, 'week').toDate(),
                            },
                            '$Pallet.Vehicle.department$': { [Op.in]: allowedDepartments },
                        },
                        include: [
                            {
                                model: Pallet,
                                attributes: ['kode'],
                                where: {
                                    status: 0
                                },
                                include: [
                                    {
                                        model: Vehicle,
                                        attributes: [], // Tidak perlu memuat atribut apapun dari Customer
                                        where: {
                                            department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                        },
                                    },
                                ],
                            },
                        ],
                        group: [sequelize.literal('Pallet.customer')], // Mengganti 'Pallet.customer' dengan 'Customer.name'
                        raw: true
                    });

                    totalPaletMendep = await History.count({
                        where: {
                            keluar: {
                                [Op.lt]: moment().subtract(1, 'week').toDate(),
                            },
                            '$Pallet.Vehicle.department$': { [Op.in]: allowedDepartments },
                        },
                        include: [
                            {
                                model: Pallet,
                                where: {
                                    status: 0
                                },
                                include: [
                                    {
                                        model: Vehicle,
                                        attributes: [], // Tidak perlu memuat atribut apapun dari Customer
                                        where: {
                                            department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                        },
                                    },
                                ],
                            },
                        ],
                    });

                    totalPallet = await Pallet.count({
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['department'], // Memuat atribut department_id dari Customer
                                where: {
                                    department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                },
                            },
                        ],
                    });

                    totalStokPallet = await Pallet.count({
                        where: {
                            status: 1,
                        },
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['department'], // Memuat atribut department_id dari Customer
                                where: {
                                    department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                },
                            },
                        ],
                    });

                    totalPalletKeluar = await Pallet.count({
                        where: {
                            status: 0,
                        },
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['department'], // Memuat atribut department_id dari Customer
                                where: {
                                    department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                },
                            },
                        ],
                    });

                    totalPalletRepair = await Pallet.count({
                        where: {
                            status: 3,
                        },
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['department'], // Memuat atribut department_id dari Customer
                                where: {
                                    department: { [Op.in]: allowedDepartments }, // Filter berdasarkan department_id
                                },
                            },
                        ],
                    });
                }

                const customerPromises = customers.map(async (customer) => {
                    const palletCounts = {};
                    const { kode: customerCode } = customer;

                    if (req.user.role === 'super') {
                        // Jika user memiliki role 'super', tampilkan semua data Pallet tanpa batasan departemen
                        palletCounts['total'] = await Pallet.count({
                            where: {
                                customer: customerCode,
                            },
                        });

                        palletCounts['keluar'] = await Pallet.count({
                            where: {
                                customer: customerCode,
                                status: 0,
                            },
                        });

                        palletCounts['tersedia'] = await Pallet.count({
                            where: {
                                customer: customerCode,
                                status: 1,
                            },
                        });

                        palletCounts['maintenance'] = await Pallet.count({
                            where: {
                                customer: customerCode,
                                status: 3,
                            },
                        });



                    } else if (req.user.role === 'admin') {
                        // Jika user memiliki role 'admin', tampilkan data Pallet dengan departemen yang sesuai
                        const allowedDepartments = req.department.map((department) => department.department_id);

                        palletCounts['total'] = await Pallet.count({
                            include: {
                                model: Vehicle,
                                attributes: {
                                    include: ['department']
                                }
                            },
                            where: {
                                customer: customerCode,
                                '$Vehicle.department$': { [Op.in]: allowedDepartments },
                            },
                        });

                        palletCounts['keluar'] = await Pallet.count({
                            include: {
                                model: Vehicle,
                                attributes: {
                                    include: ['department']
                                }
                            },
                            where: {
                                customer: customerCode,
                                status: 0,
                                '$Vehicle.department$': { [Op.in]: allowedDepartments },
                            },
                        });

                        palletCounts['tersedia'] = await Pallet.count({
                            include: {
                                model: Vehicle,
                                attributes: {
                                    include: ['department']
                                }
                            },
                            where: {
                                customer: customerCode,
                                status: 1,
                                '$Vehicle.department$': { [Op.in]: allowedDepartments },
                            },
                        });

                        palletCounts['maintenance'] = await Pallet.count({
                            include: {
                                model: Vehicle,
                                attributes: {
                                    include: ['department']
                                }
                            },
                            where: {
                                customer: customerCode,
                                status: 3,
                                '$Vehicle.department$': { [Op.in]: allowedDepartments },
                            },
                        });
                    }
                    return {
                        customer: customer['name'],
                        Total: palletCounts.total,
                        Tersedia: palletCounts.tersedia,
                        Keluar: palletCounts.keluar,
                        Maintenance: palletCounts.maintenance,
                    };
                });


                const customerPallets = await Promise.all(customerPromises);

                res.status(200).json({
                    data : {
                        chartStok : customerPallets,
                        totalPallet,
                        totalStokPallet,
                        totalPalletKeluar,
                        totalPalletRepair,
                        historyPallet,
                        totalPaletMendep,
                        paletMendep
                    }
                });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
    }
}
const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
