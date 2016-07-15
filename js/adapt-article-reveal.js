/*
* adapt-contrib-article-reveal
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Stuart Nicholls <stuart@stuartnicholls.com>, Mohammed Salamat Ali <Mohammed.SalamatAli@kineo.com>
*/
define(function(require) {

var Adapt = require('coreJS/adapt');
var Backbone = require('backbone');

var ArticleRevealView = Backbone.View.extend({

    className: "article-reveal",

    initialize: function () {
        this.render();
        this.setup();
        this.listenTo(Adapt, "remove", this.remove);
        Adapt.on("page:scrollTo", _.bind(this.onProgressBarScrollTo, this));
    },

    events: {
        "click .article-reveal-open-button":"revealArticle",
        "click .article-reveal-close-button":"closeArticle"
    },

    render: function () {
        var data = this.model.toJSON();
        var template = Handlebars.templates["adapt-article-reveal"];
        $(this.el).html(template(data)).prependTo('.' + this.model.get("_id"));
        var incomplete = this.model.findDescendants("components").where({_isComplete:false});
        if (incomplete.length === 0){
            this.$(".article-reveal-open-button").addClass('visited');
            this.$(".article-reveal-open-button").addClass('show');
        }
        this.$(".article-reveal-close-button").addClass('article-reveal-hidden');
        return this;
    },
	
	setup: function(event) {
        if (event) event.preventDefault();
        //prevent drag on buttons
        this.preventDrag();

        //hide articles
        var $articleInner = $("." + this.model.get("_id") + " > .article-inner ");

        var incomplete = this.model.findDescendants("components").where({_isComplete:false});
        if (incomplete.length > 0){
            $articleInner.css({display:"none"});

            //set components to isVisible false
            this.toggleisVisible( false );
        }
        this.render();
    },
    
    closeArticle: function(event) {
        if (event) event.preventDefault();

        // Change text
        this.$('.article-body-inner').html(this.model.get('_articleReveal').bodyOpen).a11y_text();
        this.$('.article-instruction-inner').html(this.model.get('_articleReveal').instructionOpen).a11y_text();

        this.$(".article-reveal-open-button").removeClass('article-reveal-hidden');

        this.$(".article-reveal-close-button").addClass('article-reveal-hidden');

        //..and set components to isVisible false
        this.$el.siblings(".article-inner").velocity("slideUp", 600, _.bind(function() {
            this.toggleisVisible(false);
        }, this));
        this.$el.velocity("scroll", {
            duration: 600,
            offset: -$(".navigation").outerHeight()
        });

        this.$(".article-reveal-open-button").focus();
    },

    revealArticle: function(event) {
        if (event) event.preventDefault();
        if(this.$el.closest(".article").hasClass("locked")) return; // in conjunction with pageLocking

        // Change text
        this.$('.article-body-inner').html(this.model.get('_articleReveal').bodyClose).a11y_text();
        this.$('.article-instruction-inner').html(this.model.get('_articleReveal').instructionClose).a11y_text();

        //set article visited and article showing in css
        this.$(".article-reveal-open-button").addClass('visited');

        this.$(".article-reveal-open-button").addClass('article-reveal-hidden');

        this.$(".article-reveal-close-button").removeClass('article-reveal-hidden');

        //animate reveal 
        Adapt.trigger("article:revealing", this);
        this.$el.siblings(".article-inner").velocity("slideDown", 800, _.bind(function() {
            Adapt.trigger("article:revealed", this);
            // Call window resize to force components to rerender -
            // fixes components that depend on being visible for setting up layout
            $(window).resize();
        }, this));
        this.$el.velocity("scroll", {
            delay: 400,
            duration: 800,
            offset: this.$el.height() - $(".navigation").outerHeight()
        });

        //set components to isVisible true
        this.toggleisVisible(true);
    },

    toggleisVisible: function(view) {
        var allComponents = this.model.findDescendants('components');
        allComponents.each(function(component) {
            component.setLocking("_isVisible", false);
            component.set('_isVisible', view, {
                pluginName:"_articleReveal"
            });
        });
    },
    
    preventDrag: function() {
        $(".article-reveal-open-button").on("dragstart", function(event) { 
            event.preventDefault(); 
        });
        $(".article-reveal-close-button").on("dragstart", function(event) { 
            event.preventDefault(); 
        });
    },

    // Handles the Adapt page scrollTo event
    onProgressBarScrollTo: function(componentSelector) { 
    	if (typeof componentSelector == "object") componentSelector = componentSelector.selector;
        var allComponents = this.model.findDescendants('components');
        var componentID = componentSelector;
        if(componentID.indexOf('.') === 0) componentID = componentID.slice(1);
        allComponents.each(_.bind(function(component){
            if(component.get('_id') === componentID && !component.get('_isVisible')){
                this.revealComponent(componentSelector);
                return;
            }
        }, this));
    },

    revealComponent: function(componentSelector) {
        this.$(".article-reveal-open-button").addClass('visited');
        this.$(".article-reveal-open-button").addClass('show');
        
        this.toggleisVisible(true);
        $("." + this.model.get("_id") + " > .article-inner ").slideDown(0);
        this.$(".article-reveal-close-button").fadeIn(1);
        $(window).scrollTo($(componentSelector), {
            offset:{
                top:-$('.navigation').height()
            }
        }).resize();
    }

});

Adapt.on('articleView:postRender', function(view) {
    if (view.model.get("_articleReveal")) {
        new ArticleRevealView({
            model:view.model
        });
    }
});

});






