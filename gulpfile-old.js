'use strict';
/**------------------------------------------------------------
 * SETUP: Variables and require modules.
**------------------------------------------------------------*/
    var gulp = require('gulp'),
        $ = require('gulp-load-plugins')({
            pattern: ['gulp-*', 'gulp.*'], // the glob(s) to search for
            scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
            replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
            camelize: true, // if true, transforms hyphenated plugins names to camel case
            lazy: true, // whether the plugins should be lazy loaded on demand
            rename: {} // a mapping of plugins to rename
        }),
        path = require('path'),
        fs = require('fs'),
        extend = require('extend'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload,
        pagespeed = require('psi');

    // Flags / params passed by user on CLI.
    var flags = $.util.env;
    // Base paths, set by user.
    var base = {};
    // Main configuration object.
    var config = {};
    // To store temporary data.
    config.temp = {};

/**------------------------------------------------------------
 * APP CONFIGURATION
**------------------------------------------------------------*/
    /** SET UP GLOBAL FLAGS (task specific flags are in the task) --------------------*/
    // Set up default / dev environment options.
    config.options = {
        cache: true,
        minify: false
    };
    // Settings for a production build.
    if (flags.P || flags.prod) {
        config.isProduction = true;
        config.env = 'prod';
        config.options.minify = true;
    } else {
        config.isProduction = false;
        config.env = 'dev';
    }
    // Determine whether or not to only process changed files or build ALL of them.
    if (flags.A || flags.all) {config.options.cache = false;}
    // Flag to concat & minify CSS and JS files.
    if (flags.M || flags.min) {config.options.minify = true;}

    /** BASE PATHS ---------------*/
    /**
     *  @desc Base paths used in tasks.
     *  @type {obj}
     *  @prop {str} src Base directory for source files.
     *  @prop {str} dest Base directory where PROD files will be placed and served from.
     *  @prop {str} temp Base directory where some DEV files will be placed and served from.
     */
    var base = {
        src: './src/',
        dest: './dist/',
        temp: './.tmp/'
    };

    /** HTML TASK CONFIG (config.html) ---------------
     *  @desc The HTML task compiles handlebars templates with their data, partials, and helpers, and converts it to HTML pages, with optional optimizations.
     *  @type {obj}
     *  @prop {str|arr.string} src Source files for final HTML pages.
     *  @prop {str} dest Destination folder where PROD files will be placed and served from.
     *  @prop {str|arr.string} data Data for handlebars templates.
     *  @prop {str|arr.string} partials Glob for handlebars partials.
     *  @prop {str|arr.string} helpers Glob for handlebars helpers.
     *  @prop {bool} debugHandlebarData True will log handlebars data, context, partials, and helpers being used for each glob file.
     *  @prop {bool|str} frontMatterProperty Property / prefix to access front matter data inside of templates. This is the file property that is flattened to the template's context.
     *  @prop {bool} bustHandlebarsCache True will force reload handlebars data, helpers, and partials.
     *  @prop {obj} htmlReplace gulp-html-replace settings. Replaces asset references in HTML / template files.
     *  @prop {obj} minifyHtml gulp-minify-html settings.
     *  @prop {obj} size gulp-size settings.
     */
    config.html = {
        src: base.src + 'pages/**/*.hbs',
        dest: base.dest,
        data: base.src + 'data/site.json',
        partials: base.src + '{partials,layouts}/**/*.hbs',
        helpers: ['./node_modules/handlebars-layouts/index.js', './node_modules/helper-markdown/index.js'],
        // flattenData: true,
        debugHandlebarData: false,
        frontMatterProperty: false,
        bustHandlebarsCache: true,
        htmlReplace: {
            'css': 'css/app.min.css',
            'js': 'js/app.min.js'
        },
        minifyHtml: {
            empty: false, // false removes empty attributes
            cdata: false, // false strips CDATA from scripts
            comments: false, // false removes comments
            conditionals: true, // false removes IE conditional comments
            spare: false, // false removes redundant attributes
            quotes: true, // false removes arbitrary quotes
            loose: false // true preserves one whitespace
        },
        size: {
            title: 'html',
            showFiles: true
        }
    };
    /** ASSETS TASK CONFIG (config.assets) ---------------
     *  @desc Assets task grabs asset references from HTML / template files, then runs CSS and JS optimizations and outputs the CSS and JS files.
     *  @type {obj}
     *  @prop {str|arr.string} src HTML / template source files that may have asset references. **IMPORTANT**: Currently only one source per pipeline is supported.
     *  @prop {str} assetsDir Base source directory.
     *  @prop {obj} pipelines Asset pipeline definitions and the functions to run for each pipeline.
     */
    config.assets = {
        src: base.src + 'partials/{_stylesheets,_scripts}.hbs',
        assetsDir: base.src,
        pipelines: {
            // js: scripts,
            // css: styles
        }
    };
    /** STYLES TASK CONFIG (config.styles) ---------------
     *  @desc Runs optimizations on CSS or SASS source files.
     *  @type {obj}
     *  @prop {bool} enableSass true for SASS, false for CSS.
     *  @prop {str|arr.string} src Source files glob.
     *  @prop {str} dest Final directory where PROD files will be placed and served from.
     *  @prop {str} temp Temporary directory where DEV files will be placed and served from.
     *  @prop {str} minifiedFileName Name of minified file.
     *  @prop {obj} sass gulp-sass settings.
     *  @prop {obj} autoprefixer gulp-autoprefixer settings.
     *  @prop {obj} uncss gulp-uncss settings.
     *  @prop {obj} base64 gulp-base64 settings.
     *  @prop {obj} size gulp-size settings.
     */
    config.styles = {
        enableSass: false,
        src: base.src + 'css/**/*.css',
        dest: base.dest + 'css/',
        minifiedFileName: 'app.min.css',
        sass: {
            outputStyle: 'nested', // nested || compressed; libsass doesn't support expanded yet
            precision: 5, // # digits after a decimal
            sourceComments: false, // true enabled debugging info in output file as CSS comments
            outFile: base.dest + 'css', // string || null. Location of output file. Strongly recommended when outputting source maps
            indentedSyntax: false, // true enables sass indented syntax
            includePaths: ['.'], // array of paths to attempt to resolve @import declarations
            onError: console.error.bind(console, 'Sass error:')
        },
        autprefixer: {
            browsers: ['last 2 versions', '> 5% in US']
        },
        uncss: {
            html: [base.dest + 'index.html'],
            ignore: [/.input-msg/] // CSS selectors to ignore
            // ignoreSheets: ['mystyles.css']
            // timeout: 3000
        },
        base64: {
            baseDir: base.dest + 'css/', // Base directory if you use absolute paths.
            // extensions: // extensions to process
            // exclude: [/\.server\.(com|net)\/dynamic\/, '--live.jpg'], // URL patterns to skip
            maxImageSize: 50*1024, // max file size to process
            debug: false // Enable logging to console
        },
        size: {
            title: 'styles',
            showFiles: true
        }
    };
    /** JS TASK CONFIG (config.js) ---------------
     *  @desc Runs optimizations on JS files.
     *  @type {obj}
     *  @prop {str|arr.string} src Source files glob.
     *  @prop {str} dest Final directory where PROD files will be placed and served from.
     *  @prop {str} temp Temporary directory where DEV files will be placed and served from.
     *  @prop {str} minifiedFileName Name of minified file.
     *  @prop {bool} runJsHint Enables JSHint error reporting.
     *  @prop {obj} uglify gulp-uglify settings.
     *  @prop {obj} size gulp-size settings.
     */
    config.js = {
        src: base.src + 'js/**/*.js',
        dest: base.dest + 'js/',
        minifiedFileName: 'app.min.js',
        runJsHint: false,
        uglify: {
            // preserveComments: // 'all' || 'some' || function : Shortcut for options.output.comments.
            // output: {} // Output options [http://lisperator.net/uglifyjs/codegen]
            // compress: {} // Compressor options [http://lisperator.net/uglifyjs/compress]
        },
        size: {
            title: 'js',
            showFiles: true
        }
    };
    /** IMAGES TASK CONFIG (config.images) ---------------
     *  @desc Runs optimizations on images.
     *  @type {obj}
     *  @param {str|arr.string} src Source files glob.
     *  @param {str} dest Destination folder where PROD files will be placed and served from.
     *  @param {obj} imagemin gulp-imagemin settings.
     *  @param {obj} size gulp-size settings.
     */
    config.images = {
        src: base.src + 'images/**/*',
        dest: base.dest + 'images',
        imagemin: {
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        },
        size: {
            title: 'images',
            showFiles: true
        }
    };
    /** COPY TASK CONFIG (config.copy) ---------------
     *  @desc Copies "other" static assets you need to the final destination.
     *  @type {obj}
     *  @param {str|arr.string} src Source files glob for "other" assets / files you need.
     *  @param {str} dest Base destination folder where PROD files will be placed and served from. Destination structure will mimick the structure of the src files.
     *  @param {object} size gulp-size settings.
     */
    config.copy = {
        src: [base.src + '*.*', base.src + 'fonts/**/*', '!**/*.{html*,ftg,DS_Store}'],
        dest: base.dest,
        size: {
            title: 'copy',
            showFiles: true
        }
    };
    /** CLEAN TASK (config.clean) ---------------
     *  @desc Deletes directory / files you specify. **WARNING**: Do NOT put your src directory here. It will delete it.
     *  @type {obj}
     *  @param {str|arr.string} all Files glob to delete when clean task is run on DEV (clean is not automatically run on DEV, you must pass the proper argument or run the clean task itself).
     *  @param {str} prod [optional] If set, clean task will automatically clean these out on PROD. Otherwise it defaults to the DEV settings.
     */
     config.clean = {
        all: [base.dest, base.temp],
        // prod: base.dest + '{css,js}/**/*'
     };
     /** WATCH TASK (config.watch) ---------------
      *  @desc Watches files for changes and reloads the server
      *  @type {obj}
      *  @prop {obj} browserSync BrowserSync plugin settings.
      */
    config.watch = {
        browserSync: {
            browser: ['google chrome'],
            directory: true,
            // files: [config.dest + 'css/*.css', config.dest + 'js/*.js', config.dest + '*.hbs', config.dest + 'images/**/*'],
            // reloadDelay: 1000,
            reloadDebounce: 1000, // Restrict frequency the browser can reload.
            logFileChanges: false,
            notify: true,
            port: 9000,
            startPath: 'index.html',
            server: {
                baseDir: config.isProduction ? base.dest : [base.dest, base.temp]
                // routes: {
                //     './bower_components': 'bower_components'
                // }
            }
        }
    };

/**------------------------------------------------------------
 * CLI TASK DEFINITIONS:
**------------------------------------------------------------*/
    $.util.log('Running in ' + $.util.colors.green(config.env.toUpperCase()) + ' mode: ' + $.util.colors.yellow(JSON.stringify(config.options)) + '.');
    gulp.task(html);
    // gulp.task(styles);
    // gulp.task(scripts);
    gulp.task(images);
    gulp.task(copy);
    gulp.task(clean);
    gulp.task(watch);
    gulp.task('assets', gulp.series(getAssets, gulp.parallel(styles, scripts, images, copy)));
    gulp.task(serve);
    gulp.task('default', gulp.series(clean, html, 'assets', watch));

/**------------------------------------------------------------
 * TASKS FUNCTIONS:
**------------------------------------------------------------*/
    /** HTML / TEMPLATING --------------------*/
        function html() {
            var markdownFiles = $.filter('**/*.md');

            return gulp.src(config.html.src)
                // Log errors
                .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                // Only pass on changed files
                .pipe($.if(config.options.cache, $.newer({dest: config.html.dest, ext: '.html'})))
                // Process handlebars templates & data
                .pipe($.frontMatter({property: config.html.frontMatterProperty || 'frontMatter', remove: true}))
                .pipe($.hb({
                    file: false,
                    debug: config.html.debugHandlebarData,
                    bustCache: config.html.bustHandlebarsCache,
                    dataEach: function (context, file) {
                        if (config.html.frontMatterProperty) {
                            // Flatten front matter with a prefix.
                            context[config.html.frontMatterProperty] = file[config.html.frontMatterProperty];
                        } else {
                            // Flatten front matter into context.
                            extend(true, context, file.frontMatter)
                        }
                        return context;
                    },
                    data: config.html.data, // @TODO: Turn into function to optionally flatten pageData.
                    partials: config.html.partials,
                    helpers: config.html.helpers // @TODO: Add ability (preferably a handlebars helper, but possibly a markdown task) for partials to be markdown files or in markdown format.
                }))
                // Process markdown files
                .pipe(markdownFiles)
                .pipe($.markdown())
                .pipe(markdownFiles.restore())
                // Replace asset references & minify
                .pipe($.if(config.options.minify, $.htmlReplace(config.html.htmlReplace)))
                .pipe($.if(config.options.minify, $.minifyHtml(config.html.minifyHtml)))
                // Rename files to .html and minify
                .pipe($.rename(function (path) {
                    path.basename = path.basename.split('.')[0];
                    path.extname = '.html';
                }))
                // Copy changed files to destination
                .pipe(gulp.dest(config.html.dest))
                .pipe($.size(config.html.size))
                .pipe(reload({stream: true, once: true}));
        }

    /** ASSETS --------------------*/
        function getAssets() {
            // Reset asset globs.
            config.temp.jsFiles = [];
            config.temp.cssFiles = [];
            return gulp.src(config.assets.src)
                .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                .pipe($.spa.html({
                    assetsDir: base.src,
                    pipelines: {
                        js: function (files) {
                            return files
                                .pipe($.tap(function (file) {
                                    config.temp.jsFiles.push(file.path);
                                }));
                        },
                        css: function (files) {
                            return files
                                .pipe($.tap(function (file) {
                                    config.temp.cssFiles.push(file.path);
                                }));
                        }
                    }
                }));
        }
        function styles() {
            if (config.styles.enableSass) {
                return gulp.src(config.styles.src)
                    // Log errors
                    .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                    // Only process changed files
                    .pipe($.if(config.options.cache, $.newer(config.styles.dest)))
                    // Init sourcemaps
                    .pipe($.if(!config.isProduction, $.sourcemaps.init()))
                    // Pre-process SASS
                    .pipe($.sass(config.styles.sass))
                    // Autoprefix
                    .pipe($.postcss([require('autoprefixer-core')(config.autprefixer)]))
                    // Optimize CSS
                    .pipe($.if(config.isProduction, $.uncss(config.styles.uncss)))
                    .pipe($.if(config.isProduction, $.base64(config.styles.base64)))
                    // Minify CSS
                    .pipe($.if(config.options.minify, $.csso()))
                    .pipe($.rename(config.styles.minifiedFileName))
                    // Write sourcemaps
                    .pipe($.if(!config.isProduction, $.sourcemaps.write()))
                    // Copy to destination
                    .pipe(gulp.dest(config.styles.dest))
                    .pipe($.size(config.styles.size))
                    .pipe(reload({stream: true, once: true}));
            } else {
                if (!config.temp.jsFiles) {
                    return $.util.log('\'' + $.util.colors.cyan('config.temp.cssFiles') + '\' is empty. Please re-build and watch to run this task.');
                }
                var destination = config.isProduction ? config.styles.dest : base.temp;
                var srcOptions = config.isProduction ? {} : {base: base.src};
                return gulp.src(config.temp.cssFiles, srcOptions)
                    // Log errors
                    .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                    // Only process changed files
                    .pipe($.if(config.options.cache, $.newer(destination)))
                    // Concatenate styles
                    .pipe($.if(config.options.minify, $.concat(config.styles.minifiedFileName)))
                    // Autoprefix
                    .pipe($.postcss([require('autoprefixer-core')(config.autprefixer)]))
                    // Optimize CSS
                    .pipe($.if(config.isProduction, $.uncss(config.styles.uncss)))
                    .pipe($.if(config.isProduction, $.base64(config.styles.base64)))
                    // Minify CSS
                    .pipe($.if(config.options.minify, $.csso()))
                    .pipe($.if(config.options.minify, $.rename(config.styles.minifiedFileName)))
                    // Copy to destination
                    .pipe(gulp.dest(destination))
                    .pipe($.size(config.styles.size))
                    .pipe(reload({stream: true}));
            }
        }
        function scripts() {
            if (!config.temp.jsFiles) {
                return $.util.log('\'' + $.util.colors.cyan('config.temp.jsFiles') + '\' is empty. Please re-build and watch to run this task.');
            }
            var destination = config.isProduction ? config.js.dest : base.temp;
            var srcOptions = config.isProduction ? {} : {base: base.src};
            return gulp.src(config.temp.jsFiles, srcOptions)
                // Log errors
                .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                // Only process changed files
                .pipe($.if(config.options.cache, $.newer(destination)))
                // JSHint
                .pipe($.if(config.js.runJsHint, $.jshint()))
                .pipe($.if(config.js.runJsHint, $.jshint.reporter('jshint-stylish')))
                // Concatenate & minify
                .pipe($.if(config.options.minify, $.concat(config.js.minifiedFileName)))
                .pipe($.if(config.options.minify, $.uglify(config.js.uglify)))
                // Copy to destination
                .pipe(gulp.dest(destination))
                .pipe($.size(config.js.size))
                .pipe(reload({stream: true, once: true}));
        }

    /** IMAGES --------------------*/
        function images() {
            var srcOptions = {};
            return gulp.src(config.images.src)
                .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                .pipe($.if(config.options.cache, $.newer(config.images.dest)))
                .pipe($.imagemin(config.images.imagemin))
                .pipe(gulp.dest(config.images.dest))
                .pipe($.size(config.images.size))
                .pipe(reload({stream: true}));
        }

    /** COPY --------------------*/
        function copy() {
            return gulp.src(config.copy.src, {
                    dot: true,
                    base: base.src
                })
                .pipe($.plumber({errorHandler: $.notify.onError($.util.colors.red('Error') + ': <%= error.message %>')}))
                .pipe($.if(config.options.cache, $.newer(config.copy.dest)))
                .pipe(gulp.dest(config.copy.dest))
                .pipe($.size(config.copy.size));
        }

    /** WATCH / SERVE --------------------*/
        function watch() {
            config.options.isWatching = true;
            // gulp.watch(config.styles.src, styles).on('change', logChangedFile);
            // gulp.watch(config.js.src, scripts).on('change', logChangedFile);
            // gulp.watch([config.html.src, config.html.partials, config.html.data], html).on('change', logChangedFile);
            // gulp.watch(config.images.src, images).on('change', logChangedFile);
            // gulp.watch(config.copy.src, copy).on('change', logChangedFile);

            gulp.watch(config.styles.src, styles);
            gulp.watch(config.js.src, scripts);
            gulp.watch([config.html.src, config.html.partials, config.html.data], html);
            gulp.watch(config.images.src, images);
            // gulp.watch(config.copy.src, copy);

            browserSync.init(config.watch.browserSync);
        }
        function serve() {
            browserSync.init(config.watch.browserSync);
        }

    /** CLEAN UP --------------------*/
        function clean(done) {
            if (flags._[0] === 'clean' || flags.L || flags.clean) {
                require('del')(config.clean.all, done);
            } else if (config.clean.prod && config.isProduction) {
                require('del')(config.clean.prod, done);
            } else {
                $.util.log('\'' + $.util.colors.cyan('clean') + '\' skipped.');
                done();
            }
        }

    /** LOGGER (for debugging) ---------------*/
        function logFilePath(file) {
            $.util.log(file.path);
        }
        function logChangedFile(event) {
            $.util.log('-----');
            $.util.log('File changed: ' + $.util.colors.yellow(path.relative(base.src, event.path)));
        }
