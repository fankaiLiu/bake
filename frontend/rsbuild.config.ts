import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

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
    },
  },
});
