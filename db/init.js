const axios = require('axios');
const request = require('request');
const models = require('../models');
const util = require('util');

const callPostRequest = util.promisify(request.post);

module.exports = async() => {
    await models.sequelize.authenticate();
    await models.Country.sync();
    await models.Rate.sync();

    const countries = await models.Country.count();

    if (!countries) {
        const url = "https://www.ringcentral.com/api/index.php";
        const params = "cmd=getCountries&typeResponse=json";
        const response = await axios.get(`${url}?${params}`);
        let data = response.data
        data = data.slice(0, data.length-1);
        await models.Country.bulkCreate(JSON.parse(data).result);
    }

    const rates = await models.Rate.count();

    if (!rates){
        const countries = await models.Country.findAll({
            attributes: ["id"]
        })

        for (let country of countries) {
            const id = country.get("id");
            const body=`cmd=getInternationalRates&param[internationalRatesRequest][brandId]=1210&param[internationalRatesRequest][countryId]=${id}&param[internationalRatesRequest][tierId]=3311&typeResponse=json`;

            const result = await callPostRequest({
                url:"https://www.ringcentral.com/api/index.php", 
                body,
                headers: {'content-type' : 'application/x-www-form-urlencoded'}
            });

            let data = result.body;
            data = data.slice(0, data.length-1);

            const rates = JSON.parse(data).rates;
            
            if (!Object.keys(rates).length) {
                continue;
            }

            let preparedData = [];

            if (!Array.isArray(rates[0].value[0])) {
                let currentData = rates[0].value[0];
                currentData.countryId = id;
                preparedData = [currentData];
            } else {
                preparedData = rates[0].value[0].map(data=>{
                data.countryId = id;
                return data;
                })
            }

            await models.Rate.bulkCreate(preparedData);
            }
    }

}