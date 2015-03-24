'use strict';

function writeSettingsFromLocal(divName,key){
	//appends saved settings to a html element with name=divName,key is the dataset within local

	var div;
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
		var docdiv=document.getElementById(id);
		var t=$(docdiv);
		var type=t.attr('returnType');
		var value=t.val();
		if(type=='String'){
			value=String(value);
		}
		else if(type=='number'){
			value=Number(value);
		}

		NetworkTables.setValue(id,value);
	}
function writeSettings(data,divname){		//takes an object with 2 arrays, names and values
	var div=d3.select(divname);				//selecting the html element
		var forms=[[],[]];
	div.selectAll('div')
		.data(data['divs'])
		.enter()
		.append('div')
		.attr('id',function(d,i){
			return 'divId'+i;
			})
		.style('float','left');

		for(var a=0;a<data['divs'].length;a++){
		var eachDiv=d3.select('#divId'+a);
		var test=eachDiv.selectAll("div")								//selecting all the divs within our div
		.data(data["divs"][a]['names'])
		.enter()
		.append("span")
		.text(function(d,i){
			var str=data["divs"][a]['names'][i];
			var indexOf=str.indexOf('SmartDashboard')+16;
			return str.substring(indexOf);
		})
		.append("form")														//appending submitForms for each data

		.attr("id",function(d,i){									//setting id's of each form
		return data["divs"][a]['names'][i]+'FORM';
		})
		.append("input")										//appending input forms in the submit forms
		.attr("type","text")
		.attr('returnType',function(d,i){
			return typeof(data['divs'][a]['values'][i]);
		})
		.attr("value",function(d,i){						//setting values
			return data["divs"][a]['values'][i];
		})
		.attr("id",function(d,i){									//setting id's of each form
		return data["divs"][a]['names'][i];
	});

			for(var b=0;b<data['divs'][a]['names'].length;b++){

				var docdiv=document.getElementById(data["divs"][a]['names'][b]+'FORM');
				forms[a][b]=$(docdiv);
				forms[a][b].submit(function(event){
					event.preventDefault();
					var ref=$(this);
					var retString=ref.attr('id').substring(0,ref.attr('id').length-4);
					setTuningVal(retString);
				});
			}
	}
}
var tuningData={};
function writeArray(IdArray,divname){
	//use an array of values to write tuning variables
	//idArray is a array of delimiters to display
	var end=IdArray.length;

		tuningData.divs=new Array();
	for(var a=0;a<end;a++){

		var Div={
			'names':new Array(),
			'values':new Array()
		};
		tuningData['divs'].push(Div);
		for (var property in NetworkTables.ntCache){//for every key in keyStore
			if (NetworkTables.containsKey(property)) {			//if keystore contains the property		//!!!!!!!! check this line ,was originally keyStore.has own property
					var contains=property.indexOf(IdArray[a]);//property contains the delimiter
					if(contains!=-1){
									tuningData['divs'][a]['names'].push(property);
									tuningData['divs'][a]['values'].push(NetworkTables.getValue(property));
					}
			}
		}
	}
	console.log(tuningData,NetworkTables.ntCache);
	writeSettings(tuningData,divname);
}
function AddGlobalListenerForTuning(IdArray){
	var end=idArray.length;
	NetworkTables.addGlobalListener(function(key,val){
		for(var a=0;a<end;a++){
			if(key.indexOf(IdArray[a])!=-1){
				tuningData['divs'][a]['names'].push(property);
				tuningData['divs'][a]['values'].push(NetworkTables.getValue(property));
			}
		}
	},true);
}
