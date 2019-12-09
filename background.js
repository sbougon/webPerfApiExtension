// chrome.browserAction.setBadgeText({ text: "" });


// // on click: display the perf results
// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.browserAction.setBadgeText({ text: "⌛️" });
// //  chrome.tabs.executeScript(tab.id, { file: "webPerfAPIs.js" });
//   chrome.tabs.executeScript(tab.id, { file: "webPerfAPIs.js" });
// });


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   let score = request.score;
//   if (score === 0) {
//     score = "";
//   } else {
//     score = score + "";
//   }
//   chrome.browserAction.setBadgeText({ text: score });
// });
