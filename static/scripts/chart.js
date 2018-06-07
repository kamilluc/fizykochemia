
function printChart(data)
{
	let dataPoints = [];
	let options = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Entalpia"
		},
		axisX: {
			title:"Temperatura",
			valueFormatString: "#######################",
		},
		axisY: {
			title: "Entalpia",
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
	$("#chartContainer").CanvasJSChart(options);

}


