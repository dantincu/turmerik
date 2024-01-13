let docLoadHandlerExecuted = false;

const onDocLoad = () => {
  if (!docLoadHandlerExecuted) {
    docLoadHandlerExecuted = true;
    const anchors = document.querySelectorAll("a[data-url]");

    for (let anchor of anchors) {
      const url = anchor.getAttribute("data-url");
      const href = anchor.getAttribute("href");
      
      if (url && !href) {
        anchor.setAttribute("href", url);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", onDocLoad);

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(onDocLoad, 1);
}
