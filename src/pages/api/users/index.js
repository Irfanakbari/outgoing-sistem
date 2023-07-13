import User from "@/models/User";
import bcrypt from "bcrypt";
import {getCookie} from "cookies-next";
import checkCookieMiddleware from "@/pages/api/middleware";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                console.log(getCookie('@vuteq-corp',{req, res}))
                const users = await User.findAll()
                res.status(200).json({
                    ok : true,
                    data : users
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            try {
                const newUser = req.body; // Anggap req.body berisi data pelanggan baru
                const hash = bcrypt.hashSync(newUser.password, 10);
                const user = await User.create({
                    username : newUser.username,
                    password : hash
                });
                res.status(201).json({
                    ok: true,
                    data: "Success"
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