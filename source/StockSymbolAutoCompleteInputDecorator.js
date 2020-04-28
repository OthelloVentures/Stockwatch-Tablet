// requires enyo v2 and onyx
enyo.kind({
    name: "StockSymbolAutoCompleteInputDecorator",
    kind: "onyx.InputDecorator",
    handlers: {
        oninput: "input",
        onSelect: "itemSelected",
    },
    
    published: {
        values: "",
        delay: 200,
        //* private ... needed to support Menu ...
        active: false
    },
    
    events: {
        onInputChanged: "",
        onValueSelected: ""
    },
    
    components:[
        {name: "popup", kind: "onyx.Menu", floating: true, maxHeight: 500}
    ],
    
    closeMenu: function() {
    	this.$.popup.requestHide();
    },
	
	fireInputChanged: function() {
        this.doInputChanged({value: this.inputField.getValue()});
    },
    
    input: function(source, event) {
        // cache input instance. means we only support a single input but that's probably okay.
        // works around a bug where originator is Menu rather than Input
        this.inputField = this.inputField || event.originator;
        enyo.job(null, enyo.bind(this, "fireInputChanged"), this.delay);
    },
    
    itemSelected: function(source, event) {
        this.inputField.setValue(event.originator.value);
        this.doValueSelected({ value: event.content });
        //this is ugly and kludgy and too closely coupled. If I find a better way of doing it, I'll fix it then.
        this.owner.searchButtonClick();
    },
	
	refreshAutoComplete: function(inSender, inResponse) {
    	if (!inResponse || inResponse.companies == null) return;
    	if (!this.owner.getReady())
    	{
    		return;
    	}
    	var values = inResponse.companies;
    	var s = [];
    	if (values.length == undefined)
    	{
    		s.push(values);
    	}
		else
		{
			for (var i=0;i<values.length;i++)
			{
				if (!values[i].exchange.startsWith("BATS"))
				{
					s.push(values[i]);
				}
			}
		}
    	this.setValues(s);
  	},
    
    updateAutoComplete: function(symbol) {
    	// set up enyo.AjaxProperties by sending them to the enyo.Ajax constructor
		var x = new enyo.JsonpRequest({url: "http://stockcharts.com/j-ci/ci", cacheBust: false});
		// send parameters the remote service using the 'go()' method
		x.go({
			suggest: symbol,
			limit: 10
		});
		// attach responders to the transaction object
		x.response(this, "refreshAutoComplete");
    },
    
    valuesChanged: function() {
        if (!this.values || this.values.length === 0) {
            this.waterfall("onRequestHideMenu", {activator: this});
            return;
        }

        this.$.popup.destroyClientControls();
        var c = [];
        for (var i = 0; i < this.values.length; i++) {
            c.push({value: this.values[i].symbol,
            	components:[
            		// ugly, but it works. the table structure handles overflow nicely.
            		{allowHtml: true, content: "<table><tr><td style='width: 90px'>" + this.values[i].symbol + "</td><td style='width: 340px'>" + this.values[i].name + "</td><td style='width: 70px'>" + this.values[i].exchange + "</td></tr></table>"}
            	]
            });
        }
        this.$.popup.createComponents(c);
        this.$.popup.render();

        this.waterfall("onRequestShowMenu", {activator: this});
    },
});