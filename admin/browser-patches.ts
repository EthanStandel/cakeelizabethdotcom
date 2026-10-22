// Suppress "Changes you made may not be saved." navigation dialog (dev only)
if (import.meta.env.DEV) {
  const nativeAddEventListener = window.addEventListener.bind(window);
  (window as any).addEventListener = (
    type: string,
    listener: any,
    options?: any
  ) => {
    if (type === "beforeunload") return;
    nativeAddEventListener(type, listener, options);
  };
}

// Suppress & auto-accept local backup requests
const nativeConfirm = window.confirm.bind(window);
window.confirm = (message?: string) => {
  if (
    message ===
    "A local backup was recovered for this entry, would you like to use it?"
  ) {
    return true;
  }
  return nativeConfirm(message);
};
