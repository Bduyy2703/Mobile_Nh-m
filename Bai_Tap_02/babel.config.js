module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ".",
          extensions: [".ts", ".tsx", ".jsx", ".js", ".json", ".svg", ".jpg"],
          alias: {
            "~/*": "./src",
            "@components": "./src/components",
            // "@screens": "./src/screens",
            // "@routes": "./src/routes",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
