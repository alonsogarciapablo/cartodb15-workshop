var main = function(vis, layers) {
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
};

var onVisCreated = function(vis, layers) {
  var sublayer = layers[1].getSubLayer(0);

  var originalSQL = sublayer.getSQL();
  var originalCartoCSS = sublayer.getCartoCSS();

  var widgets = new Widgets();

  addWidget(widgets, {
    title: 'My widget',
    filters: [{
      title: 'wadus',
      condition: 'price < 100'
    }]
  });

  widgets.each(function(widget) {
    widget.bind('change:activeFilter', function() {

      var filterConditions = widgets.getActiveFilterConditions();
      var sql = "SELECT * FROM airbnb_listings";
      if (filterConditions.length) {
        sql += " WHERE " + filterConditions.join(" AND ");
      }

      console.log(sql);

      var cartoCSS = originalCartoCSS;
      if (filterConditions.length) {
        cartoCSS =  "#airbnb_listings {" +
                  "   marker-fill-opacity: 0.9;" +
                  "   marker-line-color: #FFF;" +
                  "   marker-line-width: 0.5;" +
                  "   marker-line-opacity: 0.6;" +
                  "   marker-placement: point;" +
                  "   marker-type: ellipse;" +
                  "   marker-width: 6;" +
                  "   marker-allow-overlap: true;" +
                  "   marker-fill: #006983;" +
                  "   [zoom>=13]{marker-width:7;} " +
                  "}";
      }
      console.log(cartoCSS);

      sublayer.set({
        sql: sql,
        cartoCSS: cartoCSS
      });
    });
  });
}
window.onload = main;