module.exports = {
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  testMatch: ['<rootDir>/**/__test__/*.test.(js|jsx|ts|tsx)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
