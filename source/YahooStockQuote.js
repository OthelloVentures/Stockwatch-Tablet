enyo.kind({
  	name: "YahooStockQuote",  	
  	kind: enyo.Control,
  	layoutKind: "FittableRowsLayout",
  	classes: "onyx",
  	
  	published: {
  		symbol: "",
	},
	
	components: [
    	{name: "quoteBlock", components: [
    		{kind: "onyx.Groupbox", style: "margin: 10px", components: [
				{style: "border-style: none", components: [
					{tag: "span", name: "companyName", style: "font-size: 22pt; padding-top: 12px; padding-bottom: 3px; margin-right: 5px"},
					{tag: "span", name: "stockSymbol", style: "font-size: 22pt; margin-right: 5px"},
					{tag: "span", name: "stockPrice"},
					{tag: "span", name: "stockChange"},
					{tag: "span", name: "stockExchange", style: "font-size: 12pt;"},
					
				]},
				{style: "border-style: none", components: [
					{tag: "span", name: "stockPreviousClose", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockOpen", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockBid", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockAsk", allowHtml: true, style: "font-size: 14pt;"},
					
				]},
				{style: "border-style: none", components: [
					{tag: "span", name: "stockDayRange", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stock52WeekRange", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockVolume", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockMarketCap", allowHtml: true, style: "font-size: 14pt;"},
					
				]},
				{style: "border-style: none", components: [
					{tag: "span", name: "stockPERatio", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockEPS", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},
					{tag: "span", name: "stockDividendYield", allowHtml: true, style: "font-size: 14pt; margin-right: 10px"},					
				]},
			]},
			{tag: "hr"},
		]},
    ],
      	
  	create: function() {
    	this.inherited(arguments);
    	this.hide();
    	this.quote = null;
  	},
  	
  	getQuote: function()
  	{
  		this.quote = null;
  		
    	// set up enyo.AjaxProperties by sending them to the enyo.Ajax constructor
		var x = new enyo.JsonpRequest({url: "http://stockcharts.com/j-ci/ci", cacheBust: false});
		// send parameters the remote service using the 'go()' method
		x.go({
			suggest: this.symbol,
			limit: 1
		});
		// attach responders to the transaction object
		x.response(this, "updateName");    	
    	
    	// set up enyo.AjaxProperties by sending them to the enyo.Ajax constructor
    	var y = new enyo.Ajax({url: "http://query.yahooapis.com/v1/public/yql?format=json"});
    	// send parameters the remote service using the 'go()' method
    	y.go({
        	q: "select * from csv where url='http://download.finance.yahoo.com/d/quotes.csv?s=" + this.symbol + "&f=nsl1c1xpobamwvj1erdyk5j6&e=.csv' and columns='name,symbol,price,change,market,close,open,bid,ask,dayRange,yearRange,volume,marketCap,eps,peRatio,dividend,yield,pcYearHigh,pcYearLow'"
    	});
    	// attach responders to the transaction object
    	y.response(this, "updateQuote");
  	}, 

	symbolChanged: function() {
    	this.getQuote();
    	this.show();
	},

	updateName: function(inSender, inResponse)
	{		
    	if (!inResponse || inResponse.companies == null || inResponse.companies.length < 1)
    	{
			if (this.quote != null && this.quote.name != null)
			{
				this.$.companyName.setContent(this.quote.name);
			}
			else
			{
				this.$.companyName.setContent("Unknown Company"); 
			}   		
    		return;
    	}
    	
    	var values = inResponse.companies;
		this.$.companyName.setContent(values[0].name);
	},

	updateQuote: function(inSender, inResponse)
	{		
		if (!inResponse || !inResponse.query.results == null) return;
		
		this.quote = inResponse.query.results.row;
		
		if (this.$.companyName.content == "Unknown Company")
		{
			this.$.companyName.setContent(this.quote.name);
		}
		this.$.stockSymbol.setContent("(" + this.quote.symbol + ") -");
		if (this.quote.change.slice(0,1) == "+")
		{
			this.$.stockPrice.setStyle("color: Green; font-size: 22pt; margin-right: 5px");
			this.$.stockChange.setStyle("color: Green; font-size: 22pt; margin-right: 5px");
		}
		else if (this.quote.change.slice(0,1) == "-")
		{
			this.$.stockPrice.setStyle("color: Red; font-size: 22pt; margin-right: 5px");
			this.$.stockChange.setStyle("color: Red; font-size: 22pt; margin-right: 5px");
		}
		else
		{
			this.$.stockPrice.setStyle("color: Black; font-size: 22pt; margin-right: 5px");
			this.$.stockChange.setStyle("color: Black; font-size: 22pt; margin-right: 5px");
		}
		this.$.stockPrice.setContent(this.quote.price);		
		this.$.stockChange.setContent("(" + this.quote.change + ")");
		this.$.stockExchange.setContent(this.quote.market);
		this.$.stockPreviousClose.setContent("<b>Previous Close: </b>" + this.quote.close);
		this.$.stockOpen.setContent("<b>Open: </b>" + this.quote.open);
		this.$.stockBid.setContent("<b>Bid: </b>" + this.quote.bid);
		this.$.stockAsk.setContent("<b>Ask: </b>" + this.quote.ask);
		this.$.stockDayRange.setContent("<b>Day's Range: </b>" + this.quote.dayRange);
		this.$.stock52WeekRange.setContent("<b>52 Week Range: </b>" + this.quote.yearRange);
		this.$.stockVolume.setContent("<b>Volume: </b>" + this.quote.volume);
		this.$.stockMarketCap.setContent("<b>Market Cap: </b>" + this.quote.marketCap);
		this.$.stockPERatio.setContent("<b>P/E Ratio: </b>" + this.quote.peRatio);
		this.$.stockEPS.setContent("<b>Earnings Per Share: </b>" + this.quote.eps);
		this.$.stockDividendYield.setContent("<b>Dividend Yield: </b>" + this.quote.dividend + " (" + this.quote.yield + "%)");
		if (this.quote.pcYearHigh.startsWith("-"))
		{
			this.quote.pcYearHigh = this.quote.pcYearHigh.slice(0,-1);
			this.quote.pcYearHigh = this.quote.pcYearHigh.slice(1);
			if (parseFloat(this.quote.pcYearHigh) <= 10)
			{
				this.owner.sendNotif("Stock is trading within 10% of its 52 week high", this.quote.symbol + " is trading " + this.quote.pcYearHigh + "% below its 52 week high.", true);
			}
		}
		else if (this.quote.pcYearHigh.startsWith("+"))
		{
			this.quote.pcYearHigh = this.quote.pcYearHigh.slice(0,-1);
			this.quote.pcYearHigh = this.quote.pcYearHigh.slice(1);
			this.owner.sendNotif("Stock is trading above its 52 week high", this.quote.symbol + " is trading " + this.quote.pcYearHigh + "% above its 52 week high.", true);
		}
		if (this.quote.pcYearLow.startsWith("+"))
		{
			this.quote.pcYearLow = this.quote.pcYearLow.slice(0,-1);
			this.quote.pcYearLow = this.quote.pcYearLow.slice(1);
			if (parseFloat(this.quote.pcYearLow) <= 10)
			{
				this.owner.sendNotif("Stock is trading within 10% of its 52 week low", this.quote.symbol + " is trading " + this.quote.pcYearLow + "% above its 52 week low.", true);
			}
		}
		else if (this.quote.pcYearHigh.startsWith("-"))
		{
			this.quote.pcYearLow = this.quote.pcYearLow.slice(0,-1);
			this.quote.pcYearLow = this.quote.pcYearLow.slice(1);
			this.owner.sendNotif("Stock is trading below its 52 week low", this.quote.symbol + " is trading " + this.quote.pcYearLow + "% below its 52 week low.", true);
		}
	}
});