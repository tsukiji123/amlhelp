var {app,BrowserWindow,Menu} = require('electron');

app.on('ready',function() {
	var win = new BrowserWindow({width:1200, height:800, webPreferences:{nodeIntegration:true}});
	win.loadFile('index.html');
	
	//console.log("start to load main-window.");
	win.on('closed',function(){
		//console.log('main-window was closed.');
		app.quit();
	});

	var ipc = win.webContents;
	Menu.setApplicationMenu(Menu.buildFromTemplate([
		{
			label:'ファイル',
			submenu:[{
				label:'開く...',
				accelerator:'CmdOrCtrl+O',
				click:function(){ ipc.send('open_file'); }
			},{
				label:'保存',
				accelerator:'CmdOrCtrl+S',
				click:function(){ ipc.send('save_file'); }
			},{
				label:'印刷',
				accelerator:'CmdOrCtrl+P',
				click:function(){ ipc.send('print_pdf'); }
			}]
		},{
			label:'その他',
			submenu:[{
				label:'リロード',
				accelerator:'CmdOrCtrl+R',
				role:'forceReload'
			},{
				label:'開発ツール',
				accelerator:'CmdOrCtrl+D',
				role:'toggleDevTools'
			}]
		}
	]));
});
