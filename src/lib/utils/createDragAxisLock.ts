export type DragAxis = "x" | "y";

const AXIS_LOCK_THRESHOLD_PX = 8;

export const createDragAxisLock = (lockAxis: DragAxis) => {
  let startX: number | null = null;
  let startY: number | null = null;
  let axis: DragAxis | null = null;

  const reset = () => {
    startX = null;
    startY = null;
    axis = null;
  };

  const move = (x: number, y: number) => {
    if (startX === null || startY === null) {
      startX = x;
      startY = y;
      axis = null;
      return;
    }
    if (axis === null) {
      const dx = Math.abs(x - startX);
      const dy = Math.abs(y - startY);
      if (Math.max(dx, dy) > AXIS_LOCK_THRESHOLD_PX) axis = dx > dy ? "x" : "y";
    }
  };

  return {
    reset,
    move,
    get locked() {
      return axis === lockAxis;
    },
    get hasMoved() {
      return axis !== null;
    },
  };
};
