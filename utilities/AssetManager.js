class AssetManagerClass {
  constructor() {
    this.assets = {};
  }

  registerImageAssets(key, url) {
    var urls = (url instanceof Array) ? url : [url];
    this.assets[key] = new ImageAssets(urls);
    return this.assets[key];
  }

  registerDataAssets(key, url) {
    var urls = (url instanceof Array) ? url : [url];
    this.assets[key] = new DataAssets(urls);
    return this.assets[key];
  }

  get(key) {
    return this.assets[key];
  }

  // load asset group for this key
  load(key) {
    this.assets[key].load();
    return this.assets[key];
  }
}

class DataAssets{
  constructor(urls) {
    this.urls = urls;
    this.cache = {};
    this.onprogress = function () {};
    this.onload = function () {};
    this.onerror = function () {};
  }

  load() {
    var successHandler = cbCounter(this.urls.length, this.onload);
    for (var i = 0; i < this.urls.length; i++) {
      var request = new XMLHttpRequest();
      var payload = {
        completed: 0,
        total: this.urls.length,
        request: null,
        url: null
      };

      /*eslint-disable */
      request.onreadystatechange = function onreadystatechange(i, request) {
        if (request.readyState === 4) {
          this.cache[this.urls[i]] = request.responseText;
          payload.completed++;
          payload.request = request;
          payload.url = this.urls[i];
          this.onprogress(payload);
          successHandler(payload);
        }
      }.bind(this, i, request);
      /*eslint-enable */

      request.onerror = this.onerror;
      request.open('GET', this.urls[i]);
      request.send();
    }
  }

  getData() {
    return this.cache;
  }
}

class ImageAssets {
  constructor(urls) {
    this.urls = urls;
    this.onprogress = function () {};
    this.onload = function () {};
    this.onerror = function () {};
  }

  load() {
    var successHandler = cbCounter(this.urls.length, this.onload);
    for (var i = 0; i < this.urls.length; i++) {
      var payload = {
        completed: 0,
        total: this.urls.length,
        request: null,
        url: null
      };
      var img = new Image();
      img.src = this.urls[i];
      /*eslint-disable */
      img.onload = function () {
        payload.completed++;
        payload.request = request;
        payload.url = this.urls[i];
        this.onprogress(payload);
        successHandler(payload);
      }.bind(this);
      /*eslint-enable */
      img.onerror = this.onerror;
    }
  }
}

function cbCounter(n, cb) {
  var counter = n;
  return function () {
    counter--;
    if (counter === 0) cb();
  };
}

var AssetManager = new AssetManagerClass();
export default AssetManager;
