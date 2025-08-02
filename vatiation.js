
export const fadeDirection = (direction = "up", delay = 0, duration = 0.6) => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});
