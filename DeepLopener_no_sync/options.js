let restoredflag = false;
let inputflag = false;
function save_options() {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.identity.getProfileUserInfo(null, function (info) {
    let t1, t2;
    let overlength = true;
    if (info.id == "" || info.email == "") {
      if (document.querySelector("#decpass").value.length < 6) {
        overlength = false;
      }

      const obj = new jsSHA("SHA-512", "TEXT");
      obj.update(document.querySelector("#decpass").value);
      let shalist = obj.getHash("HEX").match(/.{64}/g);
      t1 = shalist[0];
      t2 = shalist[1];
    } else {
      t1 = info.id;
      t2 = info.email;
    }
    if (!overlength && restoredflag) {
      document.querySelector("#apitestm").style.color = "red";
      document.querySelector("#apitestm").innerText =
        "Password must be 6 or more characters.";
    } else {
      let tmp = 0;
      let tmp2 = 1;
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
      let tmplist = [];
      let gtlen = 0;
      if (
        document.querySelector("#deeplpro_apikey").value.length < foo.length
      ) {
        gtlen = document.querySelector("#deeplpro_apikey").value.length;
      } else {
        gtlen = foo.length;
      }
      for (
        let i = 0;
        i < document.querySelector("#deeplpro_apikey").value.length;
        i++
      ) {
        tmplist.push(
          document.querySelector("#deeplpro_apikey").value.charCodeAt(i) * tmp +
            foo[i % gtlen]
        );
      }
      chrome.storage.sync.get(
        {
          deeplpro_apikey: "",
        },
        function (items) {
          if (!restoredflag && (info.id == "" || info.email == "")) {
            if (items.deeplpro_apikey.length > 0) {
              document.querySelector("#deeplpro_apikey").placeholder =
                "not change";
            }
            chrome.storage.sync.set(
              {
                target: document.querySelector("#target").value,
                iconflag: document.querySelector("#iconflag").value,
                hoverflag: document.querySelector("#hoverflag").value,
                freeflag: document.querySelector("#freeflag").value,
              },
              function () {
                let save = document.querySelector("#message");
                save.textContent = "Saved!";
                setTimeout(function () {
                  save.textContent = "";
                }, 1500);
              }
            );
            document
              .querySelector("#deeplpro_apikey")
              .addEventListener("input", function () {
                document.querySelector("#deeplpro_apikey").placeholder = "";
                inputflag = true;
              });
            restoredflag = true;
          } else {
            chrome.storage.sync.set(
              {
                target: document.querySelector("#target").value,
                iconflag: document.querySelector("#iconflag").value,
                hoverflag: document.querySelector("#hoverflag").value,
                freeflag: document.querySelector("#freeflag").value,
                deeplpro_apikey: tmplist,
              },
              function () {
                let save = document.querySelector("#message");
                save.textContent = "Saved!";
                setTimeout(function () {
                  save.textContent = "";
                }, 1500);
              }
            );
          }
        }
      );
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
  });
}

function restore_options() {
  document.querySelectorAll(".descparent").forEach((descpar) => {
    descpar
      .querySelector(".descchild")
      .addEventListener("mouseover", function () {
        descpar.querySelector(".description").style.display = "inline-block";
      });
    descpar
      .querySelector(".descchild")
      .addEventListener("mouseleave", function () {
        descpar.querySelector(".description").style.display = "none";
      });
  });
  chrome.storage.sync.get(
    {
      target: "EN-US",
      iconflag: "Enable",
      hoverflag: "Enable",
      freeflag: "Free",
      deeplpro_apikey: "",
    },
    function (items) {
      chrome.identity.getProfileUserInfo(null, function (info) {
        let t1, t2;
        if (info.id == "" || info.email == "") {
          document.querySelector("#deeplpro_apikey").value = "";
        } else {
          document.querySelector(".pass").remove();
          t1 = info.id;
          t2 = info.email;
          let tmp = 0;
          let tmp2 = 1;
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
          if (items.deeplpro_apikey.length < foo.length) {
            gtlen = items.deeplpro_apikey.length;
          } else {
            gtlen = foo.length;
          }
          let tmp3 = "";
          for (let i = 0; i < items.deeplpro_apikey.length; i++) {
            tmp3 += String.fromCharCode(
              (items.deeplpro_apikey[i] - foo[i % gtlen]) / tmp
            );
          }
          document.querySelector("#deeplpro_apikey").value = tmp3;
        }

        document.querySelector("#target").value = items.target;
        document.querySelector("#iconflag").value = items.iconflag;
        document.querySelector("#hoverflag").value = items.hoverflag;
        document.querySelector("#freeflag").value = items.freeflag;
        save_options();
      });
    }
  );
}

function api_test() {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.identity.getProfileUserInfo(null, function (info) {
    let t1, t2;
    let overlength = true;
    if (info.id == "" || info.email == "") {
      if (document.querySelector("#decpass").value.length < 6) {
        overlength = false;
      }
      const obj = new jsSHA("SHA-512", "TEXT");
      obj.update(document.querySelector("#decpass").value);
      let shalist = obj.getHash("HEX").match(/.{64}/g);
      t1 = shalist[0];
      t2 = shalist[1];
    } else {
      t1 = info.id;
      t2 = info.email;
    }
    if (!overlength && restoredflag) {
      document.querySelector("#apitestm").style.color = "red";
      document.querySelector("#apitestm").innerText =
        "Password must be 6(" +
        document.querySelector("#decpass").value.length +
        ") or more characters.";
    } else {
      let tmp = 0;
      let tmp2 = 1;
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

      if (!inputflag && (info.id == "" || info.email == "")) {
        chrome.storage.sync.set(
          {
            target: document.querySelector("#target").value,
            iconflag: document.querySelector("#iconflag").value,
            hoverflag: document.querySelector("#hoverflag").value,
            freeflag: document.querySelector("#freeflag").value,
            //inputしてないならapi_key更新しない
          },
          function () {
            let save = document.querySelector("#message");
            save.textContent = "Saved!";
            setTimeout(function () {
              save.textContent = "";
            }, 1500);
            chrome.storage.sync.get(null, function (items) {
              let tmplist = [];
              let gtlen = 0;
              if (items.deeplpro_apikey.length < foo.length) {
                gtlen = items.deeplpro_apikey.length;
              } else {
                gtlen = foo.length;
              }
              let target = items.target;
              let freeflag = items.freeflag;
              let ct = items.deeplpro_apikey;
              if (typeof target === "undefined") {
                target = "EN-US";
              }
              let api_url = "";
              if (freeflag == "Free") {
                api_url = "https://api-free.deepl.com/v2/translate";
              } else {
                api_url = "https://api.deepl.com/v2/translate";
              }
              let tmp3 = "";
              for (let i = 0; i < ct.length; i++) {
                tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
              }
              let api_key = tmp3;
              let params = {
                auth_key: api_key,
                text: "認証成功",
                target_lang: target,
              };
              let data = new URLSearchParams();
              Object.keys(params).forEach((key) =>
                data.append(key, params[key])
              );
              fetch(api_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded; utf-8",
                },
                body: data,
              }).then((res) => {
                if (res.status == "200") {
                  res.json().then((resData) => {
                    document.querySelector("#apitestm").style.color = "";
                    document.querySelector("#apitestm").innerText =
                      resData.translations[0].text + "!";
                  });
                } else {
                  document.querySelector("#apitestm").style.color = "red";
                  switch (res.status) {
                    case 400:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nBad request. Please check error message and your parameters.";
                      break;
                    case 403:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nAuthorization failed. Please supply a valid auth_key parameter.";
                      break;
                    case 404:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe requested resource could not be found.";
                      break;
                    case 413:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe request size exceeds the limit.";
                      break;
                    case 414:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe request URL is too long.";
                      break;
                    case 429:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nToo many requests. Please wait and resend your request.";
                      break;
                    case 456:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nQuota exceeded. The character limit has been reached.";
                      break;
                    case 503:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nResource currently unavailable. Try again later.";
                      break;
                    case 529:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nToo many requests. Please wait and resend your request.";
                      break;
                    default:
                      document.querySelector("#apitestm").innerText =
                        "Error : " + res.status;
                  }
                }
              });
            });
          }
        );
      } else {
        let tmplist = [];
        let gtlen = 0;
        if (
          document.querySelector("#deeplpro_apikey").value.length < foo.length
        ) {
          gtlen = document.querySelector("#deeplpro_apikey").value.length;
        } else {
          gtlen = foo.length;
        }
        for (
          let i = 0;
          i < document.querySelector("#deeplpro_apikey").value.length;
          i++
        ) {
          tmplist.push(
            document.querySelector("#deeplpro_apikey").value.charCodeAt(i) *
              tmp +
              foo[i % gtlen]
          );
        }
        chrome.storage.sync.set(
          {
            target: document.querySelector("#target").value,
            iconflag: document.querySelector("#iconflag").value,
            hoverflag: document.querySelector("#hoverflag").value,
            freeflag: document.querySelector("#freeflag").value,
            deeplpro_apikey: tmplist,
          },
          function () {
            let save = document.querySelector("#message");
            save.textContent = "Saved!";
            setTimeout(function () {
              save.textContent = "";
            }, 1500);

            chrome.storage.sync.get(null, function (items) {
              let target = items.target;
              let freeflag = items.freeflag;
              let ct = items.deeplpro_apikey;
              if (typeof target === "undefined") {
                target = "EN-US";
              }
              let api_url = "";
              if (freeflag == "Free") {
                api_url = "https://api-free.deepl.com/v2/translate";
              } else {
                api_url = "https://api.deepl.com/v2/translate";
              }
              let tmp3 = "";
              for (let i = 0; i < ct.length; i++) {
                tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
              }
              let api_key = tmp3;
              let params = {
                auth_key: api_key,
                text: "認証成功",
                target_lang: target,
              };
              let data = new URLSearchParams();
              Object.keys(params).forEach((key) =>
                data.append(key, params[key])
              );
              fetch(api_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded; utf-8",
                },
                body: data,
              }).then((res) => {
                if (res.status == "200") {
                  res.json().then((resData) => {
                    document.querySelector("#apitestm").style.color = "";
                    document.querySelector("#apitestm").innerText =
                      resData.translations[0].text + "!";
                  });
                } else {
                  document.querySelector("#apitestm").style.color = "red";
                  switch (res.status) {
                    case 400:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nBad request. Please check error message and your parameters.";
                      break;
                    case 403:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nAuthorization failed. Please supply a valid auth_key parameter.";
                      break;
                    case 404:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe requested resource could not be found.";
                      break;
                    case 413:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe request size exceeds the limit.";
                      break;
                    case 414:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nThe request URL is too long.";
                      break;
                    case 429:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nToo many requests. Please wait and resend your request.";
                      break;
                    case 456:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nQuota exceeded. The character limit has been reached.";
                      break;
                    case 503:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nResource currently unavailable. Try again later.";
                      break;
                    case 529:
                      document.querySelector("#apitestm").innerText =
                        "Error : " +
                        res.status +
                        "\nToo many requests. Please wait and resend your request.";
                      break;
                    default:
                      document.querySelector("#apitestm").innerText =
                        "Error : " + res.status;
                  }
                }
              });
            });
          }
        );
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
document.querySelector("#apitest").addEventListener("click", api_test);
