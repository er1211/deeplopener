# DeepLopener

[日本語解説記事](https://t3ahat.hateblo.jp/entry/How_to_use_DeepLopener)に日本語で詳しくインストール方法や使用方法を書いているので[こちら](https://t3ahat.hateblo.jp/entry/How_to_use_DeepLopener)を読んでください．  
[How to use (YouTube) ](https://youtu.be/YlKi-NVJV-E)

This Google chrome extension can replace texts that you want to translate with translation results by DeepL(deepl.com) keepking the original style.  
On pdf, this extension displays frames showing translated sentences.

# Install from Chrome Web Store

<a href="https://chrome.google.com/webstore/detail/deeplopener/almdndhiblbhbnoaakhgefcpmbaoljde" target="_blank" rel="noopener noreferrer"><img src="https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/HRs9MPufa1J1h5glNhut.png" alt="ChromeWebStore" ></a>

# Web site

https://teahat.ml/DeepLopener/

# How to use

**(1)【layout-oriented replacement mode】**  
Click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) in the right-hand corner and
move the cursor and right-click to select the text you want to translate or click to cancel to select.  
![layout-oriented.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/layout-oriented.gif)  
The selected frame will be translated on layout-oriented replacement mode keeping the original style.  
If you click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) in the right-hand corner and
select `Translate this page!`, the whole page contents will be translated like below.  
![pagetrans.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/pagetrans.gif)

**(2)【PDF mode】**  
On PDF, select the text you want to translate and right-click on the text and click on `DeepL:selected_text`.  
![pdfmode.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/pdfmode.gif)  
For sites whose MIME type is `application/pdf` (local PDF files available!), the `transition mode` changes to `PDF mode` and the other modes are disabled.  
You can move the translation frame around freely in Drag-and-Drop, and right-clicking on the translation result frame will remove it.

**(3)【text-oriented replacement mode】**  
With the text to be translated selected, press `Ctrl+X` (`⌘+X` on mac) twice within 1 second or click on the icon ![icno24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) that appears after selecting the text.  
![text-oriented.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/text-oriented.gif)  
The selected text is highlighted in red first. After traslation , it turns yellow.  
Right-click on the translation to display the original text.If you do it again, the letters will be toggled back to translation.  
It is recommended to use this mode separately from the layout-oriented replacement mode because the original layout will be destroyed.

**(4)【transition mode】**  
Right click on the text you want to translate → Click on `DeepL:selected_text`.  
![openDeepL.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/openDeepL.gif)  
Move to https://www.deepl.com/translator#ja/en/selected_text

**Usage**  
The number of characters translated so far in the current billing period is displayed in the upper right icon.  
 ![usage.png](https://github.com/T3aHat/DeepLopener/raw/main/images/usage.png)  
 _I translated 11% (55000/500000) characters in the current billing period with DeepL API Free._

# Options

You can change the language of the translated text by changing this setting.  
To change the setting, please right click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) in the right-hand corner and select `Options`.  
![open_options.png](https://github.com/T3aHat/DeepLopener/blob/main/images/open_options.png)  
![options.png](https://github.com/T3aHat/DeepLopener/blob/main/images/options.png)

**Target language**
The text will be translated into this language.  
(Default: Target : `English(American)`)

**Translation icon**  
When "Enable", ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) will be displayed on the web page.  
(Default:`"Enable"`)

**HoverText**  
![hover2.gif](https://github.com/T3aHat/DeepLopener/blob/main/images/hover.gif)  
When "Enable", the original text is displayed under the translation (and vice versa) on text-oriented replacement mode.  
(Default:`"Enable"`)

**DeepL API_KEY**  
The API of DeepL is available in two versions: `DeepL API Free` and `DeepL API Pro`.  
Please check the version of the API you are using and configure it appropriately.

# Chrome Sync

- To use this extension, please sign in to Chrome and sync turns on. If you do not sign in or sync turns off, you will get an error like  
  `Error in response to storage.get: Error: Invocation of form identity.getProfileUserInfo(null, function) doesn't match definition identity.getProfileUserInfo(function callback)`.  
  ![syncon.png](https://github.com/T3aHat/DeepLopener/raw/main/images/syncon.png)
- Don't want to log in to Chrome and sync? If so, there is an another [version](https://github.com/T3aHat/DeepLopener/tree/main/DeepLopener_no_sync) that asks for a password every time you translate for the first time after launching chrome instead of synchronization (but deprecated).

# Q&A

- I can't use page translation.  
  →There are two main possibilities. The first is that the size of the page you want to translate is larger than 30kbytes. The second is CORS. In either case, please use the layout-oriented replacement mode instead. Please read the error codes in the Developer Tools for more information.

- I can't use PDF mode on local PDF files.  
  →Ensure that the "Allow access to file URLs" is checked on options page of this extension like below.  
   Improper settings may cause the translation to be performed in transition mode instead of PDF mode.  
  ![allowAccessToFileURL.png](https://github.com/T3aHat/DeepLopener/raw/main/images/allowAccessToFileURL.png)

# 免責事項(Disclaimer)

- 本拡張機能は非公式です．問題がある場合は即公開停止するので，連絡してください．また，いかなる場合も，本拡張機能の利用に起因した損害に対して一切の責任と義務を負いません．
- 特に，ページ翻訳は大量の characters を送信する可能性があるので十分に注意して実行してください．  
  意図しない挙動を起こしても一切責任を負いません．  
  DeepL API を契約する際に**API 使用額上限を低めに設定**することを強く推奨します．
- 脆弱性により API の秘密鍵等が流出する可能性があります． **使用する場合はリスクを考慮したうえで自己責任で使用してください．ソースコードの挙動を理解できない場合は使用しないでください．** 開発者は一切責任を負いません．
- 定期的に身に覚えのない API 使用履歴がないか[ご利用状況](https://www.deepl.com/pro-account.html?page=category_usage)を確認してください．
- 開発者はド素人なので，特に API 鍵の保存方法に関するアドバイスを頂けると幸いです．
