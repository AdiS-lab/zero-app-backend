import mongoose from "mongoose";
import type { Mongoose } from "mongoose";

import logger from "../logs/logger";

async function dbConnection(uri: string): Promise<Mongoose | null> {
  try {
    const connection = await mongoose.connect(uri, {
      autoIndex: true,
      autoCreate: true,
    });
    return connection;
  } catch (error) {
    logger.error("DATABASE CONNECTION: error:", error);
    return null;
  }
}

export default dbConnection;

// import mongoose from 'mongoose'

// function startDbConnection(uri: string, appListen: () => unknown) {
//   let server: any;

//   mongoose
//     .connect(uri)
//     .then(() => {
//       server = appListen();
//       console.log('DATABASE CONNECTION: successful');
//     })
//     .catch((err) => {
//       console.error('DATABASE CONNECTION: error:', err);
//     });

//   return server;
// }

// export default startDbConnection;
