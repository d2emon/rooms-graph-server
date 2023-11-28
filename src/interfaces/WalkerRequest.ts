import { Request } from 'express';
import { Query } from 'express-serve-static-core';

interface WalkerRequestQuery extends Query {
  walkerId?: string;
}

export interface WalkerRequest extends Request {
  name?: string;
  query: WalkerRequestQuery;
}
