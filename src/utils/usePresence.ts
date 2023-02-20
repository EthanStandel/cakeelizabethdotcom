import usePresenceBase from "use-presence";

export const usePresence = (
  arg1: Parameters<typeof usePresenceBase>[0],
  arg2: Parameters<typeof usePresenceBase>[1] = { transitionDuration: 250 }
) => usePresenceBase(arg1, arg2);
