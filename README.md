# AmlHelp

## 設置手順
1. 新しいフォルダー > "amlhelp"
1. VSCodeで"フォルダーを開く..."
1. 表示 > ターミナル
1. electronなどをインストール
	```sh
	npm init -y
	npm i electron electron-builder -D
	```

1. "index.js"と"index.html"を作成
	* index.js
	```js
	var {app,BrowserWindow} = require('electron');
	app.on('ready',function() {
		(new BrowserWindow()).loadFile('index.html');
	});
   ```
   * index.html
   ```html
	Hello World!
	```

## 動作確認
1. 普通の実行
	```sh
	npx electron .
	```

1. デバッグの設定
	1. デバッグ > 構成の追加... > Node.js
	1. "launch.json"を編集
		```diff
				"skipFiles": [
					"<node_internals>/**"
				],
		-		"program": "${workspaceFolder}/app.js"
		+		"program": "${workspaceFolder}/index.js",
		+		"runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
		+		"outputCapture":"std"
			}
		]
		```

1. デバッグ
	1. index.jsにブレークポイントを設定
	1. デバッグ > デバッグの開始

## ビルド手順
1. "icon.ico"の設置
	* 256x256のPNGから.icoを作成
		> 参考：https://ao-system.net/alphaicon/
1. ビルド
	```sh
	npx electron-builder -w portable
	```
