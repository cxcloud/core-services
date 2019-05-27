import { LocalizedString, Reference } from './common';

export type StateType =
  | 'OrderState'
  | 'LineItemState'
  | 'ProductState'
  | 'ReviewState'
  | 'PaymentState';

export type StateRole = 'ReviewIncludedInStatistics' | 'Return';

export interface State {
  id: string;
  version: number;
  key: string;
  type: StateType;
  roles: StateRole[];
  name: LocalizedString;
  description: LocalizedString;
  builtIn: boolean;
  transitions: Reference[];
  initial: boolean;
  createdAt: string;
  lastModifiedAt: string;
}

export interface StateDraft {
  key: string;
  type: StateType;
  name?: LocalizedString;
  description?: LocalizedString;
  initial?: boolean;
  roles?: StateRole[];
  transitions: Reference[];
}
