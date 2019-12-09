const SERVER = 'http://localhost:3001'; // local debug
//const SERVER = 'https://logline.herokuapp.com';
//const SERVER = 'https://lwc-logline.herokuapp.com';

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkForAiltn);
} else {
  // `DOMContentLoaded` already fired
  checkForAiltn();
}

function getHTMLToInsert(ailtn) {
  let ailtnObject;
  let eptMS;
  let epts = 'unknown'
  let deviated = 'unknown'
  try {
    ailtnObject = JSON.parse(ailtn);
    eptMS = ailtnObject.ept;
    epts = Math.round(eptMS / 100);
    epts = epts / 10;
    if (ailtnObject.attributes) {
      deviated = ailtnObject.attributes.eptDeviation;
    }
  } catch (e) {
    console.log(ailtn);
    console.error("Could not parse the ailtn: ", e)
  }
  const html = `<a 
                  onclick="event.stopPropagation();" 
                  href="${SERVER}?type=ailtn:lightningPageView&payload=${btoa(ailtn)}" 
                  target="_blank"
                  style="margin-top: 20px; display: block" >
                    ${getSVG()}
                    <div><b>EPT</b>: ${epts}s</div>
                    <div><b>Deviated</b>: ${deviated}</div>
                    <div>Click to open</div>
                  </a>`
  return html;
}


function checkForAiltn () {
  setInterval(function () {
    document.querySelectorAll('tr.shared-eventsviewer-list-body-row:not(.ailtned)').forEach(row => {
      const span = row.querySelector('.raw-event.normal.wrap > :first-child');
      if (span.textContent === 'ailtn') {
        let ailtnString = span.parentNode.textContent;
        if (ailtnString.match(/ltng:pageView/) !== null) {
          row.setAttribute('style','background-color: yellow')
          span.setAttribute('style', 'background-color:pink');
          const futurLinkHolder = row.querySelector('._time span');
          const index = ailtnString.indexOf('{"schemaId":"LightningPageView"')
          if (futurLinkHolder && index) {
            ailtnString = ailtnString.substring(index)
            row.classList.add('ailtned')
            const waterfallLink = document.createElement('div')
            waterfallLink.innerHTML = getHTMLToInsert(ailtnString)
            futurLinkHolder.parentNode.appendChild(waterfallLink)
            console.log(ailtnString)
          }
        }
      }
    }) 
  }, 500)
}

// later optim
function checkForAiltnWithIntersection() {
  const targetNode = document.getElementsByClassName("tab-content")[0];

  // Options for the observer (which mutations to observe)
  const config = {childList: true, subtree: true };

  const callback = function(mutationsList, observer) {
    alert("in callback")
    for(let mutation of mutationsList) {
        if (mutation.type === 'subtree') {
          console.log('the subtree was modified');
        }
        else if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
        }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function getSVG() {
  return `<?xml version="1.0" encoding="iso-8859-1"?>
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 100 100"  xml:space="preserve" style="height:50px; width:50px; border: 1px solid grey;margin-left: 17px;">
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