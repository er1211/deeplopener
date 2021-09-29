chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { message: "cancelSelectionMode" },
    function (res) {
      if (chrome.runtime.lastError) {
      }
    }
  );
});
chrome.runtime.sendMessage(
  { message: "pleaseApiKey", runtimeflag: true },
  function (res) {
    if (chrome.runtime.lastError) {
    }
  }
);
let api_key = "";
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "got_apikey") {
    if (request.error) {
      alert(
        "To use this extension, please sign in to chrome and sync turns on.\n\nIf you are interested in another version that can be used without chrome synchronization, please check DeepLopener's GitHub repository."
      );
    } else {
      api_key = request.api_key;
      restore_translogTable();
    }
    sendResponse();
  }
});

function winclose() {
  window.close();
}

function restore_options() {
  chrome.storage.sync.get(
    {
      target: "EN-US",
    },
    function (items) {
      document.querySelector("#target").value = items.target;
    }
  );
}

function change() {
  chrome.storage.sync.set(
    {
      target: document.querySelector("#target").value,
    },
    function () {}
  );
}

function translateDocs() {
  if (document.querySelector("#selectedfiles").firstChild) {
    for (let i = 0; i < files.length; i++) {
      translate(files[i]);
    }
  }
  let selectedfiles = document.querySelector("#selectedfiles");
  while (selectedfiles.firstChild) {
    selectedfiles.removeChild(selectedfiles.firstChild);
  }
}

function translate(file) {
  chrome.storage.sync.get(null, function (items) {
    let target_lang = items.target;
    let freeflag = items.freeflag;
    if (typeof target_lang === "undefined") {
      target_lang = "EN-US";
    }
    let api_url;
    if (freeflag == "Free") {
      api_url = "https://api-free.deepl.com/v2/document";
    } else {
      api_url = "https://api.deepl.com/v2/document";
    }
    let params = {
      file: file,
      auth_key: api_key,
      target_lang: target_lang,
    };
    let data = new FormData();
    Object.keys(params).forEach((key) => data.append(key, params[key]));
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;boundary='boundary'",
      },
      body: data,
    };
    delete options.headers["Content-Type"];
    fetch(api_url, options).then((res) => {
      if (res.status == "200") {
        res.json().then((resData) => {
          updateBadgeText(freeflag);
          chrome.storage.local.get(null, function (items) {
            let translatingData = items.translatingData;
            let date = new Date();
            date = date.toLocaleString();
            translatingData.push({
              date: date,
              fileName: file.name,
              target_lang: target_lang,
              docid: resData.document_id,
              dockey: resData.document_key,
            });
            chrome.storage.local.set(
              {
                translatingData: translatingData,
              },
              function () {
                check(
                  false,
                  null,
                  null,
                  date,
                  file.name,
                  target_lang,
                  resData.document_id,
                  resData.document_key
                );
              }
            );
          });
        });
      } else {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { message: "alertError", res: res },
              function (res) {
                if (chrome.runtime.lastError) {
                }
              }
            );
          }
        );
      }
    });
  });
}

function updateBadgeText(freeflag) {
  let url;
  if (freeflag == "Free") {
    url = "https://api-free.deepl.com/v2/usage";
  } else {
    url = "https://api.deepl.com/v2/usage";
  }
  let params = {
    auth_key: api_key,
  };
  let data = new URLSearchParams();
  Object.keys(params).forEach((key) => data.append(key, params[key]));
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; utf-8",
    },
    body: data,
  }).then((res) => {
    res.json().then((resData) => {
      let percent = Math.trunc(
        (resData.character_count / resData.character_limit) * 100
      );
      console.log(
        "DeepLopener: " +
          resData.character_count +
          "/" +
          resData.character_limit +
          " characters translated.\n"
      );
      chrome.runtime.sendMessage(
        { message: "updateBadgeText", text: percent },
        function (res) {
          if (chrome.runtime.lastError) {
          }
        }
      );
    });
  });
}

