var renderWidget = function(widgetData) {
  var template = document.getElementById('widgetTemplate').innerHTML;
  var template = _.template(template);
  var div = document.createElement('div');
  div.innerHTML = template(widgetData);
  document.getElementById('widgets').appendChild(div);
};

var applyFilter = function(widget, filter) {
  var isFilterActive = filter.dataset.active === "true";

  var filters = widget.querySelectorAll('.js-filter');
  for (i = 0; i < filters.length; i++) {
    if (filters[i].dataset.queryCondition) {
      filters[i].dataset.active = "false";
    }
  }

  if (!isFilterActive && filter.dataset.queryCondition) {
    filter.dataset.active = "true";
  }
};

var reloadWidget = function(widget) {
  var filters = widget.querySelectorAll('.js-filter');
  for (i = 0; i < filters.length; i++) {
    var filter = filters[i];
    if (filter.dataset.active === "true") {
      filter.classList.add('is-active');
    } else {
      filter.classList.remove('is-active');
    }
  }
};
