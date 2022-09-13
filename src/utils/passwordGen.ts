const passwordGen = (passwordLength = 8): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let passwordGenerated = "";
  for (let i = 0, n = charset.length; i < passwordLength; ++i) {
    passwordGenerated += charset.charAt(Math.floor(Math.random() * n));
  }
  return passwordGenerated;
};

export default passwordGen;
