export const toSentenceCase = (text?: string) => {
  if (!text) return text;
  return text.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
};

export const replaceUnderScores = (text?: string) => {
  if (!text) return text;
  return text.replace(/_/g, function () {
    return " ";
  });
};