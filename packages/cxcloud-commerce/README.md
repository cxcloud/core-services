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
+ Search (Powered by [Algolia](https://algolia.com))
+ Authentication (Powered by [AWS Cognito](https://aws.amazon.com/cognito/))
  - Login (Normal, MFA)
  - Registration
  - Edit Profile and Phone Number
  - Session Update
  - Password Forgot, Reset, Change
  - Get Profile

## Documentation

An automatically generated documentation can be found [here](https://cxcloud.github.io/core-services/).

## Config Schema

Using this module requires configuration. You can do so by installing [node-config](lorenwest/node-config) in your project and setting up the following keys one of your json files:

```json
{
  "commerceTools": {
    "projectKey": "PROJECT_KEY",
    "admin": {
      "clientId": "ADMIN_CLIENT_ID",
      "clientSecret": "ADMIN_CLIENT_ID"
    },
    "user": {
      "clientId": "USER_FACING_CLIENT_ID",
      "clientSecret": "USER_FACING_CLIENT_SECRET"
    }
  },
  "contentful": {
    "sdkConfig": {
      "space": "SPACE_ID",
      "accessToken": "ACCESS_TOKEN"
    }
  },
  "algolia": {
    "applicationId": "APP_ID",
    "apiKey": "API_KEY"
  },
  "cognito": {
    "userPoolId": "USER_POOL_ID",
    "clientId": "CLIENT_ID"
  }
}
```

## License

This project is licensed under [The GPL v2](LICENSE) and is released merely for educational and internal purposes. The modules are not useful independently and require paid licenses from the vendors mentioned above.
