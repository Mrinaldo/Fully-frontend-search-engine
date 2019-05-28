// global variables
var search_string;
var database = [];


/* start of creation of database object */

// creates a database object for all the webpages in a website which will help in searching
function makeSearchDatabase(url){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var files = this.responseText.split("\n");
			for (i = 0; i < files.length; i++){
				getDataFromFile(files[i]);
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

// parses data from .html file and puts it into the database object
function getDataFromFile(file){

	// constructor for page object which stores data of .html/.php pages
	function page(name, url, key, text){
		this.name = name;
		this.url = url;
		this.keywords = key;
		this.text = text;
	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var name;
			var keywords;
			var string = this.responseText;
			var pos1 = string.indexOf("<meta");
			var pos2;
			while(pos1!=-1){
				pos2 = string.indexOf(">", pos1+5);
				var str = string.slice(pos1+1, pos2);
				pos1 = string.indexOf("<meta",pos2);
				if(str.search(/name[=\s\"]*keywords/) != -1){
					keywords = str.split(/content[=\s\"]*/)[1].split(/\"/)[0];
				}
				if(str.search(/name[=\s"]*description/) != -1){
					name = str.split(/content[=\s\"]*/)[1].split(/\"/)[0];
				}
			}

			var data = string.split("<body>")[1].split(/[\s\n]*<[^>]*>[\s\n]*/);
			var text = "";
			for(i = 0; i < data.length; i++){
				if(data[i]!=""){
					text = text + data[i] + " ";
				}
			}
			database.push(new page(name ,file, keywords, text));
		}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
}

/* end of database object creation */



/* start of search string response generation */

function getSearchResponse(searchString){

	var searchResponse = [];

	// constructor for search results which stores name, url and search points
	function searchResult(name, url, points){
		this.name = name;
		this.url = url;
		this.points = points;
	}

	for( i = 0; i < database.length; i++){
		var points = 0;
		if(database[i].name.search(new RegExp(searchString, "i"))!=-1){
			points += 20;
		}
		if(database[i].keywords.search(new RegExp(searchString, "i"))!=-1){
			points += 10;
		}
		if(database[i].text.search(new RegExp(searchString, "i"))!=-1){
			points += 5;
		}
		if(points!=0){
			// only those results which have a search match are pushed into response
			searchResponse.push(new searchResult(database[i].name, database[i].url, points));
		}
	}

	// compare function for sorting array of objects
	function compareResponse(a,b){
		if(a.points > b.points)
			return -1;
		else if(a.points < b.points)
			return 1;
		else
			return 0;
	}

	//sorting search response in descending order of points
	searchResponse.sort(compareResponse);
	delete searchResponse.filter(function(value){delete value.points;});
	return searchResponse;
}

/* end of search string response generation. */



