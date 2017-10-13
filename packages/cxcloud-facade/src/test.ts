import { execute, services, types } from './tools/sdk';

// const channelsUri = services.categories.perPage(1).build();
const channelsUri = services.categories.byId('17b05fb9-6f84-4129-948f-05e9521dcabd');

execute(channelsUri, types.GET)
  .then((result: any) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.log(error);
  });
