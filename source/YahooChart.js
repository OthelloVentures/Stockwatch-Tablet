enyo.kind({
  	name: "YahooChart",
	kind: enyo.Control,
	tag: "div",
	style: "margin: 10px; min-height: 16px",

	published: {
		symbol: "",
		chartSize: "l"
	},

	components: [
    	{tag: "img", name: "stockChart", src: "", style: "display: block; margin-left: auto; margin-right: auto " },
    	{tag: "br"},
    	{kind: "onyx.Groupbox", components: [
			{name: "chartOptionsHeader", kind: "onyx.GroupboxHeader", ontap: "activateOptionsDrawer", components: [
				{content: "Chart Options", style: "display: inline-block;"},
				{name: "imgOptionsArrow", kind: "Image", src: "assets/arrow_expand.gif", style: "display: inline-block; float: right"},
			]},
		]},
		{name: "optionsDrawer", kind: "onyx.Drawer", components: [
			{kind: "onyx.Groupbox", components: [
				{style: "border-radius: 0 0 0 0;", components: [
					{tag: "span", style: "margin: 10px; font-weight: bold; font-size: 16px; vertical-align: middle; display: inline-block; border-style: none", content: "Chart Settings"},
					{tag: "span", style: "margin: 10px;", content: "Chart Range: "},
					{kind: "onyx.PickerDecorator", style: "display: inline-block; border-style: none;", components: [
						{},
						{name: "timespanPicker", kind: "onyx.Picker", onSelect: "timespanItemSelected", style: "min-width: 120px", components: [ 
							{name: "1d", content: "1 Day"},
							{name: "5d", content: "5 Days"},
							{name: "3m", content: "3 Months"},
							{name: "6m", content: "6 Months", active: true},
							{name: "1y", content: "1 Year"},
							{name: "2y", content: "2 Years"},
							{name: "5y", content: "5 Years"},
							{name: "my", content: "Maximum"}
						]}
					]},
					{tag: "span", style: "margin: 10px; display: inline-block; border-style: none", content: "Chart Type: "},
					{kind: "onyx.PickerDecorator", style: "display: inline-block; border-style: none", components: [
						{},
						{name: "chartTypePicker", kind: "onyx.Picker", onSelect: "chartTypeItemSelected", style: "min-width: 120px", components: [ 
							{name: "l", content: "Line", active: true},
							{name: "b", content: "Bar"},
							{name: "c", content: "Candlestick"}
						]}
					]},
					{tag: "span", style: "margin: 10px; display: inline-block; border-style: none", content: "Scaling: "},
					{kind:"onyx.ToggleButton", onChange:"scalingToggleChanged", style: "display: inline-block; border-style: none", value: true},
				]},
				{components: [
					{tag: "span", style: "margin: 10px; font-weight: bold; font-size: 16px; vertical-align: middle; display: inline-block; border-style: none", content: "Moving Averages"},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "50 Day"},
						{name: "fiftyDayMACheckbox", kind:"onyx.Checkbox", value: "m50,", onActivate: "processTechnicalIndicators", active: true},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "50 Day Exponential"},
						{name: "fiftyDayEMACheckbox", kind:"onyx.Checkbox", value: "e50,", onActivate:"processTechnicalIndicators"},					
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "200 Day"},
						{name: "twoHundredDayMACheckbox", kind:"onyx.Checkbox", value: "m200,", onActivate:"processTechnicalIndicators", active: true},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "200 Day Exponential"},
						{name: "twoHundredDayEMACheckbox", kind:"onyx.Checkbox", value: "e200,", onActivate:"processTechnicalIndicators"},
					]},
				]},
				{components: [
					{tag: "span", style: "margin: 10px; font-weight: bold; font-size: 16px; vertical-align: middle; display: inline-block; border-style: none", content: "Technical Indicators"},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Bollinger Bands"},
						{name: "bollingerCheckbox", kind:"onyx.Checkbox", value: "b,", onActivate:"processTechnicalIndicators", active: true},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "	Money Flow Index"},
						{name: "MFICheckbox", kind:"onyx.Checkbox", value: "f14,", onActivate:"processExtendedTechnicalIndicators"},
					]},				
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Moving-Average-Convergence-Divergence"},
						{name: "MACDCheckbox", kind:"onyx.Checkbox", value: "m26-12-9,", onActivate:"processExtendedTechnicalIndicators", active: true},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Parabolic Stop And Reverse"},
						{name: "parabolicSARCheckbox", kind:"onyx.Checkbox", value: "p,", onActivate:"processTechnicalIndicators"},
					]},
				]},
				{components: [
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Rate of Change"},
						{name: "ROCCheckbox", kind:"onyx.Checkbox", value: "p12,", onActivate:"processExtendedTechnicalIndicators"},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Relative Strength Index"},
						{name: "RSICheckbox", kind:"onyx.Checkbox", value: "r14,", onActivate:"processExtendedTechnicalIndicators"},
					]},				
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Splits"},
						{name: "splitsCheckbox", kind:"onyx.Checkbox", value: "s,", onActivate:"processTechnicalIndicators"},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Stochastic (Fast)"},
						{name: "fastStochasticCheckbox", kind:"onyx.Checkbox", value: "fs,", onActivate:"processExtendedTechnicalIndicators"},
					]},
				]},
				{components: [
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Stochastic (Slow)"},
						{name: "slowStochasticCheckbox", kind:"onyx.Checkbox", value: "ss,", onActivate:"processExtendedTechnicalIndicators"},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Volume"},
						{name: "volumeCheckbox", kind:"onyx.Checkbox", value: "v,", onActivate:"processTechnicalIndicators", active: true},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Volume with Moving Average"},
						{name: "VMACheckbox", kind:"onyx.Checkbox", value: "vm,", onActivate:"processExtendedTechnicalIndicators"},
					]},
					{kind: "onyx.InputDecorator", style: "display: inline-block; border-style: none", components: [
						{style: "margin: 10px;", content: "Williams Percent Range"},
						{name: "WRCheckbox", kind:"onyx.Checkbox", value: "w14,", onActivate:"processExtendedTechnicalIndicators"},
					]},
				]},
			]},
		]},
	],

	activateOptionsDrawer: function() {
		this.$.optionsDrawer.setOpen(!this.$.optionsDrawer.open);
		if (!this.$.optionsDrawer.open) 
		{
			this.$.chartOptionsHeader.setAttribute("style", "");
			this.$.imgOptionsArrow.setAttribute("src", "assets/arrow_expand.gif");
		}
		else
		{
			this.$.chartOptionsHeader.setAttribute("style", "border-radius: 4px 4px 0 0;");
			this.$.imgOptionsArrow.setAttribute("src", "assets/arrow_retract.gif");
		}
	},

  	create: function() {
    	this.inherited(arguments);
    	this.chartTimespan = "6m";
    	this.chartType = "l";
    	this.chartScaling = "on";
    	this.chartTechnicalIndicators = "m50,m200,v,b";
    	this.chartExtendedTechnicalIndicators = "macd";
    	this.activateOptionsDrawer();
    	this.hide();
	},
	
	chartSizeChanged: function() {
    	this.updateChart();
	},
		
	chartTypeItemSelected: function(inSender, inEvent) {
    	this.chartType = this.$.chartTypePicker.selected.getName();
    	this.updateChart();
	},
	
	processTechnicalIndicators: function() {
		var technicalIndicators = "";
		if (this.$.fiftyDayMACheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.fiftyDayMACheckbox.value;
		}
		if (this.$.twoHundredDayMACheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.twoHundredDayMACheckbox.value;
		}
		if (this.$.fiftyDayEMACheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.fiftyDayEMACheckbox.value;
		}
		if (this.$.twoHundredDayEMACheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.twoHundredDayEMACheckbox.value;
		}
		if (this.$.bollingerCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.bollingerCheckbox.value;
		}
		if (this.$.parabolicSARCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.parabolicSARCheckbox.value;
		}
		if (this.$.splitsCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.splitsCheckbox.value;
		}
		if (this.$.volumeCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.volumeCheckbox.value;
		}
		this.chartTechnicalIndicators = technicalIndicators.slice(0,-1);
		this.updateChart();
	},
	
	processExtendedTechnicalIndicators: function() {
		var technicalIndicators = "";
		if (this.$.MACDCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.MACDCheckbox.value;
		}
		if (this.$.MFICheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.MFICheckbox.value;
		}
		if (this.$.ROCCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.ROCCheckbox.value;
		}
		if (this.$.RSICheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.RSICheckbox.value;
		}
		if (this.$.slowStochasticCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.slowStochasticCheckbox.value;
		}
		if (this.$.fastStochasticCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.fastStochasticCheckbox.value;
		}
		if (this.$.VMACheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.VMACheckbox.value;
		}
		if (this.$.WRCheckbox.checked)
		{
			technicalIndicators = technicalIndicators + this.$.WRCheckbox.value;
		}
		this.chartExtendedTechnicalIndicators = technicalIndicators.slice(0,-1);
		this.updateChart();
	},
	
	scalingToggleChanged: function(inSender, inEvent) {
		if (inSender.getValue() == true)
		{
			this.chartScaling = "on";
		}
		else
		{
			this.chartScaling = "off";
		}
		this.updateChart();
	},
	
	symbolChanged: function() {
    	this.updateChart();
    	this.show();
	},
	
	timespanItemSelected: function(inSender, inEvent) {
    	this.chartTimespan = this.$.timespanPicker.selected.getName();
    	this.updateChart();
	},
  
	updateChart: function() {
		this.$.stockChart.setAttribute("src", "http://chart.finance.yahoo.com/z?s=" + this.symbol + "&t=" + this.chartTimespan + "&q=" + this.chartType + "&l=" + this.chartScaling + "&z=" + this.chartSize + "&p=" + this.chartTechnicalIndicators + "&a=" + this.chartExtendedTechnicalIndicators);
	}
});