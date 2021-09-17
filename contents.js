let ispdf;
if (document.contentType === "application/pdf") {
  ispdf = true;
  chrome.runtime.sendMessage({ message: "injectJQueryUI" }, function (res) {
    if (chrome.runtime.lastError) {
    }
  });
} else {
  ispdf = false;
}
let api_key;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "got_apikey") {
    if (request.error) {
      alert(
        "To use this extension, please sign in to chrome and sync turns on.\n\nIf you are interested in another version that can be used without chrome synchronization, please check DeepLopener's GitHub repository."
      );
    } else {
      api_key = request.api_key;
      apiTranslate(tmplist[0], tmplist[1], tmplist[2], tmplist[3], tmplist[4]);
      tmplist = []; //flush
    }
    sendResponse();
  } else if (request.message == "page_translate") {
    $(document).off("mousemove");
    $(document).off("contextmenu");
    if (confirm("Are you sure you want to translate this page?")) {
      apiTranslate(true, document.body, "layoutOrientedMode", -1, -1);
    }
    sendResponse();
  } else if (request.message == "cancelSelectionMode") {
    $(document).off("mousemove");
    $(document).off("contextmenu");
    RemoveDeeplopenerSelecting();
    sendResponse();
  } else if (request.message == "ispdf") {
    sendResponse(ispdf);
  } else if (request.message == "ContextMenu") {
    if (ispdf) {
      apiTranslate(false, request.selectionText, "pdfMode", -1, translationId);
    }
    sendResponse(ispdf);
  } else if (request.message == "alertError") {
    alertError(request.res);
  }
  return false;
});

let hoverflag = true;
let iconflag = true;
let seltxt = "";
chrome.storage.sync.get(null, function (items) {
  hoverflag = items.hoverflag;
  iconflag = items.iconflag;
  if (typeof hoverflag === "undefined" || hoverflag == "Enable") {
    hoverflag = true;
  } else {
    hoverflag = false;
  }
  if (typeof iconflag === "undefined" || iconflag == "Enable") {
    iconflag = true;
  } else {
    iconflag = false;
  }
  if (!ispdf && iconflag) {
    $(function () {
      $("body").on("click", function (e) {
        function ins_iconNode() {
          let newNode = document.createElement("p");
          newNode.className = "par_deeplopener_icon";
          newNode.innerHTML =
            "<div class='deeplopener_icon' style='left:" +
            (e.pageX + 3) +
            "px;top:" +
            (e.pageY + 1) +
            "px;'><img src='" +
            chrome.runtime.getURL("icon24.png") +
            "'></div>";
          newNode.addEventListener("click", selectionTrans, false);
          document.body.appendChild(newNode);
        }
        del_iconNode();
        if (
          window.getSelection().toString().length > 0 &&
          window.getSelection().toString() != "\n" &&
          seltxt != window.getSelection().toString()
        ) {
          seltxt = window.getSelection().toString();
          ins_iconNode();
        } else {
          seltxt = "";
          del_iconNode();
        }
      });
    });
  }
});

if (!ispdf) {
  let timer = Date.now();
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "x") {
      if (Date.now() - timer < 1000) {
        selectionTrans();
      }
      timer = Date.now();
    }
  });
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message == "selectionMode") {
      sendResponse();
      let elm;
      $(document).on("mousemove", (e) => {
        let x = e.clientX;
        let y = e.clientY;
        RemoveDeeplopenerSelecting();
        try {
          elm = document.elementFromPoint(x, y);
          elm.classList.add("deeplopener_selecting");
        } catch {}
      });

      $(document).on("click", (e) => {
        let x = e.clientX;
        let y = e.clientY;
        elm = document.elementFromPoint(x, y);
        RemoveDeeplopenerSelecting();
        $(document).off("mousemove");
        $(document).off("contextmenu");
      });

      $(document).on("contextmenu", (e) => {
        let x = e.clientX;
        let y = e.clientY;
        elm = document.elementFromPoint(x, y);
        RemoveDeeplopenerSelecting();
        let rng = document.createRange();
        rng.selectNode(elm);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(rng);
        len = elm.innerText.length;
        if (len > 4000) {
          let conf = confirm(
            "Are you sure you want to translate this?\n\nIt costs about " +
              len +
              " characters"
          );
          if (conf == true) {
            apiTranslate(true, elm, "layoutOrientedMode", -1, -1);
          }
        } else {
          apiTranslate(true, elm, "layoutOrientedMode", -1, -1);
        }
        //$(document).off("mousemove");
        //$(document).off("contextmenu");
        return false;
      });
    }
  });
}

