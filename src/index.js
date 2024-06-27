import connectDB from "./db/index.js";
import { app } from './app.js';
import dotenv from "dotenv";
dotenv.config({ path: './env' });

const PORT = process.env.PORT || 8012;

// Connect to the database
connectDB()
  .then(() => {
    // Start the server once the database connection is successful
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Process terminated');
      });
    });

    // Error handling
    app.on("error", (error) => {
      console.error("ERROR: ", error);
      throw error;
    });
  })
  .catch((error) => {
    console.error(`MongoDB Connection Failed!!!! ${error}`);
  });
