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
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    quietDeps: true, // 抑制依赖包的警告
                    silenceDeprecations: [
                      'import', // 静默import弃用警告
                      'global-builtin', // 静默全局内置函数弃用警告
                      'color-4-api', // 静默颜色API弃用警告
                    ],
                  },
                  additionalData: '@use "sass:math"; @use "sass:string";', // 添加 sass:math 和 sass:string 支持
                },
              }
            ],
          },
        ],
      },
      plugins: [
        TanStackRouterRspack({ target: 'react', autoCodeSplitting: true }),
        new SemiRspackPlugin({
          theme: '@douyinfe/semi-theme-default',
          cssLayer: true
        })
      ],
    },
  },
});
