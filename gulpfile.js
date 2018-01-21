'use strict';

/**
 * @TODOs:
 * ======
 *  - create task to automate copying of needed bower files that aren't css or js assets (like fonts)
 *  - change config.copy and copy() task to config.assets and assets()
 */

/**
 * SETUP
 * =====
 */
    /** require gulp */
    var gulp = require('gulp');
    /** automated way of loading plugins that begin with specified patterns */
    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'], // the glob(s) to search for
        scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
        replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
        camelize: true, // if true, transforms hyphenated plugins names to camel case
        lazy: true, // whether the plugins should be lazy loaded on demand
        rename: {} // a mapping of plugins to rename
    });
    /** other requires, variables or packages */
    var _ = require('lodash');
    var path = require('path');
    var log = $.util.log;
    var color = $.util.colors;
    var browserSync = require('browser-sync');
    var spawn = require('child_process').spawn;
    var argv = require('yargs').argv;
    var merge = require('merge2');
    var pkg = require('./package.json');


    /** configuration */
    var config = require('./gulp.config')();




/**
 * TASK DEFINITIONS
 * ================
 */
    gulp.task(clean);
    gulp.task(svg);
    gulp.task(images);
    gulp.task(fonts);
    gulp.task('watch', gulp.parallel(watchFiles, watchGulp));
    gulp.task('build', gulp.series(clean, gulp.parallel(gulp.series(gulp.parallel(pug, sass), images), fonts, copy, svg, js)));
    gulp.task('default', gulp.series(clean, 'build', 'watch', serve));




/**
 * ASSETS
 * ======
 */
    /**
     * compile sass to css
     * @return {object} gulp stream
     */
    function sass() {
        var stream = gulp.src(config.sass.src)
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.sass(config.gulpSass))
            .pipe($.autoprefixer(config.autoprefixer));

        if (config.bundleAssets) {
            stream
                .pipe($.if(config.base64.images, $.base64(config.base64.images)))
                .pipe($.if(config.base64.fonts, $.base64(config.base64.fonts)))
                .pipe($.csso())
                .pipe($.rename({ suffix: '.min' }))
                .pipe($.header(config.banner, { package: pkg }));
        }

        stream
            .pipe($.sourcemaps.write(config.sourcemaps))
            .pipe(gulp.dest(config.sass.dest))
            .pipe($.size({
                title: '[css]',
                showFiles: config.logDetails
            }))
            .pipe(browserSync.stream({match: '**/*.css'}));

        return stream;
    }

    /**
     * minify and concatenate js
     * @return {object} gulp stream
     */
    function js() {
        var jshintFilter = $.filter(config.js.jshintFilter, {restore: true});

        return gulp.src(config.js.src)
            .pipe($.plumber())
            .pipe($.if(config.enableJshint && config.js.jshintFilter, jshintFilter))
            .pipe($.if(config.enableJshint, $.jshint('.jshintrc')))
            .pipe($.if(config.enableJshint, $.jshint.reporter('default')))
            .pipe($.if(config.enableJshint && config.js.jshintFilter, jshintFilter.restore))
            .pipe($.if(config.bundleAssets, $.sourcemaps.init()))
            .pipe($.if(config.bundleAssets, $.concat(config.js.name)))
            .pipe($.if(config.bundleAssets, $.uglify()))
            .pipe($.if(config.bundleAssets, $.rename({suffix: '.min'})))
            .pipe($.if(config.bundleAssets, $.header(config.banner, { package : pkg })))
            .pipe($.if(config.bundleAssets, $.sourcemaps.write(config.sourcemaps)))
            .pipe(gulp.dest(config.js.dest))
            .pipe($.size({
                title: '[js]',
                showFiles: config.logDetails
            }));
    }

    /**
     * grab font files and create css
     * @todo decide whether to convert to data uri or include actual font files (or option for both)
     * @return {object} gulp stream
     */
    function fonts() {
        var ttfStream = gulp.src(['./src/fonts/MyriadPro-Light.ttf', './src/fonts/BebasNeue.ttf', './vendor/font-awesome/fonts/*.woff'])
            .pipe($.if('fontawesome-webfont.woff', $.rename('FontAwesome.woff')))
            .pipe($.if('*.otf', $.rename({extname: '.ttf'})))
            .pipe($.ttf2woff())
            .pipe($.font2css.default());
        var woffStream = gulp.src(['./src/fonts/parabola-regular-webfont.woff'])
            .pipe($.font2css.default());
        // var cssStream = gulp.src([]);

        return merge(ttfStream, woffStream)
            .pipe($.base64(config.base64.fonts))
            .pipe($.concat('app-fonts.min.css'))
            .pipe($.header(config.autoFile + config.banner, { package: pkg }))
            .pipe($.csso())
            .pipe($.size({
                title: '[fonts]',
                showFiles: config.logDetails
            }))
            .pipe(gulp.dest('./build/css'));
    }

    /**
     * convert images to multiple, responsive images, and optimize
     * @return {object} gulp stream
     */
    function images() {
        var responsiveConfig = $.responsiveConfig(config.images.responsive.src);

        return gulp.src(config.images.src)
            .pipe($.responsive(responsiveConfig, config.images.responsive.options))
            .pipe($.imagemin(config.imagemin))
            .pipe($.size({
                title: '[images]',
                showFiles: config.logDetails
            }))
            .pipe(gulp.dest(config.images.dest));
    }

    /**
     * convert individual .svg files to single svg sprite and optimize
     * @return {object} gulp stream
     */
    function svg(done) {
        if (!config.svg.src) {
            done();
            return false;
        }

        return gulp.src(config.svg.src)
            .pipe($.plumber())
            .pipe($.svgmin(function (file) {
                var prefix = path.basename(file.relative, path.extname(file.relative));
                return {
                    plugins: [{
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    }]
                }
            }))
            .pipe($.svgstore())
            .pipe($.rename(config.svg.name))
            .pipe(gulp.dest(config.svg.dest))
            .pipe($.size({
                title: '[svg]',
                showFiles: config.logDetails
            }));
    }

    /**
     * copy static assets to destination
     * @return {object} gulp stream
     */
    function copy() {
        var imagesFilter = $.filter('**/*.{jpg,png.gif}', {restore: true});
        return gulp.src(config.copy.src, {base: config.src})
            .pipe($.plumber())
            .pipe($.cached('copy'))
            .pipe($.if(imagesFilter, imagesFilter))
            .pipe($.imagemin(config.imagemin))
            .pipe($.if(imagesFilter, imagesFilter.restore))
            .pipe(gulp.dest(config.copy.dest))
            .pipe($.size({
                title: '[copy]',
                showFiles: config.logDetails
            }))
            .pipe(browserSync.stream({once: true}));
    }

    /**
     * clean: utility to clean up build folder and start fresh
     * @return {object} success / error response
     */
    function clean() {
        if (config.debug) {
            log('Cleaning', color.blue(config.clean), '...');
        }
        return require('del')(config.clean);
    }




