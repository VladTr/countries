const express = require('express');
const models = require('../models');
const url = require('url');
const { toXML } = require('jstoxml');

const router = express.Router();

router.get('/countries', async(req, res, next) => {
    const type = url.parse(req.url, true).query['type'];
    const myFunc = url.parse(req.url, true).query['callback'];

    try {
        let countries = await models.Country.findAll({
            attributes: ["id", "name"],
            order: [["name"]]
        });
        countries = countries.map(country => country.toJSON());
        
        if (myFunc) {
            res.set("Content-Type", "application/javascript; charset=utf-8");
            return res.send(myFunc + '(' + JSON.stringify(countries) + ')');
        }

        if (type === "xml") {
            console.log(toXML(countries));
            return res.set('text/xml').send(`<countries>${toXML(countries)}</countries>`); 
        } else {
            res.set('Content-Type', 'application/json');
            res.send(countries);
        }
    } catch(ex) {
        next(ex);
    }
});

router.get('/country', async(req, res, next) => {
    const id = url.parse(req.url, true).query['id'];
    const myFunc = url.parse(req.url, true).query['callback'];
    
    if(!id) {
        return next(new Error('invalid parameter'));
    }

    try {
        const rates = await models.Rate.findAll({
            include: [
                { 
                    model: models.Country,
                    where: { id },
                    attributes: ["name", "shortName", "code"]
                }
            ],
            attributes: ["areaCode", "phonePart", "type", "rate"]
        });

        if(!rates.length) {
            return res.send({rates: []});
        }

        const preparedRates = [];
        const country = rates[0].Country
        let curType = rates[0].type;
        let curRate = rates[0].rate;
        let code = '';
        rates.forEach((rate, ind) => {
            if (curType === rate.type) {
                code +=`${rate.phonePart ? rate.areaCode + rate.phonePart.toString() : rate.areaCode.toString()}, `;
            } else {
                preparedRates.push({code:code.slice(0,-2), type: curType, rate: curRate});
                curType = rate.type;
                curRate = rate.rate;
                code = `${rate.phonePart ? rate.areaCode + rate.phonePart.toString() : rate.areaCode.toString()}, `;
            }
            if (rates.length - 1 === ind) {
                preparedRates.push({code:code.slice(0,-2), type: rate.type, rate: rate.rate});
            }
        });

        if (myFunc) {
            res.set("Content-Type", "application/javascript; charset=utf-8");
            return res.send(myFunc + '(' + JSON.stringify({country, rates:preparedRates}) + ')');
        } 

        res.send({country, rates:preparedRates})
    } catch(ex) {
        next(ex);
    }
});

module.exports = router;