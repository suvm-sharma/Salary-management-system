const http = require("http");
const app = require("./app");
const models = require("./db/model");
const config = require("./config/config");

// Sync database
models.sequelize.sync();

const server = http.Server(app);

const port = config.port || 3000;

server.listen(port, () => {
    console.log(`App is listening on port ${config.port}`);
});
