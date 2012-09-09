if(! localStorage.nodeURL){
	var url = prompt("enter your websocket url.\nexample: http://example.com:8001","");

	localStorage.nodeURL = url;
}

var socket = io.connect(localStorage.nodeURL);

chrome.browserAction.setBadgeBackgroundColor({color:[30,30,30,255]});

// mongo上のファイルリスト受信
socket.on('files', function(file){

	// 既存リスト展開
	var localFile = [];
	if(localStorage.files){
		localFile = JSON.parse(localStorage.files);
	}

	var insert = true;
	for(var i = 0; i < localFile.length; i++){
		if(localFile[i].host == file.host &&
		   localFile[i].path == file.path){
			insert = false;
			break;
		}
	}
	if(insert){
		localFile.push(file);
	}

	// localStorageに反映
	localStorage.files =  JSON.stringify(localFile);

	var tabs = {};
	if(localStorage.tabs){
		tabs = JSON.parse(localStorage.tabs);
	}

	for(var i in tabs){
		for(var k in tabs[i]){
			if(tabs[i][k].host == file.host &&
			   tabs[i][k].path == file.path){
				chrome.tabs.sendRequest(Number(i), {action:'reload'}, function(){});
				break;
			}
		}
	}
});

// タブ更新でバッジセット
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	var tabs = {};
	if(localStorage.tabs){
		tabs = JSON.parse(localStorage.tabs);
	}

	if(! tabs[tab.id]){
		return;
	}

	var count = tabs[tab.id].length;
	chrome.browserAction.setBadgeText({text: String(count), tabId: tab.id});
});


// タブが閉じられたら localStorage から削除
chrome.tabs.onRemoved.addListener(function(tabID){
	var tabs = {};
	if(localStorage.tabs){
		tabs = JSON.parse(localStorage.tabs);
	}

	delete tabs[tabID];
	localStorage.tabs =  JSON.stringify(tabs);
});

