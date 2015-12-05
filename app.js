// TODO:
//  - Add title to the dashboard
//  - Customize infowindow
//  - Add widget that gets some data from SQL API and filters by category
// cartodb.SQL({ user: 'cartodb15' }).execute('SELECT AVG(price) AS price FROM airbnb_listings ' + ' WHERE ' + conditions.join(' AND '))
// .done(function(data){
//   alert(data.rows[0].price);
// });

var main = function() {
  var vizjson = 'https://cartodb15.cartodb.com/api/v2/viz/66bffecc-99e2-11e5-82c2-0ecd1babdde5/viz.json';
  cartodb.createVis('map', vizjson, {
    shareable: false,
    title: false,
    description: false,
    search: false,
    tiles_loader: true
  })
  .done(onVisCreated)
  .error(onError);
};

var onVisCreated = function(vis, layers) {
  var editorLayers = layers[1];
  var airbnbListings = editorLayers.getSubLayer(3);
  var filters = document.querySelectorAll('.js-filter');

  for (i = 0; i < filters.length; ++i) {
    filters[i].addEventListener('click', function(event) {
      event.preventDefault();
      onFilterClicked(event.target, airbnbListings);
    }, false);
  }
};

var onFilterClicked = function(filter, sublayer) {
  applyFilter(filter);
  updateSublayerSQL(sublayer);
};

var applyFilter = function(filter) {
  var widget = filter.closest('.js-widget');
  var isFilterActive = filter.dataset.active === "true";

  var filters = widget.querySelectorAll('.js-filter');
  for (i = 0; i < filters.length; ++i) {
    filters[i].dataset.active = "false";
    filters[i].classList.remove('is-active');
  }

  if (!isFilterActive && filter.dataset.queryCondition) {
    filter.dataset.active = "true";
    filter.classList.add('is-active');
  }
};

var updateSublayerSQL = function(sublayer) {
  var originalSQL = 'SELECT * FROM airbnb_listings';
  var conditions = [];
  var activeFilters = document.querySelectorAll('.js-filter[data-active="true"]');

  for (i = 0; i < activeFilters.length; ++i) {
    conditions.push(activeFilters[i].dataset.queryCondition);
  }
  if (conditions.length) {
    var newQuery = originalSQL + ' WHERE ' + conditions.join(' AND ');
  } else {
    var newQuery = originalSQL;
  }
  sublayer.setSQL(newQuery);
}

var onError = function(err) {
  alert('error!');
};

window.onload = main;