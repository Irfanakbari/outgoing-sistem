import log4js from "log4js";

log4js.configure({
    appenders: { cheese: { type: "file", filename: "db.log" } },
    categories: { default: { appenders: ["cheese"], level: "debug" } },
});

const logger = log4js.getLogger("cheese");

export default logger