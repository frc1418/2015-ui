'use strict';

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
		console.log('ID IS ',id);
		d3.event.preventDefault();
		//var t=$("[id=\'"+id+"\']");

		var docdiv=document.getElementById(id);
		var t=$(docdiv);
		var type=t.attr('returnType');
		var value=t.val();
		console.log('TYPE IS ',type);
		if(type=='String'){
			value=String(value);
		}
		else if(type=='number'){
			value=Number(value);
		}

		//id=id.substring(id.indexOf('|'));
		var Message={
			//'key':RegExp.unescape(id),
			'key':id,
			'value':value,
			'isNum':true,
			'action':'write'
		}
		Socket.setValue(Message,true);
	}
function writeSettings(data,divname){		//takes an object with 2 arrays, names and values
	div=d3.select(divname);				//selecting the html element

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
		eachDiv.selectAll("div")								//selecting all the divs within our div
		.data(data["divs"][a]['names'])
		.enter()
		.append("span")
		.text(function(d,i){
			console.log('txtCalled');
			var str=data["divs"][a]['names'][i];
			var indexOf=str.indexOf('SmartDashboard')+16;
			return str.substring(indexOf);
		})
		.append("form")														//appending submitForms for each data
		.on("submit",function(d,i){
				console.log('asdfasdfasdf');

			var theid=data["divs"][a]['names'][i];
			var val=data["divs"][a]['values'][i];
			var func=setTuningVal(theid);
			return func;
		})
		.append("input")										//appending input forms in the submit forms
		.attr("type","text")
		.attr('returnType',function(d,i){
			console.log('returnTypeCalled');
			return typeof(data['divs'][a]['values'][i]);
		})
		.attr("value",function(d,i){						//setting values
			return data["divs"][a]['values'][i];
		})
		.attr("id",function(d,i){									//setting id's of each form
		return data["divs"][a]['names'][i];
	});
		}
}

function writeArray(IdArray,divname){
	//use an array of values to write tuning variables
	//idArray is a array of delimiters to display
	var end=IdArray.length;

		var data={};
		data.divs=new Array();
	for(var a=0;a<end;a++){

		var Div={
			'names':new Array(),
			'values':new Array()
		};
		data['divs'].push(Div);
		for (var property in keyStore){//for every key in keyStore
			if (keyStore.hasOwnProperty(property)) {
					var contains=property.indexOf(IdArray[a]);
					if(contains!=-1){
									data['divs'][a]['names'].push(property);
									data['divs'][a]['values'].push(keyStore[property]);
					}
			}
		}
	}
	writeSettings(data,divname);
}
