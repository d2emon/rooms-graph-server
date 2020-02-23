'use strict';
import express from 'express';
import Zone from '../models/Zone';
const router = express.Router();

router.get('/', (req, res) => {
    Zone.find()
        .then(response => res.json({zones: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.get('/:zoneId', (req, res) => {
    const zoneId = req.params.zoneId;
    Zone.findOne({id: zoneId})
        .then(response => res.json({zone: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.post('/', (req, res) => {
    new Zone(req.body).save()
        .then(response => res.json({zone: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.put('/:zoneId', (req, res) => {
    const zoneId = req.params.zoneId;
    let result;
    Zone.updateOne({id: zoneId}, req.query)
        .then(response => {
            result = response;
            return Zone.find({id: zoneId});
        })
        .then(response => res.json({zone: response, result: result}))
        .catch(error => res.status(500).json({error: error}));
});

router.delete('/:zoneId', (req, res) => {
    const zoneId = req.params.zoneId;
    Zone.deleteOne({id: zoneId})
        .then(response => res.json({result: response}))
        .catch(error => res.status(500).json({error: error}));
});

module.exports = router;
