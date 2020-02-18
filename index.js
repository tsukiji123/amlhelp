var {remote,ipcRenderer} = require('electron');
var fs = require('fs');
var path = require('path');

var editor = null;
var viewer = null;
var curFile = null;

window.onload = function(){
	marked.setOptions({breaks:true});
	
	editor = ace.edit("editor",{mode:'ace/mode/markdown',printMargin:false});
	viewer = document.getElementById('viewer');

	document.querySelectorAll("header > div").forEach(function(e){
		e.addEventListener('click',function(){
			var target = this.getAttribute("for");
			if (target == 'viewer') { render_view(); }
			//toggle main
			document.querySelectorAll("main > div").forEach(function(e){ e.classList.remove("active"); });
			document.getElementById(target).classList.add('active');
			//toggle tabs
			document.querySelectorAll("header > div").forEach(function(e){ e.classList.remove("active"); });
			this.classList.add('active');
		});
	});

	open_file();
};

function render_view() {
	viewer.innerHTML='';
	var a = editor.getValue().split(/\n===+\n/);
	for (var i=0; i < a.length; i++) {
		var page = document.createElement('page');
		page.innerHTML = marked(a[i]);
		var num = document.createElement('number');
		num.innerHTML = i+1;
		page.appendChild(num);
		viewer.appendChild(page);
	}
}

function open_file(){
	remote.dialog.showOpenDialog(remote.getCurrentWindow(),{
		properties:['openFile'],
		filters:[ {name:'Markdown',extensions:['md']}]
	}).then(function(ret){
		if (ret.filePaths.length) {
			curFile = ret.filePaths[0];
			editor.setValue(fs.readFileSync(curFile,'utf-8'), -1);
			var dir = 'file://'+path.dirname(curFile).replace(/\\/g,'/')+'/';
			marked.setOptions({baseUrl:dir});
			render_view();
		}
	});
}

function save_file() {
	if (curFile) {
		fs.writeFileSync(curFile,editor.getValue());
	} else {
		remote.dialog.showSaveDialog().then(function(ret){
			if (ret.filePath) {
				curFile = ret.filePath;
				var dir = 'file://'+path.dirname(curFile).replace(/\\/g,'/')+'/';
				marked.setOptions({baseUrl:dir});
				fs.writeFileSync(curFile,editor.getValue());
			}
		});
	}
}

function print_pdf() {
	render_view();
	//close all sub-windows
	var cw = remote.getCurrentWindow();
	cw.getChildWindows().forEach(function(e){ e.close(); });
	//var win = new remote.BrowserWindow({autoHideMenuBar:true,webPreferences:{nodeIntegration:true}});
	//win.webContents.on('dom-ready',function(){
	var win = new remote.BrowserWindow({parent:cw,show:false,webPreferences:{nodeIntegration:true}});
	win.on('ready-to-show',function(){
		win.send('print_pdf',viewer.innerHTML);
	});
	win.loadFile('print.html');
	//console.log('start to load sub-window.');
	//win.on('closed',function(){
	//	console.log('sub-window was closed.');
	//});
}

ipcRenderer.on('open_file',open_file);
ipcRenderer.on('save_file',save_file);
ipcRenderer.on('print_pdf',print_pdf);
