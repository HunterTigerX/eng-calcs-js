//
// @file 		standard-resistance-finder.js
// @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.cladlabs.com)
// @edited 		n/a
// @date 		2013/09/17
// @brief 		Given an input resistance, finds the closest resistance in a specified series.
// @details
//				See the README in the root dir for more info.

// Debug flag. Set to true to print debug information, otherwise false.
var DEBUG = false;

// E12 resistance array
var e12 = new Array(1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10.0); 

// E24 resistance array
var e24 = new Array(1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10.0);

// Get a variable for jQuery
// var j = jQuery.noConflict();
window.onload = function() 
	{
		if(!window.jQuery)
		{
			Log('jQuery not already present, loading jQuery...');
		   var script = document.createElement('script');
		   script.type = "text/javascript";
		   script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js";
		   document.getElementsByTagName('head')[0].appendChild(script);
		}
		else
		{
			Log('jQuery already present.');
		}
		
		// Activates knockout.js
		ko.applyBindings(new AppViewModel());	
	}

var resUnit = function(name, multiplier) {
        this.name = name;
        this.multiplier = multiplier;
    };
	
function AppViewModel() {
    this.desiredRes = ko.observable();
	
	this.desiredResUnits = ko.observableArray([
		new resUnit('m\u2126', 0.001),
		new resUnit('\u2126', 1.0),
		new resUnit('k\u2126', 1000.0)
	]);
	
	this.selectedResUnit = ko.observable();
	
	this.series = ko.observable("e12");
	
	this.actualRes = ko.computed(
		function() 
		{
			Log('Calculating...');
			
			// Quit if units have not been initialised
			if(this.selectedResUnit() === undefined)
			{
				return;
			}
			
			Log('Val = ' + this.selectedResUnit().multiplier);
			
			// Get desired resistance  
			var desRes = parseFloat(this.desiredRes())*parseFloat(this.selectedResUnit().multiplier);
		 
			var selectedRange = new Array();
			
			// Find out what resistance series was selected
			if(this.series() == 'e12')     
			{
				Log('E12 range selected.');
				selectedRange = e12;
			}
			else if(this.series() == 'e24')
			{
				Log('E24 range selected.');
				selectedRange = e24;
			}
			else if(this.series() == 'e48')
			{
				Log('E48 range selected.');
				selectedRange = BuildResArray(48);
			}
			else if(this.series() == 'e96')
			{
				Log('E96 range selected.');
				selectedRange = BuildResArray(96);
			}
			else if(this.series() == 'e192')
			{
				Log('E192 range selected.');
				selectedRange = BuildResArray(192);
			}

			var order = FindOrder(desRes);
			var scaledDesRes = ScaleWrtOrder(desRes, order);
			Log('Scaled resistance = ' + scaledDesRes);
			var closestMatch = FindClosestMatch(scaledDesRes, selectedRange);
			Log(closestMatch);
			Log(closestMatch.val*Math.pow(10, order));
			
			// Update percentage error
			this.percDiff(Math.round(closestMatch.diff*100)/100); 
			
			// Return the actual resistance
			return (closestMatch.val*Math.pow(10, order)) / this.selectedResUnit().multiplier;
        }, 
		this);
		
	this.actualResUnits = ko.observable();
	this.percDiff = ko.observable();
}

function BuildResArray(numElements)
{
	array = new Array();
	// Generate array elements
	for(i = 0; i < numElements; i++)
	{
		array[i] = (Math.pow(10, i/numElements)).toFixed(2);
	}
	return array;
}

// Finds the order of magnitude of a given input variable
// if var in range 1-10, order = 0, if var in range 10-100, order = 1, e.t.c
function FindOrder(desRes)
{
	Log('Desired resistance = ' + desRes);
	// Find the order of magnitude by using log()
	// (e.g. 1 = between 1-10, 2 = between 10-100, 3 - between 100-1000, e.t.c)
	var order = Log10(desRes);
	Log('Order of magnitude = ' + order);
	order = Math.floor(order);
	Log('Floored order of magnitude = ' + order);
	
	return order;
}

function ScaleWrtOrder(desRes, order)
{
	// Scale value so it is between 1-10
	return desRes/Math.pow(10, order);
}

// Function calculates the base-10 log of the given input
function Log10(val)
{
	// Use rule log10(x) = ln(x)/ln(10)
	return Math.log(val) / Math.LN10;
}

// Finds the closest array entry to the provided value
// For computational efficiency, this function
// assumes array values are sorted from smallest to highest
function FindClosestMatch(val, array)
{
	var i = 0;
	while(val > array[i])
	{
		i++;
	} 
	Log('Stopped when i = ' + i);
	Log('Closest lower value = ' + array[i-1]);
	Log('Closest higher value = ' + array[i]);
	
	var lowerPercDiff = ((val - array[i-1])/array[i-1])*100.0;
	Log('Lower percentage diff = ' + lowerPercDiff);
	var higherPercDiff = ((val - array[i])/array[i])*100.0;
	Log('Higher percentage diff = ' + higherPercDiff);
	
	if(Math.abs(lowerPercDiff) < Math.abs(higherPercDiff))
		return {
			val: array[i-1],
			diff: lowerPercDiff
		};
	else
		return {
			val: array[i],
			diff: higherPercDiff
		};
}

// Logs error messages
function Log(msg)
{
	// Only print if DEBUG variable has been set to true
	if(DEBUG == true)
		console.log(msg);
}