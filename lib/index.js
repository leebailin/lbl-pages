const { src, dest, parallel, series, watch } = require('gulp')
const loadPlugin = require('gulp-load-plugins')
const plugins = loadPlugin()

const del = require('del')

const browserSync = require('browser-sync')
const bs = browserSync.create()

const cwd = process.cwd()
const path = require('path')
let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}

function deepObjectMerge(FirstOBJ, SecondOBJ) {
  for (let key in SecondOBJ) {
    if(SecondOBJ.hasOwnProperty(key)) {
      FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
        deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
    }
  }
  return FirstOBJ;
}

try {
  const loadConfig = require(path.join(cwd, 'pages.config.js'))
  config = deepObjectMerge(config, loadConfig)
} catch (e) { }


const style = () => {
  // base 选项定义转换是的基准路径，也就是保留 src 原目录结构
  return src(config.build.paths.styles, {
    base: config.build.src,
    cwd: config.build.src
  })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src(config.build.paths.scripts, {
    base: config.build.src,
    cwd: config.build.src
  })
    // .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    // 修改在外部项目找不到模块的问题
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const page = () => {
  // 如果其他文件夹下的子目录有 html 文件需要编译的话 可以使用 ‘src/**/*.html’
  // 这个项目我们只需要编译 src 目录下的 html 文件，src 下的其他目录的 html 文件只是通过模板语法引入到主文件使用，不需要编译到目标目录下
  // 所以只需要 ‘src/*.html’
  return src(config.build.paths.pages, {
    base: config.build.src,
    cwd: config.build.src
  })
    .pipe(plugins.swig({
      data: config.data,
      defaults: { cache: false }
    })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src(config.build.paths.images, {
    base: config.build.src,
    cwd: config.build.src
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, {
    base: config.build.src,
    cwd: config.build.src
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', { base: config.build.public, cwd: config.build.public })
    .pipe(dest(config.build.dist))
}

const clean = () => {
  return del([config.build.dist, config.build.temp])
}

const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts, { cwd: config.build.src }, script)
  watch(config.build.paths.pages, { cwd: config.build.src }, page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src }, async () => {
    await bs.reload()
  })

  watch('**', { cwd: config.build.public }, async () => await bs.reload())

  bs.init({
    notify: false, // 启动页面时右上角的提示
    port: 2080, // 设置本地服务器端口
    // files: 'dist/**', // 监听目标目录下所有文件修改后自动更新浏览器
    server: {
      // 服务器根目录（构建后的目录）
      baseDir: [config.build.temp, config.build.src, config.build.public],
      // 处理第三方库文件（因为我们还未处理第三方库到我们的 dist 目录下，比如 bootstrap，jquery）
      routes: {
        // 请求的前缀       目录
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src(config.build.paths.pages, {
    base: config.build.temp,
    cwd: config.build.temp
  })
    // 在 temp 和 根目录寻找需要合并的文件
    // 对应 temp 下的 assets/styles/main.css 和 根目录下的 /node_modules
    .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest(config.build.dist))
}

// const compile = parallel(style, script, page, image, font)
const compile = parallel(style, script, page)

const develop = series(compile, serve)

// 上线之前执行的任务
// const build = series(
//   clean,
//   parallel(compile, image, font, extra)
// )
const build = series(
  clean,
  parallel(
    // 构建 html css js 到 temp 目录 再 执行 useref 任务
    series(compile, useref),
    image,
    font,
    extra
  )
)

module.exports = {
  clean,
  build,
  develop
}

