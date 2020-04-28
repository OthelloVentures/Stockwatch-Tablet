enyo.kind({
  	name: "YahooFinanceTool",
  	kind: enyo.Control,
  	layoutKind: "FittableRowsLayout",
  	classes: "onyx",
  	
  	published: {
  		symbolChanged: true,
  		ready: true
	},
  	
  	events: { 
	},
	
	components: [
		{kind: "onyx.Toolbar", components: [
      		{content: "Othello StockTracker", style: "padding-right: 30px"},
      		{name: "stockSymbolACID", kind: "StockSymbolAutoCompleteInputDecorator", onInputChanged:"ACIDInputChanged", onkeydown: "searchOnEnter",  components: [
      		//{kind: "onyx.InputDecorator", components: [
        		{kind: "onyx.Input", name: "searchTerm", style: "width: 500px", placeholder: "Stock Symbol"},
        		{kind: "Image", src: "assets/search-input-search.png", ontap: "searchButtonClick"}
      		]},
      		{kind:"onyx.Button", name: "searchButton", content: "Search", classes: "onyx-blue", ontap:"searchButtonClick"},
    	]},
  		{kind: "enyo.Scroller", fit: true, components: [
			{kind: "YahooStockQuote", name: "stockQuote", symbol: ""},
			{kind: "YahooChart", name: "stockChart", symbol: ""},
			{kind: "YahooRSSFeed", name: "companyRSSFeed", symbol: "", type: "headline"},
			{style: "margin-bottom: 10px", components: [
				{kind: "YahooRSSFeed", name: "industryRSSFeed", symbol: "", type: "industry"},
			]},
  		]},
  		{kind: "Notification", name: "notif"}
  	],

	ACIDInputChanged:function(source, event) {
		if(event.value !== "") {
			this.ready = true;
			this.$.stockSymbolACID.updateAutoComplete(escape(event.value));
		}
		else
		{
			this.$.stockSymbolACID.closeMenu();
		}
	},

  	constructor: function(symbol, alert) {
        // Call the constructor inherited from Object
        this.inherited(arguments);
    	this.symbol = symbol;
    	this.alert = alert;
    	this.refreshTimer = null;
  	},

  	create: function() {
    	this.inherited(arguments);
    	
    	if (this.symbol)
    	{
    		this.$.searchTerm.setValue(this.symbol);
    		this.searchButtonClick();
    	}
    	
    	if (this.alert)
    	{
    		if (this.alert > 7)
    		{
    			this.alert = this.alert - 8;
    			this.sendNotif("Stop Loss Hit", "This stock has hit its Stop Loss", true);
    		}
    		if (this.alert > 3)
    		{
    			this.alert = this.alert - 4;
    			this.sendNotif("Sell Target Hit", "This stock has hit its Sell Target", true);
    		}
    		if (this.alert > 1)
    		{
    			this.alert = this.alert - 2;
    			this.sendNotif("Buy Target Hit", "This stock has hit its Buy Target", true);
    		}
    		if (this.alert > 0)
    		{
    			this.alert = this.alert - 1;
    			this.sendNotif("Trailing Stop Loss Hit", "This stock has hit its Trailing Stop Loss", true);
    		}
    	}
    	
    	// Deal with the window sizing on program load 
    	if (window.innerWidth >= 900)
  		{
  			this.$.searchTerm.setStyle("width: 500px");
  			this.$.stockChart.setChartSize("l");
  		}
  		else if (window.innerWidth <= 500)
  		{
  			this.$.searchTerm.setStyle("width: 100px");
  			this.$.stockChart.setChartSize("s");
  		}
  		else
  		{
  			this.$.searchTerm.setStyle("width: " + (500 - (900 - window.innerWidth)) + "px");
  			this.$.stockChart.setChartSize("m");
  		}
	},
  	
  	resizeHandler: function() {
  		// don't forget to call the default implementation
  		this.inherited(arguments);
  		// do my resizing tasks
  		if (window.innerWidth >= 900)
  		{
  			this.$.searchTerm.setStyle("width: 500px");
  			this.$.stockChart.setChartSize("l");
  		}
  		else if (window.innerWidth <= 500)
  		{
  			this.$.searchTerm.setStyle("width: 100px");
  			this.$.stockChart.setChartSize("s");
  		}
  		else
  		{
  			this.$.searchTerm.setStyle("width: " + (500 - (900 - window.innerWidth)) + "px");
  			this.$.stockChart.setChartSize("m");
  		}
	},
  	
  	searchButtonClick: function() {
		if (this.$.searchTerm.getValue() == "") return;
		clearInterval(this.refreshTimer);
		this.symbolChanged = true;
		this.ready = false;
		this.symbol = escape(this.$.searchTerm.getValue());
		this.$.stockQuote.setSymbol(this.symbol);
		this.$.stockChart.setSymbol(this.symbol);
		this.$.companyRSSFeed.setSymbol(this.symbol);
		this.$.industryRSSFeed.setSymbol(this.symbol);
		this.refreshTimer = setInterval(enyo.bind(this, "updateResults"), 30000);
		this.$.stockSymbolACID.closeMenu();
  	},
  	
	searchOnEnter: function(inSender, inEvent) {
  		if (inEvent.keyCode === 13) {
    		this.searchButtonClick();
    		return true;
  		}
	},
	
	sendNotif: function(title, message, stay, duration) {
		if (this.symbolChanged) {
			this.$.notif.sendNotification({
				title: title,
				message: message,
				icon: "assets/infoIcon.png",
				theme: "notification.Badged",
				stay: stay,
				duration: duration
			});
		}
	},
	
	updateResults: function() {
		this.symbolChanged = false;
		this.$.stockQuote.symbolChanged();
		this.$.stockChart.symbolChanged();
		this.$.companyRSSFeed.symbolChanged();
		this.$.industryRSSFeed.symbolChanged();
	}
});