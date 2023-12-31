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
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["slaymghmzvxilnmdjugm.supabase.co"],
  },
});
