module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './Components',
          '@screens': './Screen',
          '@assets': './Assets',
          '@utils': './Utils',
          '@template': './Template',
          '@core': './Components/Core',
          '@services': './Services',
          '@navigation': './Navigation',
          '@typed': './Types',
          '@hooks': './Hooks',
          '@redux': './Redux',
          '@config': './Config',
        },
      },
    ],
    'react-native-reanimated/plugin', 
  ],
};
