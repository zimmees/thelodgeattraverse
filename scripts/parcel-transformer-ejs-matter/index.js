const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const matter = require('gray-matter');
const { Transformer } = require('@parcel/plugin');

const SLOTS = {};
const LAYOUTS = {};

function slot(name = '', content = '') {
  const layout = this.layout;
  if (!SLOTS[layout]) SLOTS[layout] = {};
  SLOTS[layout][name] = content;
}

function hasMatter(string = '') {
  return string.indexOf('---') === 0;
}

function readLayout(layoutPath) {
  const modified = fs.statSync(layoutPath).mtime;
  // If layout doesn't exist or has been modified, cache it.
  if (!LAYOUTS[layoutPath]) {
    LAYOUTS[layoutPath] = {
      modified,
      file: matter.read(layoutPath),
    };
  }
  return LAYOUTS[layoutPath].file;
}

function readFile(string = '') {
  if (hasMatter(string)) {
    return matter(string);
  }
  return {
    content: string,
    data: {},
    excerpt: '',
    empty: '',
    isEmpty: true,
  };
}

module.exports = new Transformer({
  async loadConfig({ config }) {
    const configExt = ['.ejsrc', '.ejsrc.json', '.ejsrc.js', 'ejs.config.js'];
    const { contents, filePath } = (await config.getConfig(configExt)) || {};

    if (contents) {
      if (filePath.endsWith('.js')) {
        config.invalidateOnStartup();
      }
      config.invalidateOnFileChange(filePath);
    } else {
      config.invalidateOnFileCreate({
        fileName: configExt,
        aboveFilePath: config.searchPath,
      });
    }

    return contents;
  },
  async transform({ asset, config = {} } = {}) {
    const includes = [];
    const source = await asset.getCode();

    // Validate that config.ejs is an object.
    const ejsConfig = Object.assign(
      {
        compileDebug: false,
        filename: asset.filePath,
        includes,
        includer: (originalPath, parsedPath) => {
          includes.push(parsedPath);
          return {
            filename: parsedPath,
          };
        },
      },
      config.ejs || {}
    );
    const root = ejsConfig.root || '.';

    // Read source file's frontmatter.
    const srcFile = readFile(source);

    // If layout is configured, read layout's frontmatter.
    let layoutFile;
    if (typeof srcFile.data.layout === 'string') {
      const layoutPath = path.join(root, srcFile.data.layout);
      layoutFile = readLayout(layoutPath);
      srcFile.data = Object.assign({}, layoutFile.data, srcFile.data);
      includes.push(layoutPath);
    }

    // Flatten data.
    const slots = SLOTS[srcFile.data.layout] || {};
    const data = Object.assign({}, config.data || {}, srcFile.data, {
      slot,
      slots,
    });

    // Compile source content. This calls any slot() functions to cache the slot content, to be compiled with slot.define() calls in the layout.
    let compiled = ejs.render(srcFile.content, data, ejsConfig);
    if (layoutFile) {
      if (compiled) {
        slot.call(data, 'body', compiled);
        data.slots.body = compiled;
      }
      compiled = ejs.render(layoutFile.content, data, ejsConfig);
      // Reset slots once everything is compiled.
      Object.keys(slots).forEach((key) => {
        slots[key] = null;
      });
    }

    // Update new source code.
    asset.type = 'html';
    asset.setCode(compiled);

    // Invalidate file when includes change.
    for (const include of includes) {
      await asset.invalidateOnFileChange(include);
    }

    return [asset];
  },
});
