import { Categories } from './';

// Products.getProductsBySearchQuery('New test product').then(res => console.log(res.results));
// Products.findById('5e00f2b3-d098-4b6b-82f8-895d91be9c79').then(res => console.log(JSON.stringify(res)));
Categories.fetchAll().then(res => console.log(JSON.stringify(res, undefined, 2)));
