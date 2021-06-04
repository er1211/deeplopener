chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    alert(
      'Thank you for installing DeepLopener!\nBefore using this extension, please input "DeepL API_KEY" on options page.'
    );
    chrome.runtime.openOptionsPage();
  } /*else if (details.reason == "update") {
    let res = confirm("Please reload all tabs to adapt DeepLopener.");
    if (res == true) {
      chrome.tabs.query({}, function (tabs) {
        for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
      });
    } else {
      alert(
        'Before using this extension, please reload the tab or may occur "Uncaught Error: Extension context invalidated.".'
      );
    }
  }*/
});
chrome.contextMenus.create({
  title: "DeepL: %s",
  type: "normal",
  contexts: ["selection"],
  onclick: transition(),
});
function transition() {
  return function (info) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          message: "ContextMenu",
          selectionText: info.selectionText,
        },
        function (item) {
          if (chrome.runtime.lastError) {
          }
          if (!item) {
            chrome.storage.sync.get(null, function (items) {
              target = items.target;
              if (typeof target === "undefined") {
                target = "EN-US";
              }
              chrome.tabs.create({
                url:
                  "https://www.deepl.com/translator#en/" +
                  target +
                  "/" +
                  info.selectionText,
              });
            });
          }
        }
      );
    });
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "pleaseApiKey") {
    get_apikey(sender.tab.id);
  } else if (request.message == "updateBadgeText") {
    chrome.browserAction.setBadgeText({ text: request.text + "%" });
  } else if (request.message == "send") {
    dec(request.pass1, request.pass2, senderTabId);
  }
  sendResponse();
});

let api_key = "";
let senderTabId = "";
function get_apikey(tabid) {
  if (api_key != "") {
    chrome.tabs.sendMessage(
      tabid,
      { message: "got_apikey", api_key: api_key },
      function (res) {
        if (chrome.runtime.lastError) {
        }
      }
    );
  } else {
    chrome.identity.getProfileUserInfo(null, function (info) {
      if (info.id == "" || info.email == "") {
        senderTabId = tabid;
        chrome.windows.create({
          url: "../input.html",
          type: "popup",
          width: 450,
          height: 200,
          focused: true,
        });
      } else {
        dec(info.id, info.email, tabid);
      }
    });
  }
}

function dec(t1, t2, tabid) {
  chrome.storage.sync.get(null, function (items) {
    let ct = items.deeplpro_apikey;
    tmp = 0;
    tmp2 = 1;
    let len = 0;
    if (t1.length < t2.length) {
      len = t1.length;
    } else {
      len = t2.length;
    }
    for (let i = 0; i < len; i++) {
      tmp += t1.charCodeAt(i) * t2.charCodeAt(len - i - 1);
      tmp2 *= t1.charCodeAt(i) * t2.charCodeAt(len - i - 1);
    }
    let foo = [];
    for (
      let i = Math.round(String(tmp2).length / 2);
      i < String(tmp2).length;
      i++
    ) {
      foo.push(
        String(tmp2).charCodeAt(i) *
          String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
      );
    }
    let gtlen = 0;
    if (ct.length < foo.length) {
      gtlen = ct.length;
    } else {
      gtlen = foo.length;
    }
    let tmp3 = "";
    for (let i = 0; i < ct.length; i++) {
      tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
    }
    api_key = tmp3;
    chrome.tabs.sendMessage(
      tabid,
      { message: "got_apikey", api_key: api_key },
      function (res) {
        if (chrome.runtime.lastError) {
        }
      }
    );
  });
}
