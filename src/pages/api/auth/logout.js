import {deleteCookie} from "cookies-next";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                deleteCookie('@vuteq-1-token',{req, res});

                res.status(200).json({
                    ok: true,
                    data: 'Logout Berhasil'
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
