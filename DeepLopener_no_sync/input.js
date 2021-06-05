chrome.runtime.sendMessage({ message: "pleaseErrMsg" }, function (res) {
  if (chrome.runtime.lastError) {
  }
});
function send() {
  const obj = new jsSHA("SHA-512", "TEXT");
  obj.update(document.querySelector("#pass").value);
  let shalist = obj.getHash("HEX").match(/.{64}/g);
  chrome.runtime.sendMessage(
    { message: "send", pass1: shalist[0], pass2: shalist[1] },
    function (res) {
      window.close();
      if (chrome.runtime.lastError) {
      }
    }
  );
}

function enter(e) {
  if (e.keyCode === 13) {
    send();
  }
  return false;
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "errmsg") {
    document.querySelector("#errmsg").innerText = request.errmsg;
    sendResponse();
  }
});
document.querySelector("#enter").addEventListener("click", send);
document.querySelector("#pass").addEventListener("keypress", enter);
