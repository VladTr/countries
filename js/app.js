require("@babel/polyfill");
const app = {
    div: document.getElementById("app"),
    divSelect: createDiv("select"),
    resultDiv: createDiv("result"),
    btnDiv: createDiv("btn"),
    buttonEntity: new Button(),
    store: {
        countries: [],
        countryId: '',
        country: {}
    },

    init() {
        const selectArea = createDiv("selectArea");
        selectArea.appendChild(this.divSelect);
        //this.divSelect.appendChild(createLoader());
        this.btnDiv.appendChild(this.buttonEntity.create("Search", this.getRate.bind(this)));
        selectArea.appendChild(this.btnDiv);

        this.div.appendChild(selectArea);
        
        this.div.appendChild(this.resultDiv);
        this.getCountries(this.buttonEntity.toggle);
    },

    async getCountries(callback) {
        try {
            this.store.countries = await request('/countries', {type:"xml"});
            this.divSelect.innerHTML = '';
            this.divSelect.appendChild(createSelect(this.store.countries, this.onSelect.bind(this)));
            this.store.countryId = this.store.countries[0].id;
            callback();
        } catch(ex) {
            console.log(ex);
        }
        
    },

    async getRate() {
        this.resultDiv.innerHTML = '';
        this.resultDiv.appendChild(createLoader());
        try {
            const result = await request('/country', {id: this.store.countryId});

            if (!result.rates.length) {
                return this.resultDiv.innerHTML = "Please refer to our pricing table for per minute rates";
            }

            this.store.country = result;
            this.resultDiv.innerHTML = '';
            this.resultDiv.appendChild(generateResult(this.store.country));
        } catch(ex) {
            console.log(ex);
        }
        
    },

    onSelect(event) {
        this.store.countryId = event.target.value;
    }
};

app.init();

function Button() {
    this.id = "sendBtn";
    this.button;

    this.create = (name, listener) => {
        this.button = document.createElement("input");
        this.button.id = this.id;
        this.button.value = name;
        this.button.type = "button";
        this.button.onclick = listener;
        this.button.disabled = true;
        return this.button;
    }
    
    this.toggle = () => {
        this.button.disabled = false;
    }

    this.get = () => {
        return this.button;
    }
}

function createSelect(elements, listener){
    const selectList = document.createElement("select");
    selectList.id = "countriesSelect";
    selectList.onchange = listener;
    
    elements.forEach( element => {
        const option = document.createElement("option");
        option.value = element.id;
        option.text = element.name;
        selectList.appendChild(option);
    });

    return selectList;
}

function createLoader() {
    const loader = document.createElement("div");
    loader.className = "loader";
    return loader;
}

function createDiv(className) {
    const resultDiv = document.createElement("div");
    resultDiv.className = className;
    return resultDiv;
}

function generateResult(data) {
    const headers = ["Country", "Type", "Code", "Rate per minute"];
    const table = document.createElement("table");
    const tr = document.createElement("tr");
    headers.forEach(header => {
        const td = document.createElement("td");
        td.innerText = header;
        if (header === "Code") {
            td.className = "code";
        }
        tr.appendChild(td);
    })
    table.appendChild(tr);

    let td = null;
    data.rates.forEach((rate, ind) => {
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
}

function request (url, param) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (param && param.type === "xml") {
            const xml = new window.DOMParser().parseFromString(xhr.responseText, "text/xml");

            resolve(XML2JS(xml, "countries"));
        } else {
            resolve(JSON.parse(xhr.responseText));
        }
        
      });
      xhr.addEventListener('error', () => { 
        reject(new Error(xhr.statusText));
      })

      const urlParams = param ? `${url}?${Object.keys(param)[0]}=${Object.values(param)[0]}` : `${url}`;

      xhr.open('GET', `${urlParams}`);
      xhr.send();
    });
};

function XML2JS(xmlDoc, containerTag) {
    const output = [];
    const rawData = xmlDoc.getElementsByTagName(containerTag)[0];
    let i, oneObject;
    for (i = 0; i < rawData.childNodes.length; i++) {
        oneObject = {};
        if (rawData.childNodes[i].nodeType === 1) {
            if (rawData.childNodes[i].tagName === "id") {
                oneObject.id = rawData.childNodes[i].firstChild.nodeValue;
                oneObject.name = rawData.childNodes[i+1].firstChild.nodeValue;
                output.push(oneObject);
            }
            
        }
    }
    return output;
}


