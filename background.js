chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.sync.set(
      {
        target: "EN-US",
        iconflag: "Enable",
        hoverflag: "Enable",
        freeflag: "Free",
        deeplpro_apikey: [],
      },
      function () {}
    );
    alert(
      'Thank you for installing DeepLopener!\nBefore using this extension, please input "DeepL API_KEY" on options page.'
    );
    chrome.runtime.openOptionsPage();
  } else if (details.reason == "update") {
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
  }
});

chrome.contextMenus.create({
  title: "DeepL : %s",
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
chrome.contextMenus.create({
  title: "DeepLopener",
  type: "normal",
  onclick: fireSelectionMode(),
});
function fireSelectionMode() {
  return function (info) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "selectionMode" },
        function (res) {
          if (chrome.runtime.lastError) {
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
  } else if (request.message == "injectJQueryUI") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.insertCSS(sender.tab.id, { file: "jquery-ui.css" });
      chrome.tabs.executeScript(sender.tab.id, { file: "jquery-ui.js" });
      sendResponse();
    });
  }
});

function get_apikey(tabid) {
  chrome.storage.sync.get(null, function (items) {
    let ct = items.deeplpro_apikey;
    chrome.identity.getProfileUserInfo(null, function (info) {
      if (info.id == "" || info.email == "") {
        alert(
          "To use this extension, please sign in to chrome and sync turns on.\n\nIf you are interested in another version that can be used without chrome synchronization, please check DeepLopener's GitHub repository."
        );
      } else {
        tmp = 0;
        tmp2 = 1;
        let len = 0;
        if (info.id.length < info.email.length) {
          len = info.id.length;
        } else {
          len = info.email.length;
        }
        for (let i = 0; i < len; i++) {
          tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
          tmp2 *= info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
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
        chrome.tabs.sendMessage(
          tabid,
          { message: "got_apikey", api_key: tmp3 },
          function (res) {
            if (chrome.runtime.lastError) {
            }
          }
        );
      }
    });
  });
}
