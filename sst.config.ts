import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "nextjs-generative-ui",
      region: "eu-north-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "nextjs-generative-ui-site");

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
