const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 한글 경로 관련 설정
config.resolver.sourceExts = [...config.resolver.sourceExts];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;