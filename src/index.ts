import Debug from 'debug';
import app from './app';
import config from './config';

const debug = Debug('rooms:server');

const { port } = config;
app.set('port', port);

app.listen(port, () => {
  const addr = app.get('port');
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${addr}`);
  /* eslint-enable no-console */
  debug(`Listening on ${bind}`);
});
