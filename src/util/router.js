const ROUTE_CHANGE_EVENT_NAME = "route-change";

export const inItRouter = (callback) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, (e) => {
    const { nextUrl } = e.detail;
    history.pushState(null, null, nextUrl);
    callback();
    // url을 변경하고 route를 호출함으로써 페이지를 다시 그린다.
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