let selectionId = 0;
let translationId = 0;
function selectionTrans() {
  del_iconNode();
  let selectTextList;
  if (window.getSelection) {
    selectTextList = window.getSelection().toString().split(/\n/g);
    for (var i = 0; i < selectTextList.length; i++) {
      selectTextList[i].replace(/[;；:：]/g, "\n");
      if (
        selectTextList[i].replace(/[ 　]/g, "").replace(/%C2%A0/g, "").length ==
        0
      ) {
        selectTextList.splice(i, 1);
        i -= 1;
      }
    }
  } else {
    selectTextList = [];
  }
  let trelm = document.createElement("span");
  trelm.className = "deeplopener_text_oriented";
  trelm.setAttribute("id", "deeplopener_text_oriented" + selectionId);
  trelm.innerHTML =
    "<span class='deeplopener_translating'>" +
    window.getSelection().toString().replace(/\n/g, "<br>") +
    "</span>";
  window.getSelection().getRangeAt(0).deleteContents();
  window.getSelection().getRangeAt(0).insertNode(trelm);
  window.getSelection().removeAllRanges();
  apiTranslate(
    false,
    selectTextList,
    "textOrientedMode",
    selectionId,
    translationId
  );
  selectionId++;
}

function del_iconNode() {
  try {
    document
      .querySelectorAll(".par_deeplopener_icon")
      .forEach((iconel) => iconel.remove());
  } catch {}
}

function RemoveDeeplopenerSelecting() {
  try {
    document
      .querySelector(".deeplopener_selecting")
      .classList.remove("deeplopener_selecting");
  } catch {}
}
let booltrans = [];
function textOrientedMode(txtlist, resData, selectionid) {
  for (let i = 0; i < resData.translations.length; i++) {
    let translation = resData.translations[i].text;
    let txt = txtlist[i];
    let trid = translationId;
    console.log(
      " Original:\n" +
        txt +
        "\n\nTranslation results for DeepL (deepl.com) API:\n" +
        translation
    );
    booltrans[translationId] = true;
    $(function () {
      $(".deeplopener_translated" + "#" + trid)
        .off()
        .on("contextmenu", function () {
          window.getSelection().removeAllRanges();
          clickid = $(this).attr("id");
          if (booltrans[clickid] == true) {
            $(this).text(txt);
            $(".deeplopener_hovertxt").text(translation);
            booltrans[clickid] = false;
          } else {
            $(this).text(translation);
            $(".deeplopener_hovertxt").text(txt);
            booltrans[clickid] = true;
          }
          if (hoverflag) {
            let left = $(this).offset().left - $(window).scrollLeft();
            let top =
              $(this).offset().top -
              $(window).scrollTop() +
              $(this).outerHeight();
            let width = $(this).outerWidth();
            offsetCenterLeft = left + width / 2;
            $(".deeplopener_resultarea").css({
              top: top,
              left:
                offsetCenterLeft -
                $(".deeplopener_resultarea").outerWidth() / 2,
            });
          }
          del_iconNode();
          return false;
        });
      if (hoverflag) {
        $(".deeplopener_translated" + "#" + trid).hover(
          function () {
            thisel = this;
            $(window).scroll(function () {
              if (thisel !== undefined) {
                $(thisel).css("outline", "");
                resultAreaUpdate(thisel);
              }
            });
            function resultAreaUpdate(thisel) {
              $(thisel).css("outline", "2px solid black");
              let resultarea = document.createElement("div");
              resultarea.className = "deeplopener_resultarea";
              resultarea.innerHTML = "<div class=deeplopener_hovertxt></div>";
              $(".deeplopener_resultarea").remove();
              document.body.append(resultarea);
              let left = $(thisel).offset().left - $(window).scrollLeft();
              let top =
                $(thisel).offset().top -
                $(window).scrollTop() +
                $(thisel).outerHeight();
              var width = $(thisel).outerWidth();
              offsetCenterLeft = left + width / 2;
              $(".deeplopener_resultarea").css({
                display: "block",
                width: width * 0.75,
              });
              clickid = $(thisel).attr("id");
              if (booltrans[clickid] == true) {
                $(".deeplopener_hovertxt").append(
                  $("<span>" + txt + "</span>")
                );
              } else {
                $(".deeplopener_hovertxt").append(
                  $("<span>" + translation + "</span>")
                );
              }
              $(".deeplopener_resultarea").css({
                top: top,
                left:
                  offsetCenterLeft -
                  $(".deeplopener_resultarea").outerWidth() / 2,
              });
            }
            resultAreaUpdate(this);
          },
          function () {
            $(this).css("outline", "");
            thisel = undefined;
            $(".deeplopener_resultarea").remove();
          }
        );
      }
    });
    let text_oriented = document.querySelector(
      "#deeplopener_text_oriented" + selectionid
    );
    if (
      $("#deeplopener_text_oriented" + selectionid)
        .children()
        .hasClass("deeplopener_translating")
    ) {
      text_oriented.innerHTML = "";
    }
    let newNode = document.createElement("span");
    newNode.className = "deeplopener_translated";
    newNode.setAttribute("id", translationId);
    newNode.innerHTML = translation + "<br>";
    text_oriented.appendChild(newNode);
    window.getSelection().removeAllRanges();
    translationId++;
  }
}

