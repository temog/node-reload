$(function(){

	// リストを空に
	$("body").html('');

	var host = {};
	var files;
	if(localStorage.files){
		files = JSON.parse(localStorage.files);
	}
	else {
		$("body").html('no reception from node.js');
	}

	for(var i in files){
		if(! host[files[i].host]){
			$("body").append('<div><h3>' + files[i].host + '</h3></div>');
		}
		host[files[i].host] = true;

		$("h3").each(function(){
			if($(this).html() == files[i].host){
				$(this).parent().
					append('<p title="' + files[i].updated + '">' + files[i].path + '</p>');

				return false;
			}
		});
	}

	// click event 再設定
	$("p").click(function(){
		toggleReloadList(this);	
	});

	// 選択済みリストを復元する
	restoreSelectedList();

});

// 更新対象のpathを追加・削除する
function toggleReloadList(obj){

	chrome.tabs.getSelected(null, function(tab){

		var tabs = {};
		if(localStorage.tabs){
			tabs = JSON.parse(localStorage.tabs);
		}

		var path = $(obj);
		// 選択済みなので解除
		if(path.hasClass("selected")){
			path.removeClass("selected");
		}
		// 選択状態にする
		else {
			path.addClass("selected");
		}

		// 選択状態のリストを取得
		var list = [];
		$("h3").each(function(){

			var host = $(this).html();
			$(this).nextAll(".selected").each(function(){
				list.push({'host': host, 'path': $(this).html()});
			});
		});
		tabs[String(tab.id)] = list;

		// バッジ設定
		chrome.browserAction.setBadgeText(
			{text: String(list.length), tabId: tab.id});

		// listをlocalStorage にセット
		localStorage.tabs = JSON.stringify(tabs);
	});

}

// 選択済みリストを復元する
function restoreSelectedList(){

	chrome.tabs.getSelected(null, function(tab){

		var tabs = {};
		if(localStorage.tabs){
			tabs = JSON.parse(localStorage.tabs);
		}

		for(var i in tabs[tab.id]){

			// hostを探して
			$("h3").each(function(){
				if($(this).html() == tabs[tab.id][i].host){
					// list に class を反映
					$(this).nextAll().each(function(){
						if($(this).html() == tabs[tab.id][i].path){
							$(this).addClass("selected");
						}
					});
				}
			});
		}
	});
}

