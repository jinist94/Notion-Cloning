const ROUTE_CHANGE_EVENT_NAME = "route-change";

export const inItRouter = (callback) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, (e) => {
    const { nextUrl } = e.detail;
    history.pushState(null, null, nextUrl);
    callback();
  });
};

export const push = (nextUrl) => {
  window.dispatchEvent(
    new CustomEvent("route-change", {
      detail: {
        nextUrl,
      },
    })
  );
};
