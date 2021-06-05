# DeepLopener

<iframe width="100%" height="400" src="https://www.youtube.com/embed/YlKi-NVJV-E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  
You can launch DeepL (https://www.deepl.com) through this Google chrome extension and replace the texts that you want to translate with translation results keepking the original style.  
On pdf, this extension displays a frame showing translated sentences.

# Install from Chrome Web Store

<iframe class="embed-card embed-webcard" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;" title="DeepLopener" src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fdeeplopener%2Falmdndhiblbhbnoaakhgefcpmbaoljde" frameborder="0" scrolling="no"></iframe>

# How to use

Check [here](https://teahat.ml/DeepLopener/how_to_use).

# Options

Check [here](https://teahat.ml/DeepLopener/options).

# Chrome Sync

- To use this extension, please sign in to Chrome and sync turns on. If you do not sign in or sync turns off, you will get an error like  
  `Error in response to storage.get: Error: Invocation of form identity.getProfileUserInfo(null, function) doesn't match definition identity.getProfileUserInfo(function callback)`.  
  ![syncon.png](https://github.com/T3aHat/DeepLopener/raw/main/images/syncon.png)

## Why do I need to log in and enable synchronization?

To securely store your API_KEY. When you enable synchronization, `chrome.identity.getProfileUserInfo()` will get the information of the Google account you are signed in to. This information is used to obfuscate the API_KEY and store it by using `chrome.storage.sync.set()`, but this extension **does not** intentionally send this information to the any server. See the [implementation](https://github.com/T3aHat/DeepLopener/blob/main/options.js) for details. If you don't understand the behavior of this code, please don't use this extension, as stated in the [disclaimer](https://github.com/T3aHat/DeepLopener#%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85disclaimer). If you don't want to log in to Chrome or sync, there is an another [version](https://github.com/T3aHat/DeepLopener/tree/main/DeepLopener_no_sync) that asks for a password every time you translate for the first time after launching chrome instead of synchronization (but deprecated).  
However, We are not satisfied with this implementation. This problem is the one that I think needs the most improvement. If you have any good ideas, please contact me via [issue](https://github.com/T3aHat/DeepLopener/issues). It is possible that this problem will be fixed in the future.

- 開発者はド素人なので，特に API 鍵の保存方法に関するアドバイスを[issue](https://github.com/T3aHat/DeepLopener/issues)から頂けると幸いです．

# Japanese article

[日本語解説記事](https://t3ahat.hateblo.jp/entry/How_to_use_DeepLopener)に日本語で詳しくインストール方法や使用方法を書いているので[こちら](https://t3ahat.hateblo.jp/entry/How_to_use_DeepLopener)をご覧ください．

# 免責事項(Disclaimer)

Check [here](https://github.com/T3aHat/DeepLopener#%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85disclaimer) **before using this extension**.
