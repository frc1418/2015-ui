var div;
function writeSettingsFromLocal(divName,key){
	//appends saved settings to a html element with name=divName,key is the dataset within local

	div=d3.select(divName);				//selecting the html element
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
	function setTuningVal(id){
		d3.event.preventDefault();
		console.log("#"+id);
		var t=d3.select("#"+id);
		var value=t.property("value");
		console.log(t);
		console.log("attempting send of ",id," ",value);
		Socket.setKeyValue(id,value,'write');
	}
function writeSettings(data,divname){		//takes an object with 2 arrays, names and values
	try{
		console.log(data," writing to ",divname);
		console.log(data," with ",divname)
		div=d3.select(divname);				//selecting the html element
		div.selectAll("div")								//selecting all the divs within our div
		.data(data["names"])
		.enter()
		.append("span")
		.text(function(d,i){
			return data["names"][i];
		})
		.append("form")														//appending submitForms for each data
		/*.attr("id",function(d,i){									//setting id's of each form
			return data["names"][i];
		})*/
		.on("submit",function(d,i){
			var id=data["names"][i];
			var val=data["values"][i];
			var func=setTuningVal(id);
			return func;
		})
		.append("input")										//appending input forms in the submit forms
		.attr("type","text")
		.attr("value",function(d,i){						//setting values
			return data["values"][i];
		})
		.attr("id",function(d,i){									//setting id's of each form
		return data["names"][i];
	});

	}
	catch(err){

		console.log(err.message);
	}
}
function writeArray(IdArray,divname){
	//use an array of values to write tuning variables
	//idArray is a array of delimiters to display
	var end=IdArray.length;
	
		var data={};
		data.names=new Array();
		data.values=new Array();
		console.log(end);
	for(var a=0;a<end;a++){

		for (var property in keyStore){//for every key in keyStore
			//console.log(property," is checked");
			if (keyStore.hasOwnProperty(property)) {
					var contains=property.indexOf(IdArray[a]);
					//console.log(str," is being compared to ", data.names[a]);
						if(contains!=-1){
									data["names"].push(property);
									data["values"].push(keyStore[property]);
						}
					}
				}
}
writeSettings(data,divname);
}

$(document).ready(function(){											//on startup write settings
	//writeSettingsFromLocal(".settingsBox");
	//write a set of tuning values for every delimiter in the array


});
