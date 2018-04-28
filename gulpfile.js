'use strict'
require('./build/check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./build/webpack.prod.conf')
const gulp = require('gulp')
const zip = require('gulp-zip')
const sftp = require('gulp-sftp')

const build = config.build
const deployPackage = 'app.zip'

/*====================================
 =            clean dist Task        =
 ====================================*/
gulp.task('clean', function (done) {
  rm(build.assetsRoot, err => {
    if (err) throw err
    done()
  })
})

/*====================================
 =            build dist Task        =
 ====================================*/

gulp.task('build', ['clean'], function (done) {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))

    done()
  })
})

/*====================================
 =            zip dist Task        =
 ====================================*/

gulp.task('zip', ['build'], function (done) {
  gulp.src([`${build.assetsRoot}/**`])
    .pipe(zip(deployPackage))
    .pipe(gulp.dest(build.output))
  setTimeout(function() { done() }, 100)
})

/*====================================
 =            publish Task        =
 ====================================*/

gulp.task('publish', ['zip'], function () {
  gulp.src(`${build.output}/${deployPackage}`)
    .pipe(sftp(config.build.sftp))
})

/*====================================
 =            update Task        =
 ====================================*/

gulp.task('upload', function () {
  gulp.src(`${build.output}/${deployPackage}`)
    .pipe(sftp(config.build.sftp))
})
