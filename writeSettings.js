
function writeSettingsFromLocal(divName,key){
	//appends saved settings to a html element with name=divName,key is the dataset within local

	var div=d3.select(divName);				//selecting the html element
	var retrievedData;							//raw json String
	var data;												//parsed json
	var Local;

	try{
		retrievedData=localStorage.getItem("Local");		//getting saved settings from localStoreage
		data=JSON.parse(retrievedData);
		writeSettings(data);
	}
		catch(err){
			console.log("error reading from local host");
		}
	}

	//D3 Starts Here
function writeSettings(data){		//takes an object with 2 arrays, names and values
	try{
		div.selectAll("div")								//selecting all the divs within our div
		.data(data.names)
		.enter()
		.append("span")
		.text(function(d,i){
			return data["names"][i];
		})
		.append("form")														//appending submitForms for each data
		.append("input")													//appending input forms in the submit forms
		.attr("type","text")
		.attr("value",function(d,i){						//setting values
			return data["values"][i];
		})
		.attr("id",function(d,i){									//setting id's
			return data["names"][i];
		});
	}
	catch(err){
		logConsole("no file to write in writeSettings.js");
	}
}

$(document).ready(function(){											//on startup write settings
	writeSettingsFromLocal(".settingsBox");
});
