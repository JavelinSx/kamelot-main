// composables/useBreakpoints.ts - Респонсив
export function useBreakpoints() {
  const windowWidth = ref(0);

  const updateWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const xs = computed(() => windowWidth.value >= breakpoints.xs);
  const sm = computed(() => windowWidth.value >= breakpoints.sm);
  const md = computed(() => windowWidth.value >= breakpoints.md);
  const lg = computed(() => windowWidth.value >= breakpoints.lg);
  const xl = computed(() => windowWidth.value >= breakpoints.xl);
  const xxl = computed(() => windowWidth.value >= breakpoints["2xl"]);

  const isMobile = computed(() => windowWidth.value < breakpoints.md);
  const isTablet = computed(
    () =>
      windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg
  );
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg);

  if (import.meta.client) {
    onMounted(() => {
      updateWidth();
      window.addEventListener("resize", updateWidth);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateWidth);
    });
  }

  return {
    windowWidth: readonly(windowWidth),
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    isMobile,
    isTablet,
    isDesktop,
  };
}