function pdfMode(translation, translationid) {
  $(
    "<span class='deeplopener_pdftranslated' id='pdftransid" +
      translationid +
      "''>" +
      translation
        .replace(/\. ([A-Z])/g, "．<br>$1")
        .replace(/[。]/g, "．<br>") +
      "</span>"
  ).appendTo("html");
  $("#pdftransid" + translationid).draggable({ scroll: false });
  $(".deeplopener_pdftranslated").css(
    "max-height",
    $(window).height() * 0.9 + "px"
  );
  $(".deeplopener_pdftranslated").resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
  });
  $("html").on("contextmenu", function (e) {
    e.target.remove();
    return false;
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

function alertError(res) {
  switch (res) {
    case 400:
      alert(
        "DeepLopener Error : " +
          res.status +
          "\nBad request. Please check error message and your parameters."
      );
      break;
    case 403:
      alert(
        "DeepLopener Error : " +
          res +
          "\nAuthorization failed. Please supply a valid auth_key parameter."
      );
      chrome.runtime.sendMessage(
        { message: "openOptionsPage" },
        function (res) {
          if (chrome.runtime.lastError) {
          }
        }
      );
      break;
    case 404:
      alert(
        "DeepLopener Error : " +
          res +
          "\nThe requested resource could not be found."
      );
      break;
    case 413:
      alert(
        "DeepLopener Error : " + res + "\nThe request size exceeds the limit."
      );
      break;
    case 414:
      alert("DeepLopener Error : " + res + "\nThe request URL is too long.");
      break;
    case 429:
      alert(
        "DeepLopener Error : " +
          res +
          "\nToo many requests. Please wait and resend your request."
      );
      break;
    case 456:
      alert(
        "DeepLopener Error : " +
          res +
          "\nQuota exceeded. The character limit has been reached."
      );
      break;
    case 503:
      alert(
        "DeepLopener Error : " +
          res +
          "\nResource currently unavailable. Try again later."
      );
      break;
    case 529:
      alert(
        "DeepLopener Error : " +
          res +
          "\nToo many requests. Please wait and resend your request."
      );
      break;
    default:
      alert("DeepLopener Error : " + res);
  }
}

let tmplist = [];
function apiTranslate(iselm, elm, mode, selectionid, translationid) {
  if (api_key === undefined) {
    tmplist = [iselm, elm, mode, selectionid, translationid];
    chrome.runtime.sendMessage(
      { message: "pleaseApiKey", runtimeflag: false },
      function (res) {
        if (chrome.runtime.lastError) {
        }
      }
    );
  } else {
    let targetHtml;
    if (iselm) {
      targetHtml = elm.innerHTML;
    } else {
      targetHtml = elm;
    }
    chrome.storage.sync.get(null, function (items) {
      let target = items.target;
      let freeflag = items.freeflag;
      if (typeof target === "undefined") {
        target = "EN-US";
      }
      let api_url;
      if (freeflag == "Free") {
        api_url = "https://api-free.deepl.com/v2/translate";
      } else {
        api_url = "https://api.deepl.com/v2/translate";
      }
      let params = {
        auth_key: api_key,
        target_lang: target,
        tag_handling: "xml",
      };
      if (mode != "textOrientedMode") {
        params.text = targetHtml;
        translationId++;
      }
      let data = new URLSearchParams();
      Object.keys(params).forEach((key) => data.append(key, params[key]));
      if (mode == "textOrientedMode") {
        elm.forEach((text) => {
          data.append("text", text);
        });
      }
      fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; utf-8",
        },
        body: data,
      }).then((res) => {
        if (res.status == "200") {
          res.json().then((resData) => {
            let translation = resData.translations[0].text;
            if (mode == "layoutOrientedMode") {
              elm.innerHTML = translation;
            } else if (mode == "textOrientedMode") {
              textOrientedMode(elm, resData, selectionid);
            } else if (mode == "pdfMode") {
              pdfMode(translation, translationid);
            }
          });
          updateBadgeText(freeflag);
        } else {
          elm.innerHTML =
            "This is a sample of the translation result from DeepLopener.";
          alertError(res.status);
        }
        window.getSelection().removeAllRanges();
      });
    });
  }
}
