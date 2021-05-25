import os
import zipfile
with zipfile.ZipFile('DeepLopener.zip', 'w')as zf:
    zf.write('manifest.json')
    zf.write('background.js')
    zf.write('contents.js')
    zf.write('popup.js')
    zf.write('popup.html')
    zf.write('popup.css')
    zf.write('options.js')
    zf.write('options.html')
    zf.write('options.css')
    zf.write('style.css')
    zf.write('jquery-3.5.1.min.js')
    zf.write('jquery-ui.js')
    zf.write('jquery-ui.css')
    zf.write('icon24.png')
    zf.write('icon128.png')
    for folder, subfolders, files in os.walk('_locales'):
        zf.write(folder)
        for file in files:
            zf.write(os.path.join(folder, file))
