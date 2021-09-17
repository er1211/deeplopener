chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.local.set(
      {
        translatingData: [],
      },
      function () {}
    );
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
    // alert(
    //   'Thank you for installing DeepLopener!\nBefore using this extension, please input "DeepL API_KEY" on options page.'
    // );
    chrome.runtime.openOptionsPage();
  }
});

chrome.contextMenus.create(
  {
    title: "DeepL : %s",
    id: "transition",
    type: "normal",
    contexts: ["selection"],
  },
  () => chrome.runtime.lastError
);
chrome.contextMenus.create(
  {
    title: "DeepLopener",
    id: "fireSelectionMode",
    type: "normal",
  },
  () => chrome.runtime.lastError
);
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "transition") {
    transition(info);
  } else if (info.menuItemId == "fireSelectionMode") {
    fireSelectionMode();
  }
});
function transition(info) {
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
          // not pdf page
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
}
function fireSelectionMode() {
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
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "pleaseApiKey") {
    if (request.runtimeflag) {
      get_apikey(-1);
    } else {
      get_apikey(sender.tab.id);
    }
  } else if (request.message == "updateBadgeText") {
    chrome.action.setBadgeText({ text: request.text + "%" });
  } else if (request.message == "injectJQueryUI") {
    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      files: ["jquery-ui.css"],
    });
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["jquery-ui.js"],
    });
  } else if (request.message == "openOptionsPage") {
    chrome.runtime.openOptionsPage();
  }
  sendResponse();
});

function get_apikey(tabid) {
  chrome.storage.sync.get(null, function (items) {
    let ct = items.deeplpro_apikey;
    chrome.identity.getProfileUserInfo(null, function (info) {
      if (info.id == "" || info.email == "") {
        if (tabid != -1) {
          chrome.tabs.sendMessage(
            tabid,
            { message: "got_apikey", error: true },
            function (res) {
              if (chrome.runtime.lastError) {
              }
            }
          );
        } else {
          chrome.runtime.sendMessage(
            { message: "got_apikey", error: true },
            function (res) {
              if (chrome.runtime.lastError) {
              }
            }
          );
        }
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
        if (tabid != -1) {
          chrome.tabs.sendMessage(
            tabid,
            { message: "got_apikey", api_key: tmp3 },
            function (res) {
              if (chrome.runtime.lastError) {
              }
            }
          );
        } else {
          chrome.runtime.sendMessage(
            { message: "got_apikey", api_key: tmp3 },
            function (res) {
              if (chrome.runtime.lastError) {
              }
            }
          );
        }
      }
    });
  });
}
