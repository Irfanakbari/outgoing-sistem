import Pallet from "@/models/Pallet";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const { page } = req.query;
            try {
                if (req.user.role !== 'super' && req.user.role !== 'admin') {
                    res.status(401).json({
                        ok: false,
                        data: "Role must be admin"
                    });
                }
                // Menghitung offset berdasarkan halaman dan batasan data
                const offset = (parseInt(page) - 1) * parseInt('20');

                const pallets = await Pallet.findAndCountAll({
                    where: {
                        status: 3,
                    },
                    limit: parseInt('20'),
                    offset: offset,
                });

                const totalPages = Math.ceil(pallets.count / parseInt('20'));

                res.status(200).json({
                    ok: true,
                    data: pallets.rows,
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

        case 'PUT':
            const { kode } = req.body;
            try {
                const pallet = await Pallet.findOne({
                    where: {
                        kode: kode
                    }
                });

                if (!pallet) {
                    res.status(404).json({
                        ok: false,
                        data: "Pallet tidak ditemukan"
                    });
                } else {
                    let newStatus;
                    if (pallet.status === 3) {
                        newStatus = 1;
                    } else {
                        newStatus = 3;
                    }

                    await Pallet.update({
                        status: newStatus
                    }, {
                        where: {
                            kode: kode
                        }
                    });

                    res.status(200).json({
                        ok: true,
                        data: "Sukses"
                    });
                }
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
