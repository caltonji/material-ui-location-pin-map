/** @type { import('@storybook/react-vite').StorybookConfig } */
import { viteStaticCopy } from 'vite-plugin-static-copy';

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    // Add a plugin to process geojson files
    config.plugins.push({
      name: "vite-geojson-loader",
      transform(src, id) {
        if (id.endsWith(".geojson")) {
          return {
            code: `export default ${JSON.stringify(JSON.parse(src))};`,
            map: null,
          };
        }
      },
    });

    // Optionally, use static copy plugin to include geojson files in the build
    config.plugins.push(
      viteStaticCopy({
        targets: [
          {
            src: "./src/**/*.geojson",
            dest: "",
          },
        ],
      })
    );

    return config;
  },
};

export default config;
