import usePresenceBase, {
  usePresenceSwitch as usePresenceSwitchBase,
} from "use-presence";

// default
const transitionDuration = 250;

export const usePresence = (
  arg1: Parameters<typeof usePresenceBase>[0],
  arg2: Parameters<typeof usePresenceBase>[1] = { transitionDuration }
) => usePresenceBase(arg1, arg2);

export const usePresenceSwitch = <ItemType>(
  arg1: ItemType,
  arg2: Parameters<typeof usePresenceSwitchBase>[1] = { transitionDuration }
) => usePresenceSwitchBase(arg1, arg2);
