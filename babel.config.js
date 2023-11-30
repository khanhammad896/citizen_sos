module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".svg", ".png"],
        alias: {
          "@assets": "./src/assets",
          "@config": "./src/config",
          "@components": "./src/components",
          "@contexts": "./src/contexts",
          "@framework": "./src/framework",
          "@hooks": "./src/hooks",
          "@locales": "./src/locales",
          "@navigation": "./src/navigation",
          "@screens": "./src/screens",
          "@theme": "./src/theme",
          "@utils": "./src/utils",
        },
      },
    ],
    "@babel/plugin-transform-export-namespace-from",
    [
      "react-native-reanimated/plugin",
      {
        relativeSourceLocation: true,
      },
    ],
  ],
};
