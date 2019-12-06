export function setWindowHeight() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// if (ResizeObserver) {
//   const body = document.querySelector("body > div");
//   const resizeObserver = new ResizeObserver(entries => {
//     console.log(entries);
//     // for (let entry of entries) if (entry.contentBoxSize) setWindowHeight();
//   });
//   resizeObserver.observe(body);
// }
