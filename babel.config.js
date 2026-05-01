module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // babel-preset-expo injects react-native-worklets/plugin (last) when
    // react-native-worklets is installed — required for Reanimated 4.
    // Do not add expo-router/babel (deprecated since SDK 50; preset covers Router).
  };
};
