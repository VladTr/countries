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
    document.getElementsByClassName("btn")[0].appendChild(button);
    this.scriptRequest("countries");
  },

  myFunc: function (data) {
    if (Array.isArray(data)) {
      this.storage.countries = data;
      var selectElement = this.createSelect(this.storage.countries, this.onSelect.bind(this));
      document.getElementsByClassName("select")[0].appendChild(selectElement);
      document.getElementById("sendBtn").disabled = false;
    } else {
      var table = this.generateResult({
        country: {
          name: data.country.name
        },
        rates: data.rates
      });
      var result = document.getElementsByClassName("result")[0];
      result.innerHTML = '';
      result.appendChild(table);
    }

  },

  scriptRequest: function (url) {
    var scriptOk = false;

    var callbackName = "myFunc";

    url += ~url.indexOf('?') ? '&' : '?';
    url += "callback=App." + callbackName;

    function checkCallback() {
      if (scriptOk) return;
    }

    const script = document.createElement("script");

    script.onreadystatechange = function () {
      if (this.readyState == "complete" || this.readyState == "loaded") {
        this.onreadystatechange = null;
        setTimeout(checkCallback, 0);
      }
    }

    script.onload = script.onerror = checkCallback;
    script.src = url;

    document.body.appendChild(script);
  },

  createSelect: function (elements, listener) {
    const selectList = document.createElement("select");
    selectList.id = "countriesSelect";
    selectList.onchange = listener;

    elements.forEach(function (element) {
      const option = document.createElement("option");
      option.value = element.id;
      option.text = element.name;
      selectList.appendChild(option);
    });

    return selectList;
  },

  onSelect: function (event) {
    this.storage.countryId = event.target.value;
  },

  getRate: function () {
    var result = document.getElementsByClassName("result")[0];
    result.innerHTML = '';
    result.appendChild(this.createLoader());
    this.scriptRequest("country?id=" + this.storage.countryId);
  },

  generateResult: function (data) {
    const headers = ["Country", "Type", "Code", "Rate per minute"];
    const table = document.createElement("table");
    const tr = document.createElement("tr");
    headers.forEach(function (header) {
      const td = document.createElement("td");
      td.innerText = header;
      if (header === "Code") {
        td.className = "code";
      }
      tr.appendChild(td);
    })
    table.appendChild(tr);

    let td = null;
    data.rates.forEach(function (rate, ind) {
      const tr = document.createElement("tr");
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
      td.innerText = `$${rate.rate}`;
      tr.appendChild(td);

      table.appendChild(tr);
    });

    return table;
  },

  createLoader: function () {
    const loader = document.createElement("div");
    loader.className = "loader";
    return loader;
  }

};

App.init();