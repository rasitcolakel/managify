const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "tr"],
  },
  localePath: path.resolve("./public/locales"),
};
