import express from 'express';
import { WalkerRequest } from '../interfaces/WalkerRequest';
import World, { WorldData } from '../models/World';
import WalkerResponse from '../interfaces/WalkerResponse';

const router = express.Router();

const baseURL = 'http://127.0.0.1:33000';

router.post<WalkerRequest, WalkerResponse>('/start/:name', async (req, res, next) => {
  try {
    const {
      name = '',
    } = req.params;
    
    const world = await World.load();
    const walker = await world.addWalker(name);
    
    if (!walker) {
      return res.json({
        walker,
      });
    }
    
    // TODO: Process events [rte(name)]
    // TODO: Save world [closeworld()]
    
    // TODO: Reset eventId
    // TODO: Start game [special(".g",name)]
    // TODO: Set setup flag [i_setup = 1]
    return res.json({
      walker,
      links: {
        action: `${baseURL}/walk/action?id=${walker.id}&action=wait`,
        messages: `${baseURL}/walk/messages?id=${walker.id}`,
      },
    });          
  } catch (error) {
    next(error);
  }
});

router.get<WalkerRequest, WalkerResponse>('/messages', async (req, res) => {
  const {
    id = '',
  } = req.query;
  
  const world = await World.load();
  const walker = await world.getWalkerById(id as string);

  // TODO: Load messages [pbfr()]
  
  return res.json({
    walker,
  });
});

router.post<WalkerRequest, WalkerResponse>('/action', async (req, res) => {
  const {
    id = '',
  } = req.query;
  // TODO: Get action from query
    
  let world: WorldData;
  try {
    world = await World.load();
  } catch (e) {
    throw new Error('Sorry AberMUD is currently unavailable');
  }
    
  const walker = await world.getWalkerById(id as string);
  
  // TODO: Process action [sendmsg(walker.name)]

  // TODO: Process events [rte(name)] if rd_qd
  // TODO: Save world [closeworld()]
  // TODO: Reset rd_qd

  // TODO: Load messages [pbfr()]
    
  return res.json({
    walker,
  });
});
    
export default router;
