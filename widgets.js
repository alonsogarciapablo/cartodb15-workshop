var Widget = Backbone.Model.extend({

  isFilterActive: function(index) {
    return this.get('activeFilter') === index;
  },

  getActiveFilterCondition: function() {
    var activeFilter = this.get('activeFilter');
    if (activeFilter >= 0) {
      return this.get('filters')[activeFilter].condition;
    }
  }
});

var Widgets = Backbone.Collection.extend({

  model: Widget,

  getActiveFilterConditions: function() {
    var conditions = [];
    this.each(function(widget) {
      var filter = widget.getActiveFilterCondition();
      if (filter) {
        conditions.push(filter);
      }
    });
    return conditions;
  }
});

var WidgetView = Backbone.View.extend({

  events: {
    'click .js-filter': 'changeActiveFilter',
    'click .js-filter-clear': 'clearActiveFilter'
  },

  initialize: function() {
    this.model.bind('change:activeFilter', this.render, this);
  },

  render: function() {
    var template = _.template(document.getElementById('widgetTemplate').innerHTML);
    this.el.innerHTML = template(this.model.toJSON());

    var filterElements = Array.prototype.slice.call(this.el.querySelectorAll('.js-filter'));
    filterElements.forEach(function(filterElement, index) {
      if (this.model.isFilterActive(index)) {
        filterElement.classList.add('is-active');
      } else {
        filterElement.classList.remove('is-active');
      }
    }.bind(this));

    return this;
  },

  changeActiveFilter: function(event) {
    event.preventDefault();

    var clickedFilter = event.target;
    var filterElements = Array.prototype.slice.call(this.el.querySelectorAll('.js-filter'));
    var indexOfFilter = filterElements.indexOf(clickedFilter);
    this.model.set('activeFilter', indexOfFilter);
  },

  clearActiveFilter: function(event) {
    event.preventDefault();

    this.model.set('activeFilter', undefined);
  }
});

var addWidget = function(widgets, widgetData) {
  var widget = new Widget(widgetData);
  widgets.add(widget);
  return widget;
};

var renderWidgets = function(widgets) {
  widgets.each(function(widget) {
    var widgetView = new WidgetView({ model: widget });
    document.getElementById('widgets').appendChild(widgetView.render().el);
  });
};
