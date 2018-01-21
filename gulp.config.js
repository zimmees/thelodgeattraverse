'use strict';

module.exports = function gulpConfig() {
    var config = {};

    /** features & environment variables */
    config.env = 'dev';
    config.bundleAssets = true;
    config.debug = false;
    config.logDetails = false;

    /** global configuration */
    config.src = './src/';
    config.build = './build/';
    config.temp = './build/';
    config.vendor = './vendor/';
    config.assets = config.build + 'assets/';
    config.sourcemaps = '../maps/'; // relative to the source files
    config.autoFile = '/*! IMPORTANT: This is an auto-generated file. Do not edit or it may mess up the build process. */\n';
    config.banner = [
        '/*!\n' +
        ' * <%= package.name %>\n' +
        ' * <%= package.title %>\n' +
        ' * <%= package.url %>\n' +
        ' * @author <%= package.author %>\n' +
        ' * @version <%= package.version %>\n' +
        ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
        ' */\n'
    ].join('');


    /**
     * task specific configuration
     * @type {object}
     */
    config.pug = {
        pages: config.src + '**/*.html.pug',
        globalData: config.src + 'site.data.json',
        dest: config.build,
        // globalDataProperty: 'site',
        // dataExt: '.json',
    };
    config.sass = {
        src: config.src + 'sass/app.scss',
        dest: config.build + 'css/'
    };
    config.js = {
        name: 'app.js',
        src: [
            './vendor/jquery/dist/jquery.min.js',
            './vendor/moment/min/moment.min.js',
            './vendor/fullcalendar/dist/fullcalendar.js',
            './vendor/fullcalendar/dist/gcal.js',
            './src/js/plugins.js',
            './src/js/main.js',
            './src/js/calendar.js'
        ],
        dest: config.build + 'js/',
        enableJshint: false,
        jshintFilter: 'src/**/*' // this glob of files will be excluded from jshint
    };
    config.fonts = {
        name: 'app-fonts.css',
        src: [
            config.vendor + 'font-awesome/css/font-awesome.css',
            config.vendor + 'WebFont-OpenSans/css/stylesheet.css',
        ],
        dest: config.build + 'fonts/'
    };
    config.images = {
        src: [config.src + 'images/**/*'],
        dest: config.build + 'images/',
        responsive: {
            src: [],
            options: {
                errorOnUnusedConfig: false,
                errorOnUnusedImage: false,
                errorOnEnlargement: false,
                skipOnEnlargement: false,
                withoutEnlargement: true,
                passThroughUnused: true,
                stats: true,
                silent: true,
                quality: 80,
                withMetadata: false
            }
        }
    };
    config.svg = {
        src: false,
        dest: '',
        name: ''
    };
    config.copy = {
        src: [config.src + '*.{png,txt,xml,php}', config.src + '.htaccess', config.src + 'images/**/*', config.src + 'fonts/**/*', config.vendor + 'font-awesome/fonts/**/*', '!**/*.{html*,ftg,DS_Store}'],
        dest: config.build
    };
    config.clean = (config.bundleAssets ? config.build : config.temp) + '**/*';
    config.watch = {
        sass: config.src + '**/*.{scss,css}',
        js: config.js.src,
        pug: config.src + '**/*.pug',
        assets: config.copy.src,
        svg: config.svg.src
    };


    /**
     * plugin configuration
     * @type {object}
     */
    config.htmlmin = {
        removeComments: true,
        ignoreCustomComments: [/build:[\s\S]*?/, /endbuild/],
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseInlineTagWhitespace: true,
        removeTagWhitespace: false,
        useShortDoctype: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true
    };
    config.gulpSass = {
        errLogToConsole: true,
        includePaths: [],
        indentType: 'space', // 'space' | 'tab'
        indentWidth: 2, // number
        outputStyle: 'expanded', // 'nested' | 'expanded' | 'compact' | 'compressed'
        precision: 5, // # of decimals to use
        sourceComments: false, // enable debugging info in output file as comments
    };
    config.autoprefixer = {
        browsers: ['last 2 version', '> 5% in US'],
        cascade: false,
        add: true,
        remove: true,
    };
    config.imagemin = {
        optimizationLevel: 3,
        progressive: false,
        interlaced: false,
        multipass: true
    };
    config.base64 = {};
    config.base64.images = {
        baseDir: config.src + '/assets',
        extensions: ['png', 'gif', 'jpg'],
        // exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 10*1024,
        debug: false
    };
    config.base64.fonts = {
        // baseDir: config.src + '/assets',
        extensions: ['woff'],
        // exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        // maxImageSize: 100*1024,
        debug: false
    };
    config.browserSync = {
        // files: [
        //     config.sass.dest + '**/*.css',
        //     config.js.dest + '**/*.js',
        //     config.pug.dest + '**/*.html',
        //     config.build + 'images/**/*',
        //     config.build + 'fonts/**/*'
        // ],
        // reloadDebounce: 1000,
        notify: {
            styles: [
                'display: none',
                'padding: 6px 10px',
                'font-family: sans-serif',
                'position: fixed',
                'font-size: 0.9em',
                'z-index: 9999',
                'bottom: 0',
                'right: 0',
                'border-top-left-radius: 5px',
                'background-color: rgba(0, 0, 0, .8)',
                'margin: 0',
                'color: white',
                'text-align: center'
            ]
        },
        'server': {
            baseDir: 'build',
            // directory: true,
            index: 'index.html'
        }
    };

    return config;
};
