const Promise = require('bluebird');
const _ = require('lodash');

const mongoose = require('mongoose');

const parser = require('../parser/parse');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const args = require('minimist')(process.argv.slice(2));

const mongoIp = args.mongo_ip ? args.mongo_ip : 'localhost';

mongoose.Promise = Promise;
mongoose.connect(`mongodb://${mongoIp}/ut4_stats`);

let Kill = getKillModel();

const mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', function () {
    console.log('MongoDB connection established successfully');

    initWebServer();
});

function initWebServer() {
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(cors());
    app.use(express.static('../client'));

    // TODO is it really a good idea to remove the default cache policy?
    app.disable('etag');

    app.get('/ping', (request, response) => {
        response.sendStatus('200');
    });

    app.get('/api/stats', (request, response) => {
        getNumberOfKillByKillerWeaponAndVictim(Kill)
            .then(aggregatedData => {
                // TODO check if that algorithm could be enhanced
                var numberOfKillByKillerWeaponVictim = _(aggregatedData)
                    .groupBy('_id.killer')
                    .omit('_id.killer')
                    .reduce((byKiller, originalData, killer) => {
                        byKiller[killer] = _(originalData)
                            .groupBy('_id.weapon')
                            .reduce((byWeapon, killsByWeapon, weapon) => {
                                byWeapon[weapon] = _.reduce(killsByWeapon, (deathByVictim, data) => {
                                    _.set(deathByVictim, _.get(data, '_id.victim'), data.count);
                                    return deathByVictim;
                                }, {});
                                return byWeapon;
                            }, {});
                        return byKiller;
                    }, {});
                return response.send(numberOfKillByKillerWeaponVictim);
            });
    });

    app.post('/api/kills', (request, response) => {
        if (!request.body) {
            return response.sendStatus(400);
        }

        return saveKills(request.body)
            .then(() => response.sendStatus(201))
            .catch(() => response.sendStatus(400));
    });

    app.listen(8080, () => console.log('Webserver started successfully'));
}

function saveKills(jsonKills) {
    return Promise.all(_.map(jsonKills, kill => saveKill(kill)));
}

function saveKill(jsonKill) {
    return new Kill(jsonKill).save();
}

function getKillModel() {
    return mongoose.model('Kill',
        mongoose.Schema({
            killer: String,
            victim: String,
            weapon: String
        })
    );
}

function getNumberOfKillByKillerWeaponAndVictim(mongoModel) {
    return mongoModel.aggregate({
        "$group": {
            "_id": {
                killer: "$killer",
                weapon: "$weapon",
                victim: "$victim"
            },
            count: {
                "$sum": 1
            }
        }
    }).exec();
}