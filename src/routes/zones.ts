import { Router } from 'express';
import Zone from '../models/Zone';
const router = Router();

router.get('/', (req, res) => {
    Zone.find()
        .then(zones => res.json({ zones }))
        .catch(error => res.status(500).json({ error }));
});

router.get('/:zoneId', (req, res) => {
    const id = req.params.zoneId;
    Zone.findOne({ id })
        .then(zone => res.json({ zone }))
        .catch(error => res.status(500).json({ error }));
});

router.post('/', (req, res) => {
    new Zone(req.body).save()
        .then(zone => res.json({ zone }))
        .catch(error => res.status(500).json({ error }));
});

router.put('/:zoneId', (req, res) => {
    const id = req.params.zoneId;
    let result: any;
    Zone.updateOne({ id }, req.query)
        .then(response => {
            result = response;
            return Zone.find({ id });
        })
        .then(zone => res.json({ zone, result }))
        .catch(error => res.status(500).json({ error }));
});

router.delete('/:zoneId', (req, res) => {
    const id = req.params.zoneId;
    Zone.deleteOne({ id })
        .then(result => res.json({ result }))
        .catch(error => res.status(500).json({ error }));
});

module.exports = router;
