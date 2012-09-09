chrome.extension.onRequest.addListener(
    function(req, sender, sendResponse){
        if(req.action == 'reload'){
			document.location.reload(true);
        }
    }
);

