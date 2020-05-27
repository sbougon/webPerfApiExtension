//const SERVER = "http://localhost:3002"; // local debug
const SERVER = "https://lwc-logline.herokuapp.com";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkForAiltn);
} else {
  // `DOMContentLoaded` already fired
  checkForAiltn();
}

function getHTMLToInsert(ailtn) {
  let ailtnObject;
  let eptMS;
  let epts,
    etpsHTML = "";
  let deviated,
    deviatedHTML = "";
  let payload;
  let index;
  let title = "";
  try {
    index = ailtn.indexOf('{"schemaId":"LightningPageView"');
    if (index > 0) {
      payload = ailtn.substring(index);
      ailtnObject = JSON.parse(payload);
      eptMS = ailtnObject.ept;
      epts = Math.round(eptMS / 100);
      epts = epts / 10;
      if (ailtnObject.attributes) {
        deviated = ailtnObject.attributes.eptDeviation;
      }
      etpsHTML = `<div><b>EPT</b>: ${epts}s</div>`;
      deviatedHTML = `<div><b>Deviated</b>: ${deviated}</div>`;
      title = `EPT ${epts}, Deviated: ${deviated}`;
    }
  } catch (e) {
    console.log(ailtn);
    console.error("Could not parse the ailtn: ", e, index, ailtn);
  }
  const html = `<a 
                  onclick="event.stopPropagation();" 
                  href="${SERVER}/logtype/ailtn/logline#${btoa(
    encodeURIComponent(ailtn)
  )}" 
                  target="_blank"
                  title="${title}"
                  style="padding: 0; margin-left: 6px; display: block" >
                    ${getSVG(title)}
                  </a>`;
  return html;
}

// main entry function. Adds the link to the logline viewer
function checkForAiltn() {
  // Select the node that will be observed for mutations
  const targetNode = document.body;

  const config = { childList: true, subtree: true };

  let lastTimestamp = window.performance.now()
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        let now = window.performance.now();
        if (now - lastTimestamp > 500) {
            lastTimestamp = now;
            checkForAiltnOnce();        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// check for the presence of a AILTN log line
// TODO: need to get the list of supported loglines
function checkForAiltnOnce() {
  console.log("Updating the DOM with links to LWC logline");

  const dataRow = document.querySelectorAll(
    "tr.shared-eventsviewer-table-body-secondaryrow:not(.ailtned)"
  );
  const metadataRow = document.querySelectorAll(
    "tr.shared-eventsviewer-table-body-primaryrow:not(.ailtned)"
  );
  if (dataRow.length > 0) {
    dataRow.forEach((row, index) => {
      const div = row.querySelector(".raw-event.normal.wrap");
      if (div.textContent.substring(0, 5) === "ailtn") {
        let ailtnString = div.textContent;
        // row.querySelector('.shared-eventsviewer-shared-rawfield').setAttribute("style", "background-color: yellow");
        // metadataRow.item(index).querySelector('._time-drilldown').setAttribute("style", "background-color: yellow");
        const futurLinkHolder = metadataRow
          .item(index)
          .querySelector(".expands");
        row.classList.add("ailtned");
        const waterfallLink = document.createElement("div");
        waterfallLink.innerHTML = getHTMLToInsert(ailtnString);
        futurLinkHolder.appendChild(waterfallLink);
      }
    });
  } else {
    const rows = document.querySelectorAll(
      "tr.shared-eventsviewer-list-body-row:not(.ailtned)"
    );
    rows.forEach((row, index) => {
      const div = row.querySelector(".raw-event.normal.wrap");
      const span = row.querySelector(".raw-event.normal.wrap").firstChild;
      if (span.textContent === "ailtn") {
        let ailtnString = div.textContent;
        const futurLinkHolder = row.querySelector(".expands");
        row.classList.add("ailtned");
        const waterfallLink = document.createElement("div");
        waterfallLink.innerHTML = getHTMLToInsert(ailtnString);
        futurLinkHolder.appendChild(waterfallLink);
      }
    });
  }
}
// later optim
function checkForAiltnWithIntersection() {
  const targetNode = document.getElementsByClassName("tab-content")[0];

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  const callback = function(mutationsList, observer) {
    alert("in callback");
    for (let mutation of mutationsList) {
      if (mutation.type === "subtree") {
        console.log("the subtree was modified");
      } else if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function getSVG(title) {
  return `<?xml version="1.0" encoding="iso-8859-1"?>
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     title="${title}" viewBox="0 0 100 100"  xml:space="preserve" style="height:23px; width:23px; border: 1px solid grey;">
  <g>
    <g>
      <g id="XMLID_18_">
        <g>
            <rect x="0" y="0" style="fill:#4CAF50;" width="100" height="10" />
            <rect x="10" y="10" style="fill:#e91e63;" width="30" height="10" />
            <rect x="10" y="20" style="fill:#03a9f4;" width="25" height="10" />
            <rect x="30" y="30" style="fill:#e91e63;" width="40" height="10" />
            <rect x="30" y="40" style="fill:#03a9f4;" width="25" height="10" />
            <rect x="40" y="50" style="fill:#ffeb3b;" width="60" height="10" />
            <rect x="50" y="60" style="fill:#e91e63;" width="15" height="10" />
            <rect x="50" y="70" style="fill:#03a9f4;" width="10" height="10" />
            <rect x="60" y="80" style="fill:#ffeb3b;" width="40" height="10" />
            <rect x="80" y="90" style="fill:#e91e63;" width="20" height="10" />
        </g>
      </g>
    </g>
  </g> 
  </svg>
  `;
}
