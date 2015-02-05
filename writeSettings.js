
function writeSettings(divName,key){
	//appends saved settings to a html element with name=divName,key is the dataset within local

	var div=d3.select(divName);				//selecting the html element
	var retrievedData;							//raw json String
	var data;												//parsed json


	try{
	retrievedData=localStorage.getItem("Local");		//getting saved settings from localStoreage
	data=JSON.parse(retrievedData);
	keyStore["Local"]=data;													//writing the retrieved data to keyStore
	}
	catch(err){
		console.log("error reading from local host");
	}

	//Socket.setKeyValue("Local",retrievedData,"write");	//Should we be sending saved values to the robot??
	var storedSettings=keyStore.Local;									//retreiving the stored settings
	//D3 Starts Here

	div.selectAll("div")								//selecting all the divs within our div
	.data(data.names)
	.enter()
	.append("span")
	.text(function(d,i){
		return storedSettings["names"][i];
	})
	.append("form")														//appending submitForms for each data
	.append("input")													//appending input forms in the submit forms
	.attr("type","text")
	.attr("value",function(d,i){						//setting values
		return storedSettings["values"][i];
	})
	.attr("id",function(d,i){									//setting id's
		return storedSettings["names"][i];
	});
}

$(document).ready(function(){											//on startup write settings
	writeSettings(".settingsBox");
});
