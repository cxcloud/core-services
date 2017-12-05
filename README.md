# CX Cloud Core Services

A collection of tools to work with 3rd Party and Partner services & networks. This module is meant to be used in creating commerce services.

An example of implementation can be found in [CX API Accelerator](https://github.com/cxcloud/api-accelerator).

## Installation and Usage

```sh
npm install @cxcloud/core
```

```js
import { Commerce, Content } from '@cxcloud/core';
import { Cart } from '@cxcloud/core/dist/commerce';
```

## Included Bundles

+ Commerce (Powered by [CommerceTools](https://commercetools.com))
  - Products
  - Categories
  - Shipping
  - Carts
  - Orders
  - Customers
  - Authentication
+ Content (Powered by [Contentful](https://contentful.com))
  - Entry
  - Entries
  - Space Info

## Documentation

An automatically generated documentation can be found [here](https://cxcloud.github.io/core-services/).

## License

This project is licensed under [The GPL v2](LICENSE) and is released merely for educational and internal purposes. The modules are not useful independently and require paid licenses from the vendors mentioned above.
