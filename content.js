// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "applyStyles") {
//     const { fontFamily, fontSize } = message;

//     // Add style to body
//     const styleGlobal = document.createElement("style");
//     styleGlobal.innerHTML = `
//           * {
//               font-family: ${fontFamily} !important;
//               font-size: ${fontSize}px !important;
//               line-height: 1.5 !important;
//           }
//       `;
//     document.head.appendChild(styleGlobal);

//     sendResponse({ status: "Styles Applied" });
//   }
// });
