
var dataHistory = [];

function printChart(data)
{


	let dataPoints = [];

	for (let i = 0; i < data.length; i++) {
		dataPoints.push({
			x: data[i].t,
			y: data[i].h
		});
	}

	dataHistory.push(dataPoints);


	var chartData = [];
	for(var k =0; k < dataHistory.length;k++){
		var tmp = {};
		tmp.type ="spline";
		tmp.dataPoints = dataHistory[k];
		tmp.xValueType ="number";
		chartData.push(tmp);
	}
	
	let options = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Entalpia"
		},
		axisX: {
			title:"Temperatura [°C]",
			valueFormatString: "#######################",
		},
		axisY: {
			title: "Entalpia [J/g]",
			titleFontSize: 24,
			includeZero: false
		},
		data:chartData
	};

	$("#chartContainer").CanvasJSChart(options);
}



function printChartCp(data)
{
	let dataPoints = [];
	let options = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Ciepło właściwe"
		},
		axisX: {
			title:"Temperatura [°C]",
			valueFormatString: "#######################",
		},
		axisY: {
			title: "Ciepło właściwe [J/g*°C]",
			titleFontSize: 24,
			includeZero: false
		},
		data: [{
			type: "spline",
			dataPoints: dataPoints,
			xValueType: "number",
		}]
	};

	for (let i = 0; i < data.length; i++) {
		dataPoints.push({
			x: data[i].t,
			y: data[i].cp
		});
	}
	$("#chartContainerCp").CanvasJSChart(options);
}

function printChartInDiv(data,divId)
{
	let dataPoints = [];
	let options = {
		animationEnabled: true,
				theme: "light2",
		theme: "light2",
		axisX: {
			title:"X",
			valueFormatString: "#######################",
		},
		axisY: {
			title: "Y",
			titleFontSize: 24,
			includeZero: false
		},
		data: [{
			type: "spline",
			dataPoints: dataPoints,
			xValueType: "number",
		}]
	};

	for (let i = 0; i < data.length; i++) {
		dataPoints.push({
			x: data[i].x,
			y: data[i].y
		});
	}
	
	$(divId).CanvasJSChart(options);
}





function generateOuputFile(){
	if(result != null){
		var d = new Date();
		var strFile = generateOutpuFileData(result);
		download('result' + d.getTime() + '.txt' , strFile);	
	}
}

function generateOutpuFileData(data){

	var ouputStr = "";
	
	for(var k =0;k<data.length;k++){
		ouputStr += data[k].t + "\t" + data[k].cp + "\n";
	}
	
	return ouputStr;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function clearChartData(){
	dataHistory = [];
	printChartCp([]);
	printChart([]);
	isPrintCpChart = false;
}

function drawHelpChart(position){

    let methods = document.querySelectorAll("select");
		var fun = methods[position-1].value;
		
		var a;
		var b;
		var calculateFunction;
		var isNull = false;
		switch(fun)
		{
		case 'Triangle':
			calculateFunction = triangleFunction;
			a = 0;
			b = 10;
			break;
		case 'Gauss':
			calculateFunction = gaussFunction;
			a = -2;
			b = 2;
			break;
		case 'S':
			calculateFunction = sFunction;
			a = 0;
			b = 6;
			break;
		case 'StartPaint':
			calculateFunction = function(x){return x == a ? 1 : 0;};
			a = 0;
			b = 10;
			break;
		default:
			isNull = true;

		}
		
		var chartData = [];
		
		if(!isNull){
			var dx = (b-a)/100;
			for(var x = a; x<b;x+=dx){
				var tmp = {};
				tmp.x = x;
				tmp.y = calculateFunction(x);
				chartData.push(tmp);
			}		
		}
		
		printChartInDiv(chartData,"#selectedFunctionChart"+position);

}

