const { i18n } = require("./next-i18next.config");
const removeImports = require("next-remove-imports")();
module.exports = removeImports({
  i18n,
  experimental: {
    newNextLinkBehavior: true,
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
});
