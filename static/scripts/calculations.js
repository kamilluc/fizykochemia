

function loadHeat(data)
{

	var dataArray = data.split('\n');
	var result = [];
	
	for(var i=5; i<dataArray.length-1; i++)
	{
		var temp = {};
		temp.t = parseFloat(dataArray[i].split(' ')[0]);
		temp.cp = parseFloat(dataArray[i].split(' ')[1]);
		result.push(temp);
	}
	

	return result;

}

function calcFunctionValue(functionParams, polynomialDeg, t)
{
	var cp = 0;
	var temp = 1;
	for(var i = 0; i <= polynomialDeg; i++)
	{
		temp = 1;
		for(var j = 0; j < i; j++)
		{
			temp *= t;
		}
		cp += temp * functionParams[i];
	}
	
	return cp;
}

function sortBy_t(a, b)
{
	if(a.t > b.t)
		return 1;
	else
		return -1;
}

// getInputSettings

function lineInterploation(x0,y0,x1,y1,x){
	return y0+(y1-y0)/(x1-x0)*(x-x0);
}

function applyPhaseTransitions(heatArray, phaseTransitions)
{
	var containsT_start, containsT_stop;
	var start_index, stop_index;
	for(var i=0; i< phaseTransitions.length; i++)
	{
		if(phaseTransitions[i].active)
		{
			containsT_start = false;
			containsT_stop = false;
			start_index = 0;
			stop_index = 0;
			for(var j=0; j< heatArray.length; j++)
			{
				if(heatArray[j].t == phaseTransitions[i].t_start)			
					containsT_start = true;
				else if(heatArray[j].t < phaseTransitions[i].t_start)			
					start_index = j;

				if(heatArray[j].t == phaseTransitions[i].t_stop)
					containsT_stop = true;
				else if(heatArray[j].t < phaseTransitions[i].t_stop)
					stop_index = j;
			}
			if(!containsT_start)
			{
				var objToPush = {};
				objToPush.t=phaseTransitions[i].t_start;
				objToPush.cp = lineInterploation(	heatArray[start_index].t, 
																					heatArray[start_index].cp,
																					heatArray[start_index+1].t,
																					heatArray[start_index+1].cp,
																					phaseTransitions[i].t_start);
				heatArray.push(objToPush);				
			}
			if(!containsT_stop){
				var objToPush = {};
				objToPush.t=phaseTransitions[i].t_start;
			
				objToPush.cp = lineInterploation(	heatArray[stop_index].t, 
																					heatArray[stop_index].cp,
																					heatArray[stop_index+1].t,
																					heatArray[stop_index+1].cp,
																					phaseTransitions[i].t_stop);
				heatArray.push(objToPush);
			}
						
			if(!containsT_start || !containsT_stop)
			{
				heatArray.sort(sortBy_t);
			}
		}
	}
}

function generateMorePoints(heatArray, precision){
	heatArray.sort(sortBy_t);
	var dataLength = heatArray.length;
	
	for(var k=0;k<dataLength-1;k++){
		var startTemperature = heatArray[k].t; 
		var endTemperature = heatArray[k+1].t; 
	
		for(var p =startTemperature+precision; p<endTemperature;p+=precision){
			var objToPush = {};
			objToPush.t=p;
		
			objToPush.cp = lineInterploation(	heatArray[k].t, 
																				heatArray[k].cp,
																				heatArray[k+1].t,
																				heatArray[k+1].cp,
																				p);
			heatArray.push(objToPush);
		}
	}
	

	heatArray.sort(sortBy_t);
}



function triangleFunction(x)
{
	return -x+10;
}

function gaussFunction(x)
{
	return Math.exp(-(x*x));
}


function sFunction(x)
{
	return 1/(1+ Math.abs(((x-0.5)/-3)) ^(3));
}



function integration(f, a, b)
{
  var N = 100;
  var s,dx,i,t;

    s = 0;
    dx = (b - a) / N;
    for(i = 1; i < N; i++) 
			s += f(a + i * dx);
    s = (s + (f(a) + f(b)) / 2) * dx;

	return s;
}

function addPhaseTransitionEnthalpyToHeatAray(heatArray, phaseTransitionConfig)
{
	var calculateFunction = null;
	var a, b;
	var isStartPoint = false;
	
	switch(phaseTransitionConfig.function)
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
		isStartPoint = true;
		break;
	default:
		calculateFunction = triangleFunction;
		a = 0;
		b = 10;
	}

	if(isStartPoint){
		for(var i=0; i<heatArray.length; i++){
		
			if(heatArray[i].t == phaseTransitionConfig.t_start )
				heatArray[i].h = phaseTransitionConfig.q;
			else if(typeof(heatArray[i].h) == 'undefined')
				heatArray[i].h = 0;
		}
		return;
	}
	

	var ref_diff = b - a;
	var act_diff = phaseTransitionConfig.t_stop - phaseTransitionConfig.t_start;

	var P_ref = integration(calculateFunction, a, b);
	for(var i=0; i<heatArray.length; i++)
	{
		if(heatArray[i].t > phaseTransitionConfig.t_start && 
				heatArray[i].t <= phaseTransitionConfig.t_stop)
		{
			var t_ref_1 = (heatArray[i-1].t -phaseTransitionConfig.t_start) / act_diff * ref_diff +a;
			var t_ref_2 = (heatArray[i].t-phaseTransitionConfig.t_start) / act_diff * ref_diff +a;

			var P_act = ((calculateFunction(t_ref_1) + calculateFunction(t_ref_2)) / 2) 
										* (t_ref_2 - t_ref_1);

			heatArray[i].h = (P_act / P_ref) * phaseTransitionConfig.q;

		}
		else
		{
			if(typeof(heatArray[i].h) == 'undefined')
			{
				heatArray[i].h = 0;
			}
		}
	}
}	


function calculateEnthalpy(heatArray)
{
	var h0 = heatArray[0].h + (heatArray[0].t * heatArray[0].cp);
	heatArray[0].h = h0;
	for(var i=1; i< heatArray.length; i++)
	{
		var hi = h0 + ((heatArray[i-1].cp + heatArray[i].cp)/2 * (heatArray[i].t - heatArray[i-1].t));
		heatArray[i].h += hi;
		h0 = heatArray[i].h;
	}
	return heatArray;
}


// main

function calculateEvent()
{
	var phaseTransitions = getInputSettings();
	var inputHeatData = getInputData();
	
	var heatArray = loadHeat(inputHeatData);
	
	generateMorePoints(heatArray,1);
	applyPhaseTransitions(heatArray, phaseTransitions);

	for(var i=0; i< phaseTransitions.length; i++)
	{
		if(phaseTransitions[i].active)
		{
			addPhaseTransitionEnthalpyToHeatAray(heatArray, phaseTransitions[i]);
		}
	}

	calculateEnthalpy(heatArray);
	
	return heatArray;

}



