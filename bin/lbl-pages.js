#!/usr/bin/env node

// 指定当前命令行所在的目录（执行 lbl-pages 的项目根目录）作为工作目录
process.argv.push('--cwd')
process.argv.push(process.cwd())

// 指定 gulpfile 路径
process.argv.push('--gulpfile')
// 对于这个项目直接传入 .. 就可以了
// 它会自动去找 package.json 的 main 字段 "main": "lib/index.js",
process.argv.push(require.resolve('..'))

require('gulp/bin/gulp')
