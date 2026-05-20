export const PATH_MARGIN_FRACTION = 0.1;
export const PATH_STROKE_COLOR = "#c99a3f";
export const PATH_STROKE_WIDTH = 2;
export const PATH_DASH_ARRAY = "3 12";
export const PLANE_SIZE = 48;
export const SAMPLE_STEP_PX = 4;
export const SPRING_K = 9;
export const ANGLE_SMOOTH_PX = 36;
// Max progress-delta per frame before we bypass trail throttling.
// At 0.01 progress on a ~6000px path, that's ~60px/frame of trail growth —
// any faster and the throttled reveal looks like steps, so we sync 1:1.
export const TRAIL_THROTTLE_BYPASS_DELTA = 0.005;
