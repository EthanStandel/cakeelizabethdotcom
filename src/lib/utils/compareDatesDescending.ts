export const compareDatesDescending = (a?: string, b?: string): number => {
  const timeA = a ? Date.parse(a) : Number.NEGATIVE_INFINITY;
  const timeB = b ? Date.parse(b) : Number.NEGATIVE_INFINITY;
  return timeB - timeA;
};
