export interface ObjectType {
  [key: string]: any;
  [key: number]: any;
}

export function isObject(obj: any): boolean {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  return Array.isArray(obj) ? false : true;
}

export function isEmpty(obj: ObjectType) {
  return Object.keys(obj).length <= 0;
}
