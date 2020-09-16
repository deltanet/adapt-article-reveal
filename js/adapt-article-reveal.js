define([
  'core/js/adapt'
], function(Adapt) {

  var ArticleRevealView = Backbone.View.extend({

    className: "article-reveal",

    initialize: function() {
      if (this.model.get('_articleReveal') && this.model.get('_articleReveal')._isEnabled) {
        this.render();
        this.setup();
        this.listenTo(Adapt, "remove", this.remove);
        Adapt.on("page:scrollTo", _.bind(this.onProgressBarScrollTo, this));
      }
    },

    events: {
      "click .js-open-button": "revealArticle",
      "click .js-close-button": "closeArticle"
    },

    render: function() {
      var data = this.model.toJSON();
      var template = Handlebars.templates["adapt-article-reveal"];
      $(this.el).html(template(data)).prependTo('.' + this.model.get("_id"));
      var incomplete = this.model.findDescendantModels("components", {
        where: {
          _isComplete: false
        }
      });
      if (incomplete.length === 0) {
        this.$(".article-reveal__open-button").addClass('is-visited');
        this.$(".article-reveal__open-button").addClass('show');
      }
      this.$(".article-reveal__close-button").addClass('article-reveal__hidden');
      return this;
    },

    setup: function(event) {
      if (event) event.preventDefault();
      //prevent drag on buttons
      this.preventDrag();

      //hide articles
      var $articleInner = $("." + this.model.get("_id") + " > .article__inner ");

      var incomplete = this.model.findDescendantModels("components", {
        where: {
          _isComplete: false
        }
      });
      if (incomplete.length > 0) {
        $articleInner.css({
          display: "none"
        });

        //set components to isVisible false
        this.toggleisVisible(false);
      }
      this.render();
    },

    closeArticle: function(event) {
      if (event) event.preventDefault();

      // Change text
      this.$('.article__body-inner').html(this.model.get('_articleReveal').bodyOpen);
      this.$('.article__instruction-inner').html(this.model.get('_articleReveal').instructionOpen);

      this.$(".article-reveal__open-button").removeClass('article-reveal__hidden');

      this.$(".article-reveal__close-button").addClass('article-reveal__hidden');

      //..and set components to isVisible false
      this.$el.siblings(".article__inner").velocity("slideUp", 600, _.bind(function() {
        this.toggleisVisible(false);
      }, this));
      this.$el.velocity("scroll", {
        duration: 600,
        offset: -$(".navigation").outerHeight()
      });

      this.$(".article-reveal__open-button").focus();
    },

    revealArticle: function(event) {
      if (event) event.preventDefault();
      if (this.$el.closest(".article").hasClass("locked")) return; // in conjunction with pageLocking

      // Change text
      this.$('.article__body-inner').html(this.model.get('_articleReveal').bodyClose);
      this.$('.article__instruction-inner').html(this.model.get('_articleReveal').instructionClose);

      //set article visited and article showing in css
      this.$(".article-reveal__open-button").addClass('is-visited');

      this.$(".article-reveal__open-button").addClass('article-reveal__hidden');

      this.$(".article-reveal__close-button").removeClass('article-reveal__hidden');

      //animate reveal
      Adapt.trigger("article:revealing", this);
      this.$el.siblings(".article__inner").velocity("slideDown", 800, _.bind(function() {
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
      var allComponents = this.model.findDescendantModels('components');
      allComponents.forEach(function(component) {
        component.setLocking("_isVisible", false);
        component.set('_isVisible', view, {
          pluginName: "_articleReveal"
        });
      });
    },

    preventDrag: function() {
      $(".article-reveal__open-button").on("dragstart", function(event) {
        event.preventDefault();
      });
      $(".article-reveal__close-button").on("dragstart", function(event) {
        event.preventDefault();
      });
    },

    // Handles the Adapt page scrollTo event
    onProgressBarScrollTo: function(componentSelector) {
      if (typeof componentSelector == "object") componentSelector = componentSelector.selector;
      var allComponents = this.model.findDescendantModels('components');
      var componentID = componentSelector;
      if (componentID.indexOf('.') === 0) componentID = componentID.slice(1);
      allComponents.forEach(_.bind(function(component) {
        if (component.get('_id') === componentID && !component.get('_isVisible')) {
          this.revealComponent(componentSelector);
          return;
        }
      }, this));
    },

    revealComponent: function(componentSelector) {
      this.$(".article-reveal__open-button").addClass('is-visited');
      this.$(".article-reveal__open-button").addClass('show');

      this.toggleisVisible(true);
      $("." + this.model.get("_id") + " > .article__inner ").slideDown(0);
      this.$(".article-reveal__close-button").fadeIn(1);
      $(window).scrollTo($(componentSelector), {
        offset: {
          top: -$('.navigation').height()
        }
      }).resize();
    }

  });

  Adapt.on('articleView:postRender', function(view) {
    if (view.model.get("_articleReveal")) {
      new ArticleRevealView({
        model: view.model
      });
    }
  });

});
