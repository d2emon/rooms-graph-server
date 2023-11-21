// import path from 'path';

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(value: string) {
  const portNumber = parseInt(value, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return value;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

export default {
  mongo: {
    url: process.env.MONGO || 'mongodb://mongo/rooms',
  },
  dataServer: 'http://data-server:5000',
  //
  port: normalizePort(process.env.PORT || '3000'),
  // roomsPath: process.env.ROOM_PATH || path.join(__dirname, '..', 'data', 'files'),
};
