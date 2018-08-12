import { LocalizedString, Reference } from './common';

export interface State {
  id: string;
  version: number;
  key: string;
  type: string;
  roles: any[];
  name: LocalizedString;
  description: LocalizedString;
  builtIn: boolean;
  transitions: Reference[];
  initial: boolean;
  createdAt: string;
  lastModifiedAt: string;
}
