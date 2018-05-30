
function provideData()
{
	return 'NAME Specific Heat\nXLABEL X-axis\nYLABEL Y-axis\nSCALE 1.000000 1.000000\nOFFSET 0.000000 0.000000\n56.000000 0.448640\n96.000000 0.488480\n136.000000 0.505580';
}

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
	
	// uzupelnienie danych o t i cp co 1 stopien
	// interpolacja cp
	
	return result;

}

function sortBy_t(a, b)
{
	if(a.t > b.t)
		return 1;
	else
		return -1;
}

// getInputSettings

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
				if(heatArray[j].h == phaseTransitions[i].t_start)			
					containsT_start = true;
				else if(heatArray[j].h < phaseTransitions[i].t_start)			
					start_index = j;

				if(heatArray[j].h == phaseTransitions[i].t_stop)
					containsT_stop = true;
				else if(heatArray[j].h < phaseTransitions[i].t_stop)
					stop_index = j;
			}
			if(!containsT_start)
			{
				var objToPush = {};
				objToPush.t=phaseTransitions[i].t_start;
				objToPush.cp =(heatArray[start_index].cp + heatArray[start_index+1].cp)/2;
				heatArray.push(objToPush);				
			}
			if(!containsT_stop)
				heatArray.push({t: phaseTransitions[i].t_stop, 
								cp: (heatArray[stop_index].cp + heatArray[stop_index+1].cp)/2});			
			if(!containsT_start || !containsT_stop)
			{
				heatArray.sort(sortBy_t);
			}
		}
	}
}


function triangleFunction(x)
{
	return -x+10;
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
	switch(phaseTransitionConfig.function)
	{
	case 'triangle':
		calculateFunction = triangleFunction;
		a = 0;
		b = 10;
		break;
	default:
		calculateFunction = triangleFunction;
		a = 0;
		b = 10;
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

// TODO ------------------------------------------
function calculateEnthalpy(heatArray)
{
	var h0 = heatArray[0].h + (heatArray[0].t * heatArray[0].cp);
	heatArray[0].h = h0;
	for(var i=1; i< heatArray.length; i++)
	{
	
		var hi = h0 + (heatArray[i].cp * (heatArray[i-1].t + heatArray[i].t)/2);
		heatArray[i].h += hi;
		h0 = heatArray[i].h;
	}
	return heatArray;
}

function prepareOutput(heatArray)
{
	var output = {};
	output.t = [];
	output.h = [];
	for(var i=0; i< heatArray.length; i++)
	{
		output.t.push(heatArray[i].t);
		output.h.push(heatArray[i].h);
	}
	return output;
}

// main

function calculateEvent()
{
	var phaseTransitions = getInputSettings();
	var inputHeatData = getInputData();
	
	var heatArray = loadHeat(inputHeatData);
	applyPhaseTransitions(heatArray, phaseTransitions);

	for(var i=0; i< phaseTransitions.length; i++)
	{
		if(phaseTransitions[i].active)
		{
			addPhaseTransitionEnthalpyToHeatAray(heatArray, phaseTransitions[i]);
		}
	}

	calculateEnthalpy(heatArray);
	
	return prepareOutput(heatArray);

}

