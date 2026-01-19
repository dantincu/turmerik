export const initialLoaderKillSwitchScript = `
  // This runs as soon as React is loaded and executing
  const windowLoaded = () => {
    var loader = document.getElementById('trmrk-app-initial-loader');
    if (loader) {
      loader.style.display = 'none';
    }

    window.removeEventListener('load', windowLoaded);
  };

  window.addEventListener('load', windowLoaded);
`;

export const initialLoaderStyles = [
  "#trmrk-app-initial-loader {",
  "    position: fixed;",
  "    top: 0;",
  "    left: 0;",
  "    width: 100vw;",
  "    height: 100vh;",
  "    display: flex;",
  "    align-items: center;",
  "    justify-content: center;",
  "    background: white;",
  "    color: black;",
  "    z-index: 9999;",
  "    font-family: sans-serif;",
  "    font-size: 16px;",
  "}",
  "",
  "#trmrk-app-initial-loader .spinner {",
  "    animation: trmrk-initial-loader-fadeIn 0.5s infinite alternate;",
  "}",
  "",
  "@keyframes trmrk-initial-loader-fadeIn {",
  "    from { opacity: 0.5; }",
  "    to { opacity: 1; }",
  "}",
  "",
  ".dark #trmrk-app-initial-loader {",
  "    background: #000;",
  "    color: #fff;",
  "}",
].join("\n");