function check(
  updateflag,
  cellText,
  oldrow,
  date,
  fileName,
  target_lang,
  docid,
  dockey
) {
  chrome.storage.sync.get(null, function (items) {
    let freeflag = items.freeflag;
    let url;
    if (freeflag == "Free") {
      url = "https://api-free.deepl.com/v2/document/";
    } else {
      url = "https://api.deepl.com/v2/document/";
    }
    url += docid;
    let params = {
      auth_key: api_key,
      document_key: dockey,
    };
    let data = new URLSearchParams();
    Object.keys(params).forEach((key) => data.append(key, params[key]));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; utf-8",
      },
      body: data,
    }).then((res) => {
      res.json().then((resData) => {
        let transdatalist = [date, fileName, target_lang, resData.status];
        let row = document.createElement("tr");
        row.className = "transRow";
        for (let i = 0; i < transdatalist.length; i++) {
          if (!updateflag) {
            let cell = document.createElement("td");
            cellText = document.createElement("span");
            cellText.textContent = transdatalist[i];
            cell.appendChild(cellText);
            row.appendChild(cell);
          } else {
            cellText.textContent = transdatalist[i];
            row = oldrow;
          }
          if (i == transdatalist.length - 1) {
            if (resData.status == "done") {
              cellText.className = "done";
              let reg = /(.*)(?:\.([^.]+$))/;
              let newFileName =
                fileName.match(reg)[1] +
                "_" +
                target_lang +
                "." +
                fileName.match(reg)[2];
              cellText.addEventListener("click", () => {
                dl(row, newFileName, docid, dockey);
              });
            } else if (resData.status == "translating") {
              cellText.className = "translating";
              if (!isNaN(resData.seconds_remaining)) {
                cellText.textContent =
                  transdatalist[i] + " (" + resData.seconds_remaining + ")";
              }
              cellText.addEventListener("click", () => {
                //recheck status(updateflag=true)
                check(
                  true,
                  cellText,
                  row,
                  date,
                  fileName,
                  target_lang,
                  docid,
                  dockey
                );
              });
            } else if (resData.status == "error") {
              cellText.className = "error";
              function remove() {
                row.remove();
                removeLocalData(docid);
              }
              setTimeout(remove, 3000);
            }
          }
        }
        document.querySelector("#tbody_translogTable").appendChild(row);
      });
    });
  });
}

function restore_translogTable() {
  chrome.storage.local.get(null, function (items) {
    let translatingDatalist = items.translatingData;
    if (!items.translatingData) {
      // 過去verからアップデートした場合items.translatingDataがなくてエラーになる
      chrome.storage.local.set(
        {
          translatingData: [],
        },
        function () {}
      );
    }
    translatingDatalist.forEach((translatingData) => {
      check(
        false,
        null,
        null,
        translatingData.date,
        translatingData.fileName,
        translatingData.target_lang,
        translatingData.docid,
        translatingData.dockey
      );
    });
  });
}

function removeLocalData(docid) {
  chrome.storage.local.get(null, function (items) {
    let translatingDatalist = items.translatingData.filter(
      (element) => element.docid != docid
    );
    chrome.storage.local.set(
      {
        translatingData: translatingDatalist,
      },
      function () {}
    );
  });
}

function dl(row, fileName, docid, dockey) {
  chrome.storage.sync.get(null, function (items) {
    let freeflag = items.freeflag;
    let url;
    if (freeflag == "Free") {
      url = "https://api-free.deepl.com/v2/document/";
    } else {
      url = "https://api.deepl.com/v2/document/";
    }
    url += docid + "/result";
    let params = {
      auth_key: api_key,
      document_key: dockey,
    };
    let data = new URLSearchParams();
    Object.keys(params).forEach((key) => data.append(key, params[key]));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; utf-8",
      },
      body: data,
    }).then((res) => {
      if (res.status == "200") {
        res.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
          row.remove();
          removeLocalData(docid);
        });
      } else {
        row.remove();
        removeLocalData(docid);
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { message: "alertError", res: res.status },
              function (res) {
                if (chrome.runtime.lastError) {
                }
              }
            );
          }
        );
      }
    });
  });
}
let files;
document.querySelector("#browsebtn").addEventListener("change", function (evt) {
  files = evt.target.files;
  let selectedfiles = document.querySelector("#selectedfiles");
  while (selectedfiles.firstChild) {
    selectedfiles.removeChild(selectedfiles.firstChild);
  }
  for (var i = 0; i < files.length; i++) {
    let newNode = document.createElement("p");
    newNode.className = "selectedfile";
    newNode.textContent = files[i].name;
    selectedfiles.appendChild(newNode);
  }
});
document.querySelector("#browsebtn").addEventListener("click", function (evt) {
  evt.target.value = "";
});
document.querySelector("#target").addEventListener("change", change);
document.querySelector("#close").addEventListener("click", winclose);
document
  .querySelector("#translatebtn")
  .addEventListener("click", translateDocs);
document.addEventListener("DOMContentLoaded", restore_options);
