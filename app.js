// TODO:
//  - Add title to the dashboard
//  - Customize infowindow
//  - Add widget that gets some data from SQL API and filters by category
// cartodb.SQL({ user: 'cartodb15' }).execute('SELECT AVG(price) AS price FROM airbnb_listings ' + ' WHERE ' + conditions.join(' AND '))
// .done(function(data){
//   alert(data.rows[0].price);
// });
//  - Widget to filter by line name
var main = function() {
  var widgets = [
    {
      title: 'Room type',
      filters: [
        { 
          title: 'Entire homes or apartments',
          condition: "room_type = 'Entire home/apt'"
        },
        {
          title: 'Other types',
          condition: "room_type != 'Entire home/apt'"
        }
      ]
    }, 
    {
      title: 'Distance to subway station',
      filters: [
        {
          title: "Less than 200 yards",
          condition: "distance_to_closest_subway_station <= 0.11"
        },
        {
          title: "Less than a 1/4 mile",
          condition: "distance_to_closest_subway_station <= 0.25"
        },
        {
          title: "Less than 0.5 miles",
          condition: "distance_to_closest_subway_station <= 0.5"
        },
        {
          title: "Less than 1 mile",
          condition: "distance_to_closest_subway_station <= 1"
        }
      ]
    }, {
      title: 'Price range',
      filters: [
        {
          title: "Between $50 and $100",
          condition: "price BETWEEN 50 and 100"
        },
        {
          title: "Between $100 and $150",
          condition: "price BETWEEN 100 and 150"
        },
        {
          title: "Between $150 and $200",
          condition: "price BETWEEN 150 and 200"
        },
        {
          title: "More than $200",
          condition: "price > 200"
        }
      ]
    }
  ]

  widgets.forEach(renderWidget);

  var vizjson = 'https://cartodb15.cartodb.com/api/v2/viz/66bffecc-99e2-11e5-82c2-0ecd1babdde5/viz.json';
  var options = {
    shareable: false,
    title: false,
    description: false,
    search: false,
    tiles_loader: true
  };
  cartodb.createVis('map', vizjson, options)
  .done(onVisCreated)
  .error(onError);

var renderWidget = function(widgetData) {
  var template = document.getElementById('widgetTemplate').innerHTML;
  var template = _.template(template);
  document.getElementById('widgets').innerHTML += template(widgetData);
};

var onVisCreated = function(vis, layers) {
  var sublayer = layers[1].getSubLayer(3);
  var activeFilters = [];
  var widgets = document.querySelectorAll('.js-widget');
  for (i = 0; i < widgets.length; i++) {
    widget = widgets[i];

    var filters = widget.querySelectorAll('.js-filter');
    for (j = 0; j < filters.length; j++) {
      filter = filters[j];

      bindClickEvents(widget, filter, sublayer);
    }
  }
};

var bindClickEvents = function(widget, filter, sublayer) {
  filter.addEventListener('click', function(event) {
    event.preventDefault();
    applyFilter(widget, filter);
    reloadWidget(widget);

    // TODO: Keep track of active filters somewhere
    var activeFilters = document.querySelectorAll('.js-filter[data-active="true"]');
    updateSublayerSQL(sublayer, activeFilters);
  }, false);
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

var updateSublayerSQL = function(sublayer, activeFilters) {
  var originalSQL = 'SELECT * FROM airbnb_listings';
  var conditions = [];

  for (i = 0; i < activeFilters.length; i++) {
    conditions.push(activeFilters[i].dataset.queryCondition);
  }
  if (conditions.length) {
    var newQuery = originalSQL + ' WHERE ' + conditions.join(' AND ');
  } else {
    var newQuery = originalSQL;
  }
  sublayer.setSQL(newQuery);
};

var onError = function(err) {
  alert('error!');
};

window.onload = main;