import User from "@/models/User";
import bcrypt from "bcrypt";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const userId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await User.destroy({
                    where: {
                        id: userId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "User deleted successfully"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        case 'PUT':
            try {
                const userId = req.query.kode;
                const newUser = req.body
                const hash = bcrypt.hashSync(newUser.password, 10);
                await User.update({
                    password: hash
                },{
                    where: {
                        id: userId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "User Updated Successfully"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
