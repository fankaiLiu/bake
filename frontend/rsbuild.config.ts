import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
const {SemiRspackPlugin} = require('@douyinfe/semi-rspack-plugin');

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'bake',
  },
  server: {
    // publicDir: {
    //   name: '../locales',
    //   copyOnBuild: true
    // }
  },
  tools: {
    rspack: {
      module: {
        rules: [
          // {
          //   test: /\.(yml|yaml)$/,
          //   use: 'raw-loader',
          // },
        ],
      },
      plugins: [
        TanStackRouterRspack({ target: 'react', autoCodeSplitting: true }),
        new SemiRspackPlugin({
          cssLayer: true
        })
      ],
    },
  },
});
