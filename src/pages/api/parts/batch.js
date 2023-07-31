import checkCookieMiddleware from "@/pages/api/middleware";
import Part from "@/models/Part";

async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        }

        const { data } = req.body;
        console.log(data);

        if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, error: 'Invalid data format. Expected an array.' });
        }

        const createPromises = data.map(async e => {
            try {
                await Part.create({ id_part: e });
            } catch (error) {
                // Do nothing when encountering a duplicate error
                if (error.name !== 'SequelizeUniqueConstraintError') {
                    throw error; // Throw other errors to be caught by the global catch block
                }
            }
        });

        await Promise.all(createPromises);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
