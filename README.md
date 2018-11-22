# CX Cloud Core Services

A collection of ready made core services to work with 3rd Party and Partner services & networks. This is a monorepo and the packages living inside `packages` directory are published separately.

An example of implementation can be found in [CX API Demo](https://github.com/cxcloud/demo-api).

### Included Bundles

- Commerce (Powered by [CommerceTools](https://commercetools.com)) `@cxcloud/commerce`
  - Products
  - Categories
  - Shipping
  - Carts
  - Orders
  - Customers
  - Authentication
- Content (Powered by [Contentful](https://contentful.com)) `@cxcloud/content`
  - Entry
  - Entries
  - Space Info
- Search (Powered by [Algolia](https://algolia.com)) `@cxcloud/search`
- Authentication (Powered by [AWS Cognito](https://aws.amazon.com/cognito/)) `@cxcloud/auth`
  - Login (Normal, MFA)
  - Registration
  - Edit Profile and Phone Number
  - Session Update
  - Password Forgot, Reset, Change
  - Get Profile

## Generate Core Services with CX cloud CLI

CX Cloud CLI Tools allows you to generate core services to test the concept using angular or react demos or utilise capabilities of CX Cloud platform in new project. CLI also allow to set up a Kubernetes cluster, generate required service and deploy it there.Read more how to generate and deploy core services using CX Cloud CLI [here](https://docs.cxcloud.com/setting-up-a-cxcloud-project/generating-core-services).

## Local test

After generation and configuration are done, the generated service can be tested locally. More information about it [here](https://docs.cxcloud.com/setting-up-a-cxcloud-project/generating-core-services#local-test) 


## License

This project is licensed under [The GPL v2](LICENSE) and is released merely for educational and internal purposes. The modules are not useful independently and require paid licenses from the vendors mentioned above.
