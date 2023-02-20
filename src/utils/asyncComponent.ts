// thanks to cramforce for this
// https://gist.github.com/cramforce/b5e3f0b103f841d2e5e429b1d5ac4ded
export const asyncComponent = <T, R>(
  fn: (arg: T) => Promise<R>
): ((arg: T) => R) => {
  return fn as (arg: T) => R;
};

// why does this exist???
// https://www.youtube.com/watch?v=h_9Vx6kio2s
