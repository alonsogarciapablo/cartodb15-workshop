// CARTODB15 - Cartodb.js WORKSHOP

// TASK 2: Add one widget that filters by the different types of room (room_type column)
//  {
//    title: 'Title of widget',
//    filters: [
//      {
//        title: 'Cheap',
//        condition: 'price < 100'
//      }
//    ]
//  }
var widgets = [
  {
    title: 'Room type',
    filters: [
      {
        title: 'Entire homes or apartments',
        condition: "room_type = 'Entire home/apt'"
      },
      {
        title: 'Shared room',
        condition: "room_type = 'Shared room'"
      },
      {
        title: 'Private room',
        condition: "room_type = 'Private room'"
      }
    ]
  }, {
    title: 'Distance to subway station',
    filters: [
      {
        title: "2 blocks",
        condition: "distance_to_closest_subway_station <= 0.11"
      },
      {
        title: "6 blocks",
        condition: "distance_to_closest_subway_station <= 0.3"
      },
      {
        title: "10 blocks",
        condition: "distance_to_closest_subway_station <= 0.5"
      },
      {
        title: "20 blocks",
        condition: "distance_to_closest_subway_station <= 1"
      }
    ]
  }, {
    title: 'Price range',
    filters: [
      {
        title: "Under $1000",
        condition: "price < 1000"
      },
      {
        title: "$1000 to $2500",
        condition: "price BETWEEN 1000 and 2500"
      },
      {
        title: "$2500 to $5000",
        condition: "price BETWEEN 2500 and 5000"
      },
      {
        title: "Over $5000",
        condition: "price > 5000"
      }
    ]
  }
];

var main = function() {
  widgets.forEach(renderWidget);

  // TASK 1: Put the viz.json of your map here!
  var vizjson = 'https://cartodb15.cartodb.com/api/v2/viz/66bffecc-99e2-11e5-82c2-0ecd1babdde5/viz.json';
  var vizjson = 'https://cartodb15.cartodb.com/api/v2/viz/7c6062ac-9d30-11e5-ab1e-0e3ff518bd15/viz.json';
  var options = {
    shareable: false,
    title: false,
    description: false,
    search: false,
    tiles_loader: true
  };
  cartodb.createVis('map', vizjson, options)
  .done(onVisCreated)
  .error(function(err) { alert('error!'); });

  reloadStats();
};

var onVisCreated = function(vis, layers) {

  // TASK 3: Access the sublayer linked to the airbnb_listings dataset
  var sublayer = layers[1].getSubLayer(0);

  // Iterate through all the widgets and filters and bind click events
  var widgets = document.querySelectorAll('.js-widget');
  for (i = 0; i < widgets.length; i++) {
    widget = widgets[i];

    var filters = widget.querySelectorAll('.js-filter');
    for (j = 0; j < filters.length; j++) {
      filter = filters[j];

      // TASK 4: Uncomment this
      bindClickEvents(widget, filter, sublayer);
    }
  }
};

var bindClickEvents = function(widget, filter, sublayer) {
  filter.addEventListener('click', function(event) {
    event.preventDefault();

    // Marks the filter as active and reloads the widget view.
    // These two methods are defined in widgets.js
    applyFilter(widget, filter);
    reloadWidget(widget);
    updateSublayerSQL(sublayer);
    reloadStats();
  }, false);
};

var updateSublayerSQL = function(sublayer) {
  var conditions = getFilterConditions();

  // TASK 5: Generate the SQL and update the SQL of the sublayer using sublayer.setSQL
  var newQuery = 'SELECT * FROM airbnb_listings';
  if (conditions.length) {
    newQuery += ' WHERE ' + conditions.join(' AND ');
  }

  sublayer.setSQL(newQuery);
};

var getFilterConditions = function() {
  var activeFilters = document.querySelectorAll('.js-filter[data-active="true"]');
  var conditions = [];

  for (i = 0; i < activeFilters.length; i++) {
    conditions.push(activeFilters[i].dataset.queryCondition);
  }
  return conditions;
};

var reloadStats = function() {
  var statsQuery = "SELECT ROUND(AVG(price), 2) AS avg, MAX(price) AS max, MIN(price) AS min FROM airbnb_listings";

  // Add conditions for the active filters
  var conditions = getFilterConditions();
  if (conditions.length) {
    statsQuery += ' WHERE ' + conditions.join(' AND ');
  }

  // TAKS 6: Execute a SQL to get the stats and pass them to renderStats
  var sql = cartodb.SQL({ user: 'cartodb15'}).execute(statsQuery, function(data) {
    var row = data.rows[0];

    renderStats({
      avg: row.avg,
      max: row.max,
      min: row.min
    });
  });
};

var renderStats = function(stats) {
  var statsWidget = document.getElementById('statsWidget');

  statsWidget.querySelector('.js-stat-avg').innerHTML = stats.avg;
  statsWidget.querySelector('.js-stat-min').innerHTML = stats.min;
  statsWidget.querySelector('.js-stat-max').innerHTML = stats.max;
};

window.onload = main;