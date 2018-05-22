export interface AttributesHash {
  [key: string]: string;
}

export interface CognitoAttribute {
  Name: string;
  Value: string;
}

export function hashToCognitoAttrs(source: AttributesHash): CognitoAttribute[] {
  return Object.keys(source).map(key => ({
    Name: key,
    Value: source[key]
  }));
}

export function cognitoAttrsToHash(source: CognitoAttribute[]): AttributesHash {
  return source.reduce(
    (list, curr) => {
      return (list = {
        ...list,
        [curr.Name]: curr.Value
      });
    },
    {} as AttributesHash
  );
}
