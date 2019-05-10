import { LocalizedString, Reference } from './common';

interface LastModifiedByOrCreatedBy {
  isPlatformClient: boolean;
  user: Reference;
}

export interface Channel {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedByOrCreatedBy;
  createdBy: LastModifiedByOrCreatedBy;
  key: string;
  roles: string[];
  name: LocalizedString;
}
