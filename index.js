"use strict"
const geojsonVt = require('geojson-vt');
const vtPbf = require('vt-pbf');
const request = require('requestretry');
const zlib = require('zlib');
// Use static azure blob mirror fot TICKET_SALES_SOURCE until ArcGIS Online gets new dataset with a new schema
// "https://data-hslhrt.opendata.arcgis.com/datasets/727c6618a0814f8ba21bb00c9cb34019_0.geojson"
const TICKET_SALES_SOURCE = "https://hslstoragekarttatuotanto.blob.core.windows.net/map-server-legacy-data/727c6618a0814f8ba21bb00c9cb34019_0.geojson"


const getTileIndex = (url, callback) => {
  request({
    url: url,
    maxAttempts: 20,
    retryDelay: 30000,
    followAllRedirects: true,
    retryStrategy: (err, response) => (request.RetryStrategies.HTTPOrNetworkError(err, response) || (response && 202 === response.statusCode))
  }, function (err, res, body){
    if (err){
      callback(err);
      return;
    }
<<<<<<< HEAD
    console.log("ticket sales points loaded from: ", TICKET_SALES_SOURCE)
=======
    console.log(res)
>>>>>>> 08ae0e6... Use temporary source dataset
    callback(null, geojsonVt(JSON.parse(body), {maxZoom: 20})); //TODO: this should be configurable)
  })
}

class GeoJSONSource {
  constructor(uri, callback){
<<<<<<< HEAD
    getTileIndex(TICKET_SALES_SOURCE, (err, tileIndex) => {
=======
    // getTileIndex("https://data-hslhrt.opendata.arcgis.com/datasets/727c6618a0814f8ba21bb00c9cb34019_0.geojson", (err, tileIndex) => {
    getTileIndex("https://hslstoragekarttatuotanto.blob.core.windows.net/map-server-legacy-data/727c6618a0814f8ba21bb00c9cb34019_0.geojson", (err, tileIndex) => {
>>>>>>> 08ae0e6... Use temporary source dataset
      if (err){
        callback(err);
        return;
      }
      this.tileIndex = tileIndex;
      callback(null, this);
    })
  };

  getTile(z, x, y, callback){
    let tile = this.tileIndex.getTile(z, x, y)

    if (tile === null){
      tile = {features: []}
    }

    const data = Buffer.from(vtPbf.fromGeojsonVt({'ticket-sales': tile}));

    zlib.gzip(data, function (err, buffer) {
      if (err){
        callback(err);
        return;
      }

      callback(null, buffer, {"content-encoding": "gzip"})
    })
  }

  getInfo(callback){
    callback(null, {
      format: "pbf",
      maxzoom: 20,
      vector_layers: [{
        description: "",
        id: "ticket-sales"
      }]
    })
  }
}

module.exports = GeoJSONSource

module.exports.registerProtocols = (tilelive) => {
  tilelive.protocols['hslticketsales:'] = GeoJSONSource
}
