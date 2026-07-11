import mongoose from 'mongoose'

function startDbConnection(uri: string, appListen: () => unknown) {
  let server: any;

  mongoose
    .connect(uri)
    .then(() => {
      server = appListen();
      console.log('DATABASE CONNECTION: successful');
    })
    .catch((err) => {
      console.error('DATABASE CONNECTION: error:', err);
    });

  return server;
}

export default startDbConnection;