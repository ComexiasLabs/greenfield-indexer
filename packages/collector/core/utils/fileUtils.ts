export const encodeForFilePath = (str?: string) => {
  if (!str) {
    return str;
  }
  return str.replace(/[\/\\?%*:|"<>]/g, "-");
};
