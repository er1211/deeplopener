# How to use

<iframe width="100%" height="400" src="https://www.youtube.com/embed/iptT7NxNoz4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  
1. **Get your [DeepL API_KEY](https://www.deepl.com/en/pro/change-plan#developer)**  
   ![free.png](https://cdn-ak.f.st-hatena.com/images/fotolife/t/t3ahat/20210808/20210808042505.png)
   If you use DeepL API Free, you can translate text for max. 500,000 characters/month.

2.  **Download [DeepLopener](https://chrome.google.com/webstore/detail/deepl-opener-pro/almdndhiblbhbnoaakhgefcpmbaoljde)**
    <iframe class="embed-card embed-webcard" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;" title="DeepLopener" src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fdeeplopener%2Falmdndhiblbhbnoaakhgefcpmbaoljde" frameborder="0" scrolling="no"></iframe>

3.  **Login to Chrome and enable synchronization**  
    ![syncon.png](https://github.com/T3aHat/DeepLopener/raw/main/images/syncon.png)  
    You need to login to Chrome and enable synchronization for security reasons.
    If you don’t want to log in to Chrome and sync, see [here](http://teahat.ml/DeepLopener/#chrome-sync).

4.  **Input your API_KEY and change a setting of API version on options page**  
    ![options.png](https://github.com/T3aHat/DeepLopener/raw/main/images/options.png)
    - If you want to use Free version, change it as `Free`.
    - If you want to use Pro version, change it as `Pro`.

## layout-oriented replacement mode

Click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) in the upper right corner
or right-click without selecting the text,
move the cursor and right-click to translate, and left-click to cancel to select.  
![layoutContextMenu.png](https://github.com/T3aHat/DeepLopener/raw/main/images/layoutContextMenu.png)  
![layout-oriented.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/layout-oriented.gif)  
The selected frame will be translated on layout-oriented replacement mode keeping the original style.  
If you click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) in the right-hand corner and
select `Translate this page!`, the whole page contents will be translated like below.  
![pagetrans.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/pagetrans.gif)

## PDF mode

On PDF, select the text you want to translate and right-click on the text and click on `DeepL:selected_text`.  
![pdfmode.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/pdfmode.gif)  
For sites whose MIME type is `application/pdf` (local PDF files available!), the `transition mode` changes to `PDF mode` and the other modes are disabled.  
You can move the translation frame around freely in Drag-and-Drop, and right-clicking on the translation result frame will remove it.

- Can't use PDF mode on local PDF files?  
  Ensure that the "Allow access to file URLs" is checked on options page of this extension like below.
  ![allowAccessToFileURL.png](https://github.com/T3aHat/DeepLopener/raw/main/images/allowAccessToFileURL.png)

## text-oriented replacement mode

With the text to be translated selected, press `Ctrl+X` (`⌘+X` on mac) twice within 1 second or click on the icon ![icno24.png](https://github.com/T3aHat/DeepLopener/raw/main/icon24.png) that appears after selecting the text.  
![text-oriented.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/text-oriented.gif)  
The selected text is highlighted in red first. After traslation , it turns yellow.  
Right-click on the translation to display the original text.If you do it again, the letters will be toggled back to translation.  
It is recommended to use this mode separately from the layout-oriented replacement mode because the original layout will be destroyed.

## transition mode

Right click on the text you want to translate → Click on `DeepL:selected_text`.  
![openDeepL.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/openDeepL.gif)  
Move to https://www.deepl.com/translator#ja/en/selected_text

# Document translation

![doctrans.gif](https://github.com/T3aHat/DeepLopener/raw/main/images/doctrans.gif)  

Document files can be translated from v1.2.0!  
Click
<img src="https://github.com/T3aHat/DeepLopener/raw/main/earth.png"  height="20px"/>
in the upper right corner of the popup window will take you to the document translation page.  
![earthIcon.png](https://github.com/T3aHat/DeepLopener/raw/main/images/earthIcon.png)

## How to translate

![translating.png](https://github.com/T3aHat/DeepLopener/raw/main/images/translating.png)

1. Select a target language
2. Choose documents you want to translate
   The following file types and extensions are supported:
- "docx" - Microsoft Word Document
- "pptx" - Microsoft PowerPoint Document
- "pdf" - Portable Document Format  
  Please note that in order to translate PDF documents you need to give one-time consent to using the Adobe API via [the account interface](https://www.deepl.com/pro-account/translationSettings).
  ![PDFTranslationSettings.png](https://github.com/T3aHat/DeepLopener/blob/main/images/PDFTranslationSettings.png)  
- "htm / html" - HTML Document
- "txt" - Plain Text Document  
  Please check out [the official reference document](https://www.deepl.com/docs-api/translating-documents/uploading/) for details.
3. click `Translate` button and translate!
   Translation status will be shown in `Translation status`.
   - `Date`: Date and time of translation
   - `Name`: File name
   - `Language`: The selected target language
   - `Progress`: Translation progress (is automatically updated at 5-second intervals)
     - `translating`: Now translating.
     - `done`: Translated the file. Click to download the translated document.
     - `error`: Translation failed. The error will be alerted and removed from `Translation status`.

# Usage in the current billing period

The Characters translated so far in the current billing period are displayed in the upper right icon.  
 ![usage.png](https://github.com/T3aHat/DeepLopener/raw/main/images/usage.png)  
↑ I translated 11% (55000/500000) characters in the current billing period with DeepL API Free.
