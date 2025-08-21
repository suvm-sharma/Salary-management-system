const httpStatus = require("http-status");
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes/v1");
const ApiError = require("./utils/ApiError");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Route Not found"));
});

module.exports = app;
