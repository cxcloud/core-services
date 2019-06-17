import { JSONValue } from './common';

export interface CustomObjectDraft {
  container: string;
  key: string;
  value: JSONValue;
  version?: number;
}

export interface CustomObject extends CustomObjectDraft {
  id: string;
  version: number;
  createAt: string;
  lastModifiedAt: string;
}
