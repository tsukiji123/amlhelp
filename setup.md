# このプロジェクトの構築手順

## プロジェクトの作成
1. 新しいフォルダー > "amlhelp"
1. VSCodeで"フォルダーを開く..."
1. 表示 > ターミナル
1. electronなどをインストール
	```sh
	npm init -y
	npm i electron electron-builder -D
	```

1. "package.json"を編集
	```json
	{
		"name": "amlhelp",
		"version": "1.0.0",
		"description": "",
		"main": "main.js", //<== "index.js"を"main.js"に変更
	```

1. "main.js"と"index.html"を作成
	* main.js
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

## 動作テスト
1. electron単体で実行
	```sh
	npx electron .
	```

1. デバッグの設定
	1. デバッグ > 構成の追加... > Node.js
	1. "launch.json"を編集
		```json
		{
			//...省略
			"configurations": [
				{
					"type": "node",
					"request": "launch",
					"name": "Launch Program",
					"program": "${workspaceFolder}/main.js", //<=="main.js"に変更
					"skipFiles": [
						"<node_internals>/**"
					],
					//以下を追加
					"runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
					"outputCapture":"std"
				}
			]
		}
		```

1. デバッグ確認
	1. main.jsにブレークポイントを設定
	1. デバッグ > デバッグの開始

## ビルド方法
1. iconファイルの設置
	* 256x256のPNGから**icon.ico**を作成
		> 参考：https://ao-system.net/alphaicon/
1. ビルドを実行
	```sh
	npx electron-builder -w portable
	```
