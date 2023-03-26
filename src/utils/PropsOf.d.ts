export type PropsOf<Component extends (...args: Array<unknown>) => unknown> =
  Parameters<Component>[0];
