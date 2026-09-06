const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Custom plugin to safely copy index.html into media/lineageViewer/
 * @type {import('esbuild').Plugin}
 */
const copyLineageHtmlPlugin = {
  name: 'copy-lineage-html-plugin',
  setup(build) {
    build.onEnd(() => {
      try {
        const srcHtml = path.join(__dirname, 'lineageViewerTS', 'index.html');
        const destDir = path.join(__dirname, 'media', 'lineageViewer');
        const destHtml = path.join(destDir, 'index.html');

        fs.mkdirSync(destDir, { recursive: true });

        const srcContent = fs.readFileSync(srcHtml, 'utf8');

        // Only overwrite if file doesn't exist or content changed (prevents watch loops)
        if (!fs.existsSync(destHtml) || fs.readFileSync(destHtml, 'utf8') !== srcContent) {
          fs.writeFileSync(destHtml, srcContent, 'utf8');
          console.log('[build] Copied index.html -> media/lineageViewer/index.html');
        }
      } catch (err) {
        console.error('[build] Failed to copy index.html:', err);
      }
    });
  }
};
const copyContextHtmlPlugin = {
  name: 'copy-context-html-plugin',
  setup(build) {
    build.onEnd(() => {
      try {
        const srcHtml = path.join(__dirname, 'contextViewerTS', 'index.html');
        const destDir = path.join(__dirname, 'media', 'contextViewer');
        const destHtml = path.join(destDir, 'index.html');

        fs.mkdirSync(destDir, { recursive: true });

        const srcContent = fs.readFileSync(srcHtml, 'utf8');

        // Only overwrite if file doesn't exist or content changed (prevents watch loops)
        if (!fs.existsSync(destHtml) || fs.readFileSync(destHtml, 'utf8') !== srcContent) {
          fs.writeFileSync(destHtml, srcContent, 'utf8');
          console.log('[build] Copied index.html -> media/contextViewer/index.html');
        }
      } catch (err) {
        console.error('[build] Failed to copy index.html:', err);
      }
    });
  }
};

/**
 * Creates a problem matcher plugin for VS Code error highlighting
 * @param {string} label
 * @returns {import('esbuild').Plugin}
 */
const createProblemMatcherPlugin = (label) => ({
    name: `esbuild-problem-matcher-${label}`,

    setup(build) {
        build.onStart(() => {
            console.log(`[watch] ${label} build started`);
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location) {
                    console.error(`    ${location.file}:${location.line}:${location.column}:`);
                }
            });
            console.log(`[watch] ${label} build finished`);
        });
    },
});

async function main() {
    // 1. Extension Backend Context (Node.js / CJS)
    const extensionCtx = await esbuild.context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        outfile: 'dist/extension.js',
        external: ['vscode'],
        logLevel: 'silent',
        plugins: [
            createProblemMatcherPlugin('extension'),
        ],
    });

    // 2. Lineage Viewer Webview Context (Browser / IIFE)
    const webviewCtx = await esbuild.context({
        entryPoints: ['lineageViewerTS/src/main.ts'],
        bundle: true,
        format: 'iife',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'browser',
        outfile: 'media/lineageViewer/index.js',
        logLevel: 'silent',
        plugins: [
            copyLineageHtmlPlugin,
            createProblemMatcherPlugin('lineageViewer'),
        ],
    });

    // 2. Context Viewer Webview Context (Browser / IIFE)
    const webviewContextCtx = await esbuild.context({
        entryPoints: ['contextViewerTS/src/main.ts'],
        bundle: true,
        format: 'iife',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'browser',
        outfile: 'media/contextViewer/index.js',
        logLevel: 'silent',
        plugins: [
            copyContextHtmlPlugin,
            createProblemMatcherPlugin('contextViewer'),
        ],
    });

    if (watch) {
        await Promise.all([
            extensionCtx.watch(),
            webviewCtx.watch(),
            webviewContextCtx.watch()
        ]);
    } else {
        await Promise.all([
            extensionCtx.rebuild(),
            webviewContextCtx.rebuild(),
            webviewCtx.rebuild()
        ]);
        await Promise.all([
            extensionCtx.dispose(),
            webviewContextCtx.dispose(),
            webviewCtx.dispose()
        ]);
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});