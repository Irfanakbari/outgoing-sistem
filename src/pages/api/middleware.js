import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import User from "@/models/User";

const checkCookieMiddleware = (handler) => async (req, res) => {
    try {
        const cookies = getCookie('@vuteq-1-token', { req, res });
        if (!cookies) {
            // Jika cookie tidak ada, kirim tanggapan error "Unauthorized"
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(cookies, 'vuteqcorp');
        if (!decoded) {
            // Jika cookie tidak valid, kirim tanggapan error "Token Invalid"
            return res.status(401).json({ error: 'Token Invalid' });
        }

        const user = await User.findOne({
            where: {
                uid: decoded.uid,
            },
            attributes: {
                exclude: ['password'],
            },
        });

        if (!user) {
            // Jika user tidak ditemukan, kirim tanggapan error "Unauthorized"
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Jika cookie dan token valid, lanjutkan ke handler API dengan menambahkan user ke req object
        req.user = user;
        return handler(req, res);
    } catch (e) {
        // Tangani kesalahan apapun yang terjadi selama eksekusi kode dan kirim tanggapan error "Internal Server Error"
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default checkCookieMiddleware;
