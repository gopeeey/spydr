export const getStrAfter = (str: string, after: string) => {
  return str.split(after).slice(1).join(after);
};
