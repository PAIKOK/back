import "dotenv/config";   // 🔥 MUST be first
import { app } from "./app";
import { initDb } from "./db";

async function start() {
    try {
        await initDb();

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`🚀 API server running on port ${port}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed", err);
        process.exit(1);
    }
}

start();
