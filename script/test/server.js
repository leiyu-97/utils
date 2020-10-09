const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const http = require('http');

class Server {
  constructor() {
    const app = new Koa();

    app.use(serve(
      path.resolve(__dirname, '../../'),
    ));

    this.server = http.createServer(app.callback()).listen(3000);
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  }
}

module.exports = Server;
