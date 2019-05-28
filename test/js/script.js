makeSearchDatabase("searchEngineUrls.txt");

var searchEntry = document.getElementById("searchEntry");
var searchOutput = document.getElementById("searchOutput");


searchEntry.addEventListener("keydown",(function(event) {
	/* Act on the event */
	while (searchOutput.hasChildNodes()) {   
		searchOutput.removeChild(searchOutput.firstChild);
	}
	var ul = document.createElement("ul");
	var result = getSearchResponse(searchEntry.value);
	for( i = 0; i < result.length; i++){
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute("href", result[i].url);
		var node = document.createTextNode(result[i].name);
		a.appendChild(node);
		li.appendChild(a);
		ul.appendChild(li);
		searchOutput.appendChild(ul);
	}
}));

