module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@services": "./src/services",
            "@store": "./src/store",
            "@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@constants": "./src/constants",
            "@types": "./src/types",
            "@assets": "./src/assets",
            "@config": "./src/config",
            "@contexts": "./src/contexts",
          },
        },
      ],
    ],
  };
};
