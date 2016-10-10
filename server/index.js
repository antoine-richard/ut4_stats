const Promise = require('bluebird');
const _ = require('lodash');

const mongoose = require('mongoose');

const parser = require('../parser/parse');
const app = require('express')();
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

    // TODO is it really a good idea to remove the default cache policy?
    app.disable('etag');

    app.get('/ping', (request, response) => {
        response.sendStatus('200');
    });

    app.get('/api/kills', (request, response) => {
        Kill.find({})
            .then(data => {
                return response.send(data);
            })
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