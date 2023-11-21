import { Router } from 'express';
import Zone, { ZoneInterface } from '../models/Zone';

const router = Router();

router.get('/', (req, res) => {
  Zone.find()
    .then((zones: ZoneInterface[]) => res.json({ zones }))
    .catch((error: Error) => res.status(500).json({ error }));
});

router.get('/:zoneId', (req, res) => {
  const id = req.params.zoneId;
  Zone.findOne({ id })
    .then((zone: ZoneInterface) => res.json({ zone }))
    .catch((error: Error) => res.status(500).json({ error }));
});

router.post('/', (req, res) => {
  new Zone(req.body).save()
    .then((zone: any) => res.json({ zone }))
    .catch(error => res.status(500).json({ error }));
});

router.put('/:zoneId', (req, res) => {
  const id = req.params.zoneId;
  let result: any;
  Zone.updateOne({ id }, req.query)
    .then((response: any) => {
      result = response;
      return Zone.find({ id });
    })
    .then((zone: ZoneInterface) => res.json({ zone, result }))
    .catch((error: Error) => res.status(500).json({ error }));
});

router.delete('/:zoneId', (req, res) => {
  const id = req.params.zoneId;
  Zone.deleteOne({ id })
    .then((result: any) => res.json({ result }))
    .catch((error: Error) => res.status(500).json({ error }));
});

export default router;