/**
 * TEMPLATES
 * =========
 */
    /**
     * compile pug files to html files and optimize
     * @return {object} gulp stream
     */
    function pug() {
        // merge pug.globalData to pug.globalDataProperty
        config.pug.globalData = config.pug.globalData || {};
        var globalData = _.isPlainObject(config.pug.globalData) ? config.pug.globalData : requireIfExists(config.pug.globalData);
        if (config.pug.globalDataProperty) {
            var data = globalData;
            globalData = {};
            globalData[config.pug.globalDataProperty] = data;
        }

        return gulp
            .src(config.pug.pages)
            // report errors
            .pipe($.plumber())
            // grab front matter
            .pipe($.frontMatter({
                property: 'data.frontMatter',
                remove: true
            }))
            // grab and merge data context
            .pipe($.data(function(file) {
                var localData = requireIfExists(path.dirname(file.path) + '/' + path.basename(file.path).split('.')[0] + (config.pug.dataExt || '.data.json'));
                var data = _.merge({}, globalData, localData, file.data.frontMatter);
                if (config.debug) {
                    log('file: ', file);
                    log('data: ', data);
                }
                return data;
            }))
            // compile pug to html
            .pipe($.pug({
                pretty: true,
                // cache: false
            }))
            // minify
            .pipe($.if(config.bundleAssets, $.htmlmin(config.htmlmin)))
            // rename files
            .pipe($.rename(function (path) {
                path.basename = path.basename.split('.')[0];
                path.extname = '.html';
            }))
            // copy to destination
            .pipe(gulp.dest(config.pug.dest))
            .pipe($.size({
                title: '[pug]',
                showFiles: config.logDetails
            }));
    }




