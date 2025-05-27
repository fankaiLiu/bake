import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
const {SemiRspackPlugin} = require('@douyinfe/semi-rspack-plugin');

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'bake',
  },
  server: {
    publicDir: {
      name: '../locales',
      copyOnBuild: true
    }
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.(yml|yaml)$/,
            use: 'raw-loader',
          },
        ],
      },
      plugins: [
        new SemiRspackPlugin({
          cssLayer: true
        })
      ],
    },
  },
});
