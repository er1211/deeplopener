console.log("DeepLopener loaded");
chrome.runtime.sendMessage({ message: "pleaseApiKey" }, function (res) {
  if (chrome.runtime.lastError) {
  }
});
let ispdf;
if (document.contentType === "application/pdf") {
  ispdf = true;
} else {
  ispdf = false;
}
let api_key;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "got_apikey") {
    api_key = request.api_key;
    sendResponse();
  } else if (request.message == "page_translate") {
    $(document).off("mousemove");
    $(document).off("contextmenu");
    apiTranslate(true, document.body, "layoutOrientedMode", -1, -1);
    sendResponse();
  } else if (request.message == "ispdf") {
    sendResponse(ispdf);
  } else if (request.message == "ContextMenu") {
    if (ispdf) {
      apiTranslate(false, request.selectionText, "pdfMode", -1, translationId);
    }
    sendResponse(ispdf);
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
          elm.classList.add("deeplopenerselecting"); //elm.style.border = "solid 1px black";
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
        $(document).off("mousemove");
        $(document).off("contextmenu");
        return false;
      });
    } else if (request.message == "cancelSelectionMode") {
      sendResponse();
      $(document).off("mousemove");
      $(document).off("contextmenu");
      RemoveDeeplopenerSelecting();
    }
  });
}

let selectionId = 0; //text-oriented mode(selectionTrans())のたびに++
let translationId = 0; //APIに投げるたびに++
function selectionTrans() {
  //iconクリックとコマンドから入る
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
  trelm.className = "text_oriented";
  trelm.setAttribute("id", "text_oriented" + selectionId);
  trelm.innerHTML =
    "<span class='translating'>" +
    window.getSelection().toString().replace(/\n/g, "<br>") +
    "</span>"; //翻訳中(.translating)にして中にテキストを入れる
  window.getSelection().getRangeAt(0).deleteContents(); //選択したテキストを削除
  window.getSelection().getRangeAt(0).insertNode(trelm);
  window.getSelection().removeAllRanges(); //選択開放
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
  //layoutOrientedで選んでる要素に入れたclassを消す
  try {
    document
      .querySelector(".deeplopenerselecting")
      .classList.remove("deeplopenerselecting");
  } catch {}
}
let booltrans = [];
function textOrientedMode(txtlist, resData, selectionid) {
  for (let i = 0; i < resData.translations.length; i++) {
    let translation = resData.translations[i].text;
    let txt = txtlist[i];
    let trid = translationId;
    console.log(
      translationId +
        " Original:\n" +
        txt +
        "\n\nTranslation results for DeepL (deepl.com) API:\n" +
        translation
    );
    booltrans[translationId] = true;
    $(function () {
      $(".translated" + "#" + trid)
        .off()
        .on("contextmenu", function () {
          window.getSelection().removeAllRanges();
          clickid = $(this).attr("id");
          if (booltrans[clickid] == true) {
            $(this).text(txt);
            $(".hovertxt").text(translation);
            booltrans[clickid] = false;
          } else {
            $(this).text(translation);
            $(".hovertxt").text(txt);
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
            $(".resultarea").css({
              top: top,
              left: offsetCenterLeft - $(".resultarea").outerWidth() / 2,
            });
          }
          del_iconNode();
          return false;
        });
      if (hoverflag) {
        $(".translated" + "#" + trid).hover(
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
              resultarea.className = "resultarea";
              resultarea.innerHTML = "<div class=hovertxt></div>";
              $(".resultarea").remove();
              document.body.append(resultarea);
              let left = $(thisel).offset().left - $(window).scrollLeft();
              let top =
                $(thisel).offset().top -
                $(window).scrollTop() +
                $(thisel).outerHeight();
              var width = $(thisel).outerWidth();
              offsetCenterLeft = left + width / 2;
              $(".resultarea").css({
                display: "block",
                width: width * 0.75,
              });
              clickid = $(thisel).attr("id");
              if (booltrans[clickid] == true) {
                $(".hovertxt").append($("<span>" + txt + "</span>"));
              } else {
                $(".hovertxt").append($("<span>" + translation + "</span>"));
              }
              $(".resultarea").css({
                top: top,
                left: offsetCenterLeft - $(".resultarea").outerWidth() / 2,
              });
            }
            resultAreaUpdate(this);
          },
          function () {
            $(this).css("outline", "");
            thisel = undefined;
            $(".resultarea").remove();
          }
        );
      }
    });
    let text_oriented = document.querySelector("#text_oriented" + selectionid);
    if (
      $("#text_oriented" + selectionid)
        .children()
        .hasClass("translating")
    ) {
      text_oriented.innerHTML = "";
    }
    let newNode = document.createElement("span");
    newNode.className = "translated";
    newNode.setAttribute("id", translationId);
    newNode.innerHTML = translation + "<br>";
    text_oriented.appendChild(newNode);
    window.getSelection().removeAllRanges();
    translationId++; //ここで増やす
  }
}

function pdfMode(translation, translationid) {
  $(
    "<span class='pdftranslated' id='pdftransid" +
      translationid +
      "''>" +
      translation
        .replace(/\. ([A-Z])/g, "．<br>$1")
        .replace(/[。]/g, "．<br>") +
      "</span>"
  ).appendTo("html");
  $("#pdftransid" + translationid).draggable({ scroll: false });
  $(".pdftranslated").css("max-height", $(window).height() * 0.9 + "px");
  $(".pdftranslated").resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
  });
  $("html").on("contextmenu", function (e) {
    e.target.remove();
    return false;
  });
}

function apiTranslate(iselm, elm, mode, selectionid, translationid) {
  //selectionid, translationid: page translationなど必要ない場合は -1 にする
  //mode: layoutOrientedMode, textOrientedMode, pdfMode(=isodf)
  let targetHtml;
  if (iselm) {
    targetHtml = elm.innerHTML;
  } else {
    targetHtml = elm; //ただのテキストも来うる(PDF mode，text-oriented mode)
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
      } else {
        elm.innerHTML =
          "This is a sample of the translation result from DeepLopener .";
        switch (res.status) {
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
                res.status +
                "\nAuthorization failed. Please supply a valid auth_key parameter."
            );
            break;
          case 404:
            alert(
              "DeepLopener Error : " +
                res.status +
                "\nThe requested resource could not be found."
            );
            break;
          case 413:
            alert(
              "DeepLopener Error : " +
                res.status +
                "\nThe request size exceeds the limit."
            );
            break;
          case 429:
            alert(
              "DeepLopener Error : " +
                res.status +
                "\nToo many requests. Please wait and resend your request."
            );
            break;
          case 456:
            alert(
              "DeepLopener Error : " +
                res.status +
                "\nQuota exceeded. The character limit has been reached."
            );
            break;
          case 503:
            alert(
              "DeepLopener Error : " +
                res.status +
                "\nResource currently unavailable. Try again later."
            );
            break;
          default:
            alert("DeepLopener Error : " + res.status);
        }
      }
      window.getSelection().removeAllRanges();
    });
  });
}