/**
 * SERVE
 * =====
 */
    /**
     * serve files and watch for changes
     * @param  {function} done callback from gulp task
     */
    function watchFiles(done) {
        // @TODO: add watchers for images and fonts
        // @TODO: automate watchers?
        // @TODO: add config to enable / disable features (like svg)
        var sassWatcher = gulp.watch(config.watch.sass, sass);
        var jsWatcher = gulp.watch(config.watch.js, gulp.series(js, reload));
        var pugWatcher = gulp.watch(config.watch.pug, gulp.series(pug, reload));
        var assetsWatcher = gulp.watch(config.watch.assets, copy);
        if (config.svg.src) {
            var svgWatcher = gulp.watch(config.watch.svg, gulp.series(svg))
                .on('change', function addNewCssFiles(filePath) {
                    browserSync.notify('Running svg...', 4000);
                })
                .on('add', function addNewAssetFiles(filePath) {
                    svg();
                    log('New SVG:', color.blue(filePath), 'was added.');
                    svgWatcher.add(filePath);
                });
        }
        // var configWatcher = gulp.watch(['./gulpfile.js', './*config.js'], gulp.series('rebuild'));
        // var configWatcher = gulp.watch(['./gulpfile.js', './*config.js'], gulp.series(refreshGulp));

        // change events
        sassWatcher.on('change', function (filePath) {
            browserSync.notify('Compiling sass...', 4000);
        });
        jsWatcher.on('change', function (filePath) {
            browserSync.notify('Optimizing js...', 4000);
        });
        pugWatcher.on('change', function (filePath) {
            browserSync.notify('Compiling pug...', 4000);
        });
        assetsWatcher.on('change', function (filePath) {
            browserSync.notify('Copying assets...', 4000);
        });

        // add events
        sassWatcher.on('add', function (filePath) {
            sassWatcher.add(filePath);
            log(color.blue(filePath), 'was added to the sass watcher.');
        });
        jsWatcher.on('add', function (filePath) {
            jsWatcher.add(filePath);
            log(color.blue(filePath), 'was added to the js watcher.');
        });
        pugWatcher.on('add', function (filePath) {
            pugWatcher.add(filePath);
            log(color.blue(filePath), 'was added to the pug watcher.');
        });
        assetsWatcher.on('add', function (filePath) {
            assetsWatcher.add(filePath);
            log(color.blue(filePath), 'was added to the assets watcher.');
        });

        done();
    }

    /**
     * restart gulp process when gulpfile.js and config changes (https://gist.github.com/tilap/31167027ddee8acbf0e7 and https://github.com/tilap/frast/blob/master/gulpfile.js#L399)
     */
    function watchGulp(done) {
        var gulpProcess;
        gulp.watch(['./gulpfile.js', './*config.js'], function refreshGulp(done) {
            if (gulpProcess) {
                gulpProcess.kill();
            }

            gulpProcess = spawn('gulp', ['build'], {stdio: 'inherit'});

            browserSync.notify('gulp config changed, rebuilding...', 4000);
            log(color.blue('gulp config'), 'has changed. Rebuilding...');

            done();
        });

        done();
    }

    function serve(done) {
        if (browserSync.active) {
            browserSync.reload();
        } else {
            browserSync.init(config.browserSync);
        }
        done();
    }

    function pauseServer(done) {
        if (browserSync) {
            if (config.debug) {
                log('Pausing server...');
            }
            browserSync.pause();
        }
        done();
    }

    function resumeServer(done) {
        if (browserSync) {
            browserSync.resume();
            browserSync.reload();
            if (config.debug) {
                log('Server resumed.');
            }
            browserSync.notify('Watching resumed');
        }
        done();
    }

    // function refreshGulp(done) {
    //     if (config.process) {
    //         config.process.kill();
    //     }
    //     config.process = spawn('gulp', [], {stdio: 'inherit'});
    //     done();
    // }

    /**
     * reload browsersync
     * @param  {callback} done gulp's built in done() callback
     */
    function reload(done) {
        // log('reloading browsersync...', config.server);
        // log('browsersync: ', config.browserSyncProcess);

        // if (config.server) {
        //     config.server.resume();
        //     config.server.reload();
        // }
        browserSync.reload();
        if (done) {
            done();
        }
    }




/**
 * UTILITES
 * ========
 */
    /**
     * return file extension of a path
     * @param  {string|array} pathStringOrArray path(s) for file(s)
     * @return {string} file extension
     */
    function getFileExtension(pathStringOrArray) {
        var filename = path.basename(_.castArray(pathStringOrArray)[0]);
        return filename.substring(filename.indexOf('.'));
    }

    /**
     * require a file only if it exists
     * @param  {string} filePath file path
     * @return {object} file object
     */
    function requireIfExists(filePath) {
        var data = {};
        try {
            data = require(filePath);
        } catch (error) {
            if (error instanceof Error && error.code === "MODULE_NOT_FOUND") {
                if (config.debug) {
                    log('File doesn\'t exist. Skipping', color.blue('require(' + filePath + ');'));
                }
            } else {
                throw error;
            }
        }
        return data;
    }
