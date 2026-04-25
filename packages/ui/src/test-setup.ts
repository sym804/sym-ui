import "@testing-library/jest-dom/vitest";

// jsdom does not implement ResizeObserver; cmdk and some Radix primitives need it.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

// jsdom does not implement Element.scrollIntoView; cmdk calls it on mount.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}
