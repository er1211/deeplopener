# DeepLopener_no_sync_version

# **This version can be used without enabling synchronization, but it is deprecated for security reasons.**

You can launch DeepL (https://www.deepl.com) through this Google chrome extension and replace the texts that you want to translate with translation results keepking the original style.  
On pdf, this extension displays a frame showing translated sentences.

# How to use

**(1)【layout-oriented replacement mode】**  
Click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/icon24.png) in the right-hand corner and
move the cursor and right-click to select the text you want to translate or click to cancel to select.  
![layout-oriented.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/layout-oriented.gif)  
The selected frame will be translated on layout-oriented replacement mode keeping the original style.  
If you click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/icon24.png) in the right-hand corner and
select `Translate this page!`, the whole page contents will be translated like below.  
![pagetrans.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/pagetrans.gif)

**(2)【PDF mode】**  
On PDF, select the text you want to translate and right-click on the text and click on `DeepL:selected_text`.  
![pdfmode.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/pdfmode.gif)  
For sites whose MIME type is `application/pdf` (local PDF files available!), the `transition mode` changes to `PDF mode` and the other modes are disabled.  
You can move the translation frame around freely in Drag-and-Drop, and right-clicking on the translation result frame will remove it.

- Can't use PDF mode on local PDF files?  
  Ensure that the "Allow access to file URLs" is checked on options page of this extension like below.
  ![allowAccessToFileURL.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/images/allowAccessToFileURL.png)

**(3)【text-oriented replacement mode】**  
With the text to be translated selected, press `Ctrl+X` (`⌘+X` on mac) twice within 1 second or click on the icon ![icno24.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/icon24.png) that appears after selecting the text.  
![text-oriented.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/text-oriented.gif)  
The selected text is highlighted in red first. After traslation , it turns yellow.  
Right-click on the translation to display the original text.If you do it again, the letters will be toggled back to translation.  
It is recommended to use this mode separately from the layout-oriented replacement mode because the original layout will be destroyed.

**(4)【transition mode】**  
Right click on the text you want to translate → Click on `DeepL:selected_text`.  
![openDeepL.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/openDeepL.gif)  
Move to https://www.deepl.com/translator#ja/en/selected_text

**Usage**  
The Characters translated so far in the current billing period are displayed in the upper right icon.  
 ![usage.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/images/usage.png)  
 _↑ I translated 11% (55000/500000) characters in the current billing period with DeepL API Free._

# Options

You can change the language of the translated text by changing this setting.  
To change the setting, please right click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/icon24.png) in the right-hand corner and select `Options`.  
(Default: Target : `English(American)`)  
![open_options.png](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/open_options.png)  
![options.png](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/options.png)  
**Translation icon**  
When "Enable", ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/icon24.png) will be displayed on the web page.  
(Default:`"Enable"`)

**HoverText**  
![hover2.gif](https://github.com/T3aHat/DeepLopener/blob/main/DeepLopener_no_sync/images/hover.gif)  
When "Enable", the original text is displayed under the translation (and vice versa) on text-oriented replacement mode.  
(Default:`"Enable"`)

**DeepL API_KEY**  
The API of DeepL is available in two versions: `DeepL API Free` and `DeepL API Pro`.  
Please check the version of the API you are using and configure it appropriately.

# Chrome Synchronization

If you log in to Chrome and enable synchronization, this extension uses `info.email` and `info.id` from `chrome.identity.getProfileUserInfo(null, function (info) {}` to obfuscate(?) API_KEY. However, I heard that some people don't want to enable synchronization (as pointed out by ChromeWebStore), so I added an implementation that asks for password every time when translating for the first time after launching chrome.  
![syncon.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/images/syncon.png)

- If you have synchronization enabled (`sync is on`), you can use this extension comfortably just by entering API_KEY for the first time. Most users do not need to be aware of this problem.

- If sync is off, s.t. `(info.id == "" || info.email == "")`, the `Options` screen will change like below.  
  ![options_with_password.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/images/options_with_password.png)

  - Obfuscate with the value entered in `Password`.
  - The window shown in below will open the first time you start chrome and translate (strictly speaking, when `api_key==undefined` in `background.js or options.js`). After entering `Password` and press `Enter`, the window will be closed and text will be translated.
    ![input_password.png](https://github.com/T3aHat/DeepLopener/raw/main/DeepLopener_no_sync/images/input_password.png)  
    Note that the `Password` is not remembered by the browser, so if you forget it, you need to enter the API_KEY again.
  - We used [jsSHA](https://github.com/Caligatio/jsSHA).
  - とりあえず実装したものの，開発者としては同期を有効にして使用してほしいので一部ファイルを`.gitignore`に入れた．理解のある方のみ差分を補完して自己判断で利用してほしい．
