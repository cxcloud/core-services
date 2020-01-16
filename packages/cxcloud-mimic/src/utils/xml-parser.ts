const parser = require('fast-xml-parser');

const defaultOptions = {
  attributeNamePrefix: '', // '@_',
  attrNodeName: '#attr', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  localeRange: '', // To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  arrayMode: false, // 'strict'
  attrValueProcessor: (a: any) => a,
  tagValueProcessor: (a: any) => a,
  stopNodes: ['parse-me-as-string']
};

export const parseXML = <T = any>(options: any = {}, xmlData: string): T => {
  return parser.parse(xmlData, {
    ...defaultOptions,
    ...options
  });
};
