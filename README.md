# DeepLopener ReWrite 計画!!!!

- contents.js ははじめに background.js に api_key を尋ねるようにする．
- Contextmenu の切り替えは廃止して，PDF の判定は contents.js で行う．つまり，Contextmenu での見た目上は遷移モードと PDF モードは変わらなくなるがまあ別にいいだろう．

message:ContextMenu
selectionText:info.selectionText
翻訳の順番の関係で list に翻訳結果を cache してたはずなのでその実装を消したい．
これは contents.js で翻訳が完結するので容易に実装できると思う．

# contents.js のフラグ回り

- popup
- ispdf
- icon
