/*
var testSettingsObject={
	"names":[1,2,3,4,5],
	"values":["a","b","c","d","e"]
}
*/
function writeSettings(divName){
	//writes settings UI elements from file, to UI
	var div=d3.select(divName);//at the moment, all of the id's should be ".settingsBox"


	var retrievedData;
	var data;
	console.log("attempting to get data from local");
	try{
	retrievedData=localStorage.getItem("Local");
	data=JSON.parse(retrievedData);
	keyStore["Local"]=data;
	}
	catch(err){
		console.log("error reading from local host");
	}
	//setKeyValue("Local",retrievedData);			//MAKE IT IMPORT SOCKETCONTROLLER
	console.log(keyStore);

	var parsedData=data;

	div.selectAll("div")		//selecting all the divs within our div
	.data(parsedData["names"])
	.enter()
	.append("span")
	.text(function(d,i){
		return parsedData["names"][i];
	})
	.append("form")				//appending submitForms for each data
	.append("input")			//appending input forms in the submit forms
	.attr("type","text")
	.attr("value",function(d,i){			//setting values
		return parsedData["values"][i];
	})
	.attr("id",function(d,i){				//setting id's
		return parsedData["names"][i];
	});

}

$(document).ready(function(){

	writeSettings(".settingsBox");

});
