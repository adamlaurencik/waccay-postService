export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export function isNormalInteger(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
