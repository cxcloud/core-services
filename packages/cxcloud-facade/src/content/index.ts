import { Entry, EntryCollection, Space } from 'contentful';
import { getClient } from './sdk';

export namespace Content {
  export function getEntry(entryId: string, query?: any): Promise<Entry<any>> {
    return getClient()
      .getEntries({ 'sys.id': entryId, ...query })
      .then((res: any) => {
        if (res.total > 0) {
          return res.items[0];
        }
        throw new Error(`Entry with ID: ${entryId} not found.`);
      });
  }

  export function getEntries(query: any): Promise<EntryCollection<any>> {
    return getClient().getEntries(query);
  }

  export function getSpace(): Promise<Space> {
    return getClient().getSpace();
  }
}
