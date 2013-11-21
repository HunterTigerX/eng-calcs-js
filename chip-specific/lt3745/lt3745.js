//
// @file 		lt3745.js
// @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.cladlabs.com)
// @edited 		n/a
// @date 		2013/11/01
// @brief 		Binding/calculating code for the LT3745 calculator. PHP/HTML code is in lt3745.php.
// @details
//				See the README in the root dir for more info.

function AppViewModel() {

	// Adding the lt3745 "namespace" for LT3745 calculator, so that multiple calculators can work
	// on the same page. Use the data-bind="with: lt3745" command within the HTML to access the child variables.
	this.lt3745 = new function()
	{

		//============= Vload ============//
		
		this.loadVoltage = new cc.input(
			this,
			function() { return true; },
			[ new unit('V', 1.0) ],
			0
		);
				
		this.loadVoltage.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		// Add validator
		this.loadVoltage.AddCustomValidator(
			this,
			'Voltage cannot be less than 0.',
			function(app){
				if(app.loadVoltage.val() < 0)
					return false;
				return true;
			},
			cc.severityEnum.warning
		);
		
		//============== Vbuck,out ===========//
			
		this.vBuckOut = new cc.output(
			this,
			function() 
			{
				return this.loadVoltage.val() + 0.8;
			}, 
			function() { return true; },
			[ new unit('V', 1.0) ],
			0
		);
		
		// Add validator
		//this.vBuckOut.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//=============== Vin(min) ===============//
			
		this.vInMin = new cc.output(
			this,
			function() 
			{
				return parseFloat(this.vBuckOut.val()) + 2.1;
			}, 
			function()
			{
				return true;
			},
			[ new unit('V', 1.0) ],
			0);
		
		//================= Vin(max) ================//

		this.vInMax = new cc.input(
			this,
			function()
			{
				return true;
			},
			[ new unit('V', 1.0) ],
			0);
		
		this.vInMax.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//========== Rfb1 =============//
		
		this.rfb1 = new cc.input(
			this,
			function() { return true; },
			[ 
				new unit('\u2126', 1.0),
				new unit('k\u2126', 1000.0) 
			],
			1
		);
		
		this.rfb1.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//============== Rfb2 ==============//
			
		this.rfb2 = new cc.output(
			this,
			function() 
			{
				return (this.rfb1.val()*(this.vBuckOut.val()/1.205 - 1));
			},
			function()
			{
				return true;
			},
			[ 
				new unit('\u2126', 1.0), 
				new unit('k\u2126', 1000.0)
			],
			1);
			
		//=============== Iout(max) =================//
		
		this.iOutMax = new cc.input(
			this,
			function() { return true; },
			[
				new unit('mA', 0.001),
				new unit('A', 1.0)
			],
			0
		);
		
		this.iOutMax.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//=========== Rsense ============//
		
		// Rsense = 35mV/Iout(max)
		this.rSense = new cc.output(
			this,
			function() 
			{	
				return (0.035/this.iOutMax.val());
			}, 
			function() { return true; },
			[
				new unit('m\u2126', 0.001),
				new unit('\u2126', 1.0)
			],
			0
		);
			
		//======= Prsense =========//
		
		// Prsense = Iout(max)^2*Rsense
		this.prsense = new cc.output(
			this,
			function() 
			{			
				var iOutMax = this.iOutMax.val();
				var rSense = this.rSense.val();
				
				return (Math.pow(iOutMax, 2)*rSense);
			},
			function() { return this; },
			[
				new unit('mW', 0.001),
				new unit('W', 1)
			],
			0
		);
			
		//================ iLedPinNom ================//
			
		this.iLedPinNom = new cc.input(
			this,
			function() { return true; },
			[
				new unit('mA', 0.001),
				new unit('A', 1.0),
			],
			0
		);
		
		this.iLedPinNom.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//======= Riset =========//

		// Riset = 2500*(1.205/Iled-pin(nom))
		this.riSet = new cc.output(
			this,
			function() 
			{
				var iLedPinNom = this.iLedPinNom.val();
				
				return (2500*(1.205/iLedPinNom));
			},
			function() { return true; },
			[
				new unit('\u2126', 1.0),
				new unit('k\u2126', 1000.0)
			],
			1
		);
			
		//============= Vd,f =============//
			
		this.vdf = new cc.input(
			this,
			function() { return true; },
			[
				new unit('V', 1.0)
			],
			0
		);
		
		this.vdf.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//======= Dmin =========//
		
		// Dmin = (Vout(max) + Vd,f) / (Vin(max) + Vd,f)
		this.dMin = new cc.output(
			this,
			function() 
			{		
				var vBuckOut = this.vBuckOut.val();
				var vdf = this.vdf.val();
				var vInMax = this.vInMax.val();
				
				return ((vBuckOut + vdf) / (vInMax + vdf));
			}, 
			function() { return true; },
			[
				new unit('%', 1.0),
			],
			0
		);
			
		//======= Dmax =========//
		
		// Dmax = (Vout(max) + Vd,f) / (Vin(min) + Vd,f)
		this.dMax = new cc.output(
			this,
			function() 
			{			
				var vBuckOut = this.vBuckOut.val();
				var vdf = this.vdf.val();
				var vInMin = this.vInMin.val();
				
				return ((vBuckOut + vdf) / (vInMin + vdf));
			}, 
			function() { return true; },
			[
				new unit('%', 1.0)
			],
			0
		);
		
		//================ ton(min)==============//
		
		this.tOnMin = new cc.input(
			this,
			function() { return true; },
			[
				new unit('ns', 0.000000001),
				new unit('us', 0.000001)
			],
			0
		);
		
		this.tOnMin.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//================ toff(min) ============//
		
		this.tOffMin = new cc.input(
			this,
			function () { return true; },
			[
				new unit('ns', 0.000000001),
				new unit('us', 0.000001)
			],
			0
		);
		
		this.tOffMin.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//================ fsw(max) ==============//
		
		// fsw(max) = min( Dmin/ton(min) , (1 - Dmax)/toff(min) )
		this.fSwMax = new cc.output(
			this,
			function() 
			{			
				var dMin = this.dMin.val();
				var tOnMin = this.tOnMin.val();
				var dMax = this.dMax.val();
				var tOffMin = this.tOffMin.val();
				
				return (Math.min(dMin/tOnMin, (1.0 - dMax)/tOffMin));
			}, 
			function() { return true; },
			[
				new unit('kHz', 1000.0),
			],
			0
		);
		
		//================ fsw(act) ============//
		
		this.fSwAct = new cc.input(
			this,
			function(){
				return true;
			},
			[ new unit('kHz', 1000.0) ],
			0);
		
		this.fSwAct.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//================ fugf ==============//
		
		// fugf = fsw(act)/10
		this.fugf = new cc.output(
			this,
			function() 
			{			
				var fSwAct = this.fSwAct.val();
				return (fSwAct/10.0);
			}, 
			function() { return true; },
			[
				new unit('kHz', 1000.0)
			],
			0
		);
			
		//================ Cout(min) ==============//
		
		// Cout(min) = max( 0.25/(Rsense*fugf) , 1.5/(Rsense*Vbuck,out*fugf) )
		this.cOutMin = new cc.output(
			this,
			function() 
			{
				var rSense = this.rSense.val();
				var fugf = this.fugf.val();
				var vBuckOut = this.vBuckOut.val();
				
				return (Math.max( 0.25/(rSense*fugf), 1.5/(vBuckOut*rSense*fugf)));
			}, 
			function() { return true; },
			[
				new unit('uF', 0.000001),
			],
			0
		);
		
		//================ Il(delta) ============//
		
		this.iLDelta = new cc.input(
			this,
			function() { return true; },
			[
				new unit('%', 0.01)
			],
			0
		);
		
		this.iLDelta.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//================ L(min) ==============//
		
		// Lmin = [ (Vbuck,out + Vd,f) / (Vin(max) + Vd,f) ] * [ (Vin(max) - Vbuck,out) / (fsw(act)*Il(delta)) ]
		this.lMin = new cc.output(
			this,
			function() 
			{
				var vBuckOut = this.vBuckOut.val();
				var vdf = this.vdf.val();
				var vInMax = this.vInMax.val();
				var fSwAct = this.fSwAct.val();
				var iLDelta = this.iLDelta.val();
				
				return ( ((vBuckOut + vdf)/(vInMax + vdf))*((vInMax - vBuckOut)/(fSwAct*iLDelta)));
			}, 
			function() { return true; },
			[
				new unit('uH', 0.000001),
			],
			0
		);
			
		//================ Vin(ripple) ============//
		
		this.vInRipple = new cc.input(
			this,
			function() { return true; },
			[
				new unit('mV', 0.001)
			],
			0
		);
		
		this.vInRipple.AddValidator(cc.validatorEnum.IS_NUMBER, cc.severityEnum.error);
		
		//================ Cin(min) ==============//
		
		// Cin(min) = (Dmax*Iout(max)) / (Vin,ripple*fsw(act))
		this.cInMin = new cc.output(
			this,
			function() 
			{
				var dMax = this.dMax.val();
				var iOutMax = this.iOutMax.val();
				var vInRipple = this.vInRipple.val();
				var fSwAct = this.fSwAct.val();
				
				return ( (dMax*iOutMax)/(vInRipple*fSwAct) );
			}, 
			function() { return true; },
			[
				new unit('uF', 0.000001),
			],
			0
		);
	}
}

// Start-up function
jQuery(document).ready(
	function StartUp()
	{	  		
		var app = new AppViewModel();
		// Activates knockout.js		
		ko.applyBindings(app);	
	}
);
