import alias from '@rollup/plugin-alias';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/vue-multipane.js',
    format: 'umd',
    name: 'Multipane',
    sourcemap: true,
  },
  plugins: [
    alias({
      '@': './',
    }),
    vue({
      css: true,
    }),
    buble(),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs(),
  ],
};
