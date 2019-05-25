// global variables
var search_string;
var database = [];



// constructor for page object which stores data of .html pages
function page(name, url, key, text){
	this.name = name;
	this.url = url;
	this.keywords = key;
	this.text = text;
}


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
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var name;
			var keywords;
			var text = "";
			var string = this.responseText;
			var pos1 = string.indexOf("<meta");
			var pos2;
			while(pos1!=-1){
				pos2 = string.indexOf(">", pos1+5);
				var str = string.slice(pos1+1, pos2);
				pos1 = string.indexOf("<meta",pos2);
				var content = str.split(/content[=\s\"]*/)[1].split(/\"/)[0];
				if(str.indexOf("keywords") != -1){
					keywords = content;
				}
				if(str.indexOf("description") != -1){
					name = content;
				}
			}
			var data = string.split("<body>")[1].split(/[\s\n\t]*<[A-Za-z\s!\/\"\",=\.]*>[\s\n\t]*/);
			for(i = 0; i<data.length; i++){
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


