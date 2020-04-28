enyo.kind({
  	name: "YahooRSSFeed",  	
  	kind: enyo.Control,
  	layoutKind: "FittableRowsLayout",
  	classes: "onyx",
  	
  	published: { 
  		symbol: "",
    	type: "",
	},
	
	components: [
		{ name: "newsBlock", components: [
			{ tag: "hr" },
			{ name: "newsHeader", tag: "span", content: "News ", style: "font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; font-size: 18pt; padding-top: 20px; padding-bottom: 3px; padding-right: 20px; padding-left: 10px", ontap:"activateRSSDrawer" },
			{ kind:"onyx.Button", name: "RSSButton", content: "Hide Articles", classes: "onyx-blue", ontap:"activateRSSDrawer"},
			{ name: "RSSDrawer", kind: "onyx.Drawer", components: [
				{ tag: "div", name: "RSSItems", style: "border-style: solid; border-width: 2px; margin: 10px;" }
			]},
		]},
    ],
    
	activateRSSDrawer: function() {
		this.$.RSSDrawer.setOpen(!this.$.RSSDrawer.open);
		if (!this.$.RSSDrawer.open) 
		{
			this.$.RSSButton.setContent("Show Articles");
		}
		else
		{
			this.$.RSSButton.setContent("Hide Articles");
		}
	},
	
	addRSSItem: function(inResult) {
    	this.createComponent({
      		kind: RSSItem,
      		container: this.$.RSSItems,
      		headline: inResult.title,
      		link: inResult.link,
      		description: inResult.description
    	});
  	},
  	
  	create: function() {
    	this.inherited(arguments);
    	this.hide();
    	if (this.type == "headline")
    	{
    		this.$.newsHeader.setContent("Company News ");
    	}
    	else if (this.type == "industry")
    	{
    		this.$.newsHeader.setContent("Industry News ");
    	}
  	},
  	
  	getRSSFeed: function()
  	{
  		// set up enyo.AjaxProperties by sending them to the enyo.Ajax constructor
  		var x = new enyo.Ajax({url: "http://query.yahooapis.com/v1/public/yql?format=json"});
    	// send parameters the remote service using the 'go()' method
    	x.go({
        	q: "select title,description,link from rss where url='http://finance.yahoo.com/rss/" + this.type + "?s=" + this.symbol + "'"
    	});
    	// attach responders to the transaction object
    	x.response(this, function(inSender, inResponse) {
        	// extra information from response object
			if (!inResponse) return;
			this.$.RSSItems.destroyClientControls();
			if (inResponse.query.results && inResponse.query.results.item.title != "Yahoo! Finance: RSS feed not found")
			{
				enyo.forEach(inResponse.query.results.item, this.addRSSItem, this);
			}
			else
			{
				this.hide();
				return;
			}
			this.$.RSSItems.render();
			this.show();
    	});	
  	},
  	
  	symbolChanged: function() {
    	this.getRSSFeed();
	},
});