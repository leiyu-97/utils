/**
 * @module os
 */
const os = require('os');

/**
 * @static
 * @summary 获取本机 IP
 * @return {String} 本机 IP
 */
function getIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }

  return undefined;
}

/**
 * @static
 * @summary 获取十六进制的本机 IP
 * @return {String} 十六进制的本机 IP
 */
function getHexIPAddress() {
  const IP = getIPAddress();
  return IP.replace(/\d+\.?/gi, (num) => parseInt(num).toString(16).padStart(2, '0'));
}

module.exports = {
  getIPAddress,
  getHexIPAddress,
};
