var App = {
  storage: {
    countries: [],
    countryId: ""
  },

  init: function () {
    var divApp = document.getElementById("app");
    var button = document.createElement("input");
    button.id = "sendBtn";
    button.value = "Search";
    button.type = "button";
    button.onclick = this.getRate.bind(this);
    button.disabled = true;
    document.querySelectorAll(".btn")[0].appendChild(button);
    this.scriptRequest("countries");
  },

  myFunc: function (data) {
    var script = document.querySelectorAll("script#tmp")[0];
    script.parentElement.removeChild(script);
    if (data.length) {
      this.storage.countries = data;
      var selectElement = this.createSelect(this.storage.countries, this.onSelect.bind(this));
      document.querySelectorAll(".select")[0].appendChild(selectElement);
      document.querySelectorAll("input#sendBtn")[0].disabled = false;
    } else {
      var result = document.querySelectorAll(".result")[0];
      if (!data.country || !data.rates.length) {
        return result.innerHTML = "sorry";
      }
      var table = this.generateResult({
        country: {
          name: data.country.name
        },
        rates: data.rates
      });
      
      result.innerHTML = "";
      result.appendChild(table);
    }

  },

  scriptRequest: function (url) {
    var scriptOk = false;

    var callbackName = "myFunc";

    url += ~url.indexOf('?') ? '&' : '?';
    url += "callback=App." + callbackName;

    var script = document.createElement("script");

    script.onreadystatechange = function () {
      if (this.readyState == "complete" || this.readyState == "loaded") {
        this.onreadystatechange = null;
      }
    }

    script.src = url;
    script.id = "tmp";

    document.body.appendChild(script);
  },

  createSelect: function (elements, listener) {
    var selectList = document.createElement("select");
    selectList.id = "countriesSelect";
    selectList.onchange = listener;

    elements.forEach(function (element) {
      var option = document.createElement("option");
      option.value = element.id;
      option.innerHTML = element.name;
      selectList.appendChild(option);
    });

    return selectList;
  },

  onSelect: function (event) {
    var e = event || window.event;
    var value = e.target ? e.target.value : e.srcElement.value;
    this.storage.countryId = value;
  },

  getRate: function () {
    var result = document.querySelectorAll(".result")[0];
    result.innerHTML = '';
    result.appendChild(this.createLoader());
    this.scriptRequest("country?id=" + this.storage.countryId);
  },

  generateResult: function (data) {
    var headers = ["Country", "Type", "Code", "Rate per minute"];
    var table = document.createElement("table");
    var tr = document.createElement("tr");
    headers.forEach(function (header) {
      var td = document.createElement("td");
      td.innerText = header;
      if (header === "Code") {
        td.className = "code";
      }
      tr.appendChild(td);
    })
    table.appendChild(tr);

    var td = null;
    data.rates.forEach(function (rate, ind) {
      var tr = document.createElement("tr");
      td = document.createElement("td");
      if (ind === 0) {
        td.innerText = data.country.name;
      }
      tr.appendChild(td);

      td = document.createElement("td");
      td.innerText = rate.type;
      tr.appendChild(td);

      td = document.createElement("td");
      td.className = "code";
      td.innerText = rate.code;
      tr.appendChild(td);

      td = document.createElement("td");
      td.innerText = "$"+rate.rate;
      tr.appendChild(td);

      table.appendChild(tr);
    });

    return table;
  },

  createLoader: function () {
    var loader = document.createElement("div");
  
    if (   (window.navigator.appName === "Microsoft Internet Explorer")
        || (window.navigator.appName == "Netscape" && window.navigator.appVersion.indexOf("Edge") > -1)
        || (/Edge/.test(window.navigator.userAgent))
        || (/AppleWebKit/.test(window.navigator.userAgent) && (window.navigator.userAgent.indexOf("Chrome") === -1))
        || (/Trident/.test(window.navigator.userAgent))
    ) {
        loader.innerHTML = "Loading ..."
      } else {
        loader.className = "loader";
      }

    return loader;
  }

};

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();  
    return fBound;
  };
}

if (typeof Array.prototype.forEach != 'function') {
  Array.prototype.forEach = function(callback){
    for (var i = 0; i < this.length; i++){
      callback.apply(this, [this[i], i, this]);
    }
  };
}

App.init();