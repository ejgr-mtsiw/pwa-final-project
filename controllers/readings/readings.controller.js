const models = require('../../models');
const messages = require('../../config/messages/bd');

const { validationResult } = require('express-validator');
const validator = require('./readings.validator');

var exports = module.exports = {};

/**
 * Get all readings for a kit
 */
exports.getAllReadingsForKit = [

    validator.KitIdParam,

    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(messages.db.requiredData.status)
                .send(messages.db.requiredData);
        }

        models.Reading.findAll(
            {
                'where': {
                    KitId: req.params.KitId
                }
            }
        ).then((readings) => {
            return res.send(readings);
        });
    }
];

/**
 * Renders a chart of the last 20 readings
 */
exports.renderChartLast10Readings = [

    validator.KitIdParam,

    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(messages.db.requiredData.status)
                .send(messages.db.requiredData);
        }

        models.Reading.findAll(
            {
                'where': {
                    KitId: req.params.KitId
                },
                'order': [
                    ['date', 'DESC']
                ],
                'limit': 20
            }
        ).then((readings) => {
            let temperatureData = [];
            let humidityData = [];

            readings.forEach(reading => {
                temperatureData.push(
                    {
                        t: reading.date,
                        y: reading.temperature
                    }
                );

                humidityData.push(
                    {
                        t: reading.date,
                        y: reading.humidity
                    }
                );
            });

            return res.render('kits/chart', {
                temperatureData: temperatureData,
                humidityData: humidityData
            });
        });
    }
];

/**
 * Add a reading for a kit
 */
exports.addReading = [

    validator.KitId,
    validator.humidity,
    validator.temperature,
    validator.soilHumidity,

    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(messages.db.requiredData.status)
                .send(messages.db.requiredData);
        }

        models.Reading.create({
            KitId: req.body.KitId,
            humidity: req.body.humidity,
            temperature: req.body.temperature,
            soilHumidity: req.body.soilHumidity
        }).then((reading) => {
            return res.status(messages.db.successInsert.status)
                .send(messages.db.successInsert);
        }).catch((err) => {
            console.log(err);
            return res.status(messages.db.dbError.status)
                .send(messages.db.dbError);
        });
    }
];
