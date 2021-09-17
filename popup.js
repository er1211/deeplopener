let ispdf;
function winclose() {
  window.close();
}
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { message: "ispdf" }, function (res) {
    if (chrome.runtime.lastError) {
    }
    if (res == true) {
      ispdf = true;
    } else {
      ispdf = false;
    }
    if (ispdf) {
      document.querySelector("#pagetrans").remove();
    } else {
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
  });
});

document.querySelector("#pagetrans").onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "page_translate" },
      function (res) {
        if (chrome.runtime.lastError) {
        }
        window.close();
      }
    );
  });
};
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
    function () {
      const save = document.querySelector("#message");
      save.textContent = "Saved!";
      setTimeout(function () {
        window.close();
      }, 500);
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
    }
  );
}

document.querySelector("#target").addEventListener("change", change);
document.querySelector("#close").addEventListener("click", winclose);
document.addEventListener("DOMContentLoaded", restore_options);
