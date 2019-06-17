import { LocalizedString, Reference, Address, CustomFields } from './common';

interface LastModifiedByOrCreatedBy {
  isPlatformClient: boolean;
  user: Reference;
}

export interface Channel extends ChannelDraft {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedByOrCreatedBy;
  createdBy: LastModifiedByOrCreatedBy;
}

export interface ChannelDraft {
  key: string;
  roles: string[];
  name?: LocalizedString;
  description?: LocalizedString;
  address?: Address;
  custom?: CustomFields;
}
