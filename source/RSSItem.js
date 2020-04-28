enyo.kind({
  	name: "RSSItem",
  	kind: enyo.Control,
  	tag: "div",
  	style: "margin: 10px; min-height: 16px",

  	published: {
    	headline: "",
    	link: "",
    	description: ""
  	},

  	components: [
    	{ tag: "span", name: "headline", allowHtml: true, style: "font-size: 16px; font-weight:600;" },
    	{ tag: "span", name: "description", style: "font-size: 16px" }
  	],

  	create: function() {
    	this.inherited(arguments);
    	this.headlineChanged();
    	this.linkChanged();
    	this.descriptionChanged();
  	},

  	headlineChanged: function() {
    	this.$.headline.setAttribute("src", this.icon);
  	},

  	linkChanged: function() {
    	this.$.headline.setContent("<a href=" + this.link + " target='_blank'>" + this.headline + "</a>");
  	},

  	descriptionChanged: function() {
    	if (this.description)
    	{
    		this.$.description.setContent(" " + this.description);
    	}
	}
});