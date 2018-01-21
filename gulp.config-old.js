'use strict';

module.exports = function gulpConfig() {
    var config = {};

    /** common directories */
    config.src = './src/';
    config.build = './dist/';
    config.temp = './dist/';


    /** minify & concatenate assets */
    config.bundleAssets = true;
    config.bundleDevFile = true;
    config.debug = false;
    config.dest = config.bundleAssets ? config.build : config.temp;


    /** jade templates */
    config.jade = {
        pages: config.src + '**/*.html.jade',
        partials: config.src + '{partials,components}/**/*.jade',
        globalData: config.src + 'site.data.json',
        dest: config.dest,
        watch: [config.src + '**/*.jade', config.src + 'site.data.json'],
        // globalDataProperty: 'site',
    };


    /** css asset bundle */
    config.css = {
        name: 'app.css',
        src: config.src + 'scss/app.scss',
        dest: config.dest + 'assets/',
        watch: config.src + '**/*.scss',
    };


    /** js asset bundle */
    config.js = {
        name: 'app.js',
        src: [
            config.src + 'vendor/picturefill.min.js',
            config.src + 'partials/lazy-load/lazy-load.js',
            // config.src + 'js/utilities/**/*.js',
            // config.src + 'components/**/*.js',
            config.src + 'js/app.js'
        ],
        dest: config.dest + 'assets/',
        watch: config.src + '**/*.js',
        jshintFilter: '!vendor/**/*'
    };


    /** svg icons */
    config.svg = {
        src: config.src + 'assets/svg/**/*.svg',
        dest: 'assets/svg/icons.svg'
    };


    /** images */
    config.images = {
        src: config.src + '/assets/images/**/*.{png,jpg,gif}',
        responsive: {
            src: [
                config.build + '**/*.html',
                config.build + 'assets/app.min.css'
            ],
            options: {
                errorOnUnusedConfig: false,
                errorOnUnusedImage: false,
                errorOnEnlargement: false,
                skipOnEnlargement: false,
                withoutEnlargement: true,
                passThroughUnused: false,
                stats: false,
                quality: 80,
                withMetadata: false
            }
        }
    };


    /** files & folders to copy to build */
    config.copy = [
        config.src + 'assets/fonts/**/*.woff',
        config.src + 'assets/images/apple-touch-icon.png',
        config.src + 'assets/images/property__63-center-2.jpg',
        config.src + 'assets/images/property-map.jpg',
        config.src + 'favicon.ico'
    ];


    /** files & folders to clean */
    config.clean = (config.bundleAssets ? config.build : config.temp) + '**/*';


    /** top banner insert for final css and js files */
    config.banner = [
        '/*!\n' +
        ' * <%= package.name %>\n' +
        ' * <%= package.title %>\n' +
        ' * <%= package.url %>\n' +
        ' * @author <%= package.author %>\n' +
        ' * @version <%= package.version %>\n' +
        ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
        ' */',
        '\n'
    ].join('');


    /** gulp-sass plugin */
    config.gulpSass = {
        errLogToConsole: true,
        includePaths: [],
        indentType: 'space', // 'space' | 'tab'
        indentWidth: 2, // number
        outputStyle: 'expanded', // 'nested' | 'expanded' | 'compact' | 'compressed'
        precision: 5, // # of decimals to use
        sourceComments: false, // enable debugging info in output file as comments
    };
    /** gulp-autoprefixer plugin */
    config.autoprefixer = {
        browsers: ['last 2 version', '> 5% in US'],
        cascade: false,
        add: true,
        remove: true,
    };
    /** gulp-htmlmin plugin */
    config.htmlmin = {
        removeComments: Boolean(config.env === 'prod'),
        ignoreCustomComments: [/build:[\s\S]*?/, /endbuild/],
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseInlineTagWhitespace: true,
        removeTagWhitespace: true,
        useShortDoctype: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true
    };
    /** gulp-imagemin plugin */
    config.imagemin = {
        optimizationLevel: 3,
        progressive: false,
        interlaced: false,
        multipass: true
    };
    /** gulp-base64 plugin */
    config.base64 = {
        images: {
            baseDir: config.src + '/assets',
            extensions: ['png', 'gif', 'jpg'],
            // exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 10*1024,
            debug: false
        }
        // fonts: {
        //     baseDir: config.src + '/assets',
        //     extensions: ['woff', 'ttf'],
        //     // exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        //     maxImageSize: 100*1024,
        //     debug: false
        // }
    };

    return config;
};
