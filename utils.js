const logger = require("./logger");

const asyncMiddleware = handler => {
	return async (req, socket, head) => {
		Promise.resolve(handler(req, socket, head)).catch(error => {
			logger.log("error", `${error}`);
			socket.write(`HTTP/1.1 500 ${error.message}\r\n`);
			socket.end();
		});
	};
};

module.exports = {
	asyncMiddleware
};
