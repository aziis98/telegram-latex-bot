
const path = require('path');
const util = require('util');

const { writeFile, mkdir } = require('fs/promises');
const { exec } = require('child_process');

const RENDER_FOLDER = '.renders';

function runWithTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => setTimeout(() => reject(), timeout)),
    ]);
}

function generateFilename() {
    const random = Math.floor(Math.random() * 10e9).toString();
    return path.join(__dirname, RENDER_FOLDER, random);
}

function renderLatexTemplate(expression, inlineMode) {
    const delimiter = inlineMode ? '$' : '$$';

    return String.raw`
        \documentclass[border=7pt,varwidth]{standalone}
        \usepackage[utf8]{inputenc}
        \usepackage[T1]{fontenc}
        \usepackage{amsmath}
        \usepackage{amssymb}
        \usepackage{mathtools}
        \begin{document}
        ${delimiter}
        ${expression}
        ${delimiter}
        \end{document}
    `.replace(/^\s*/gm, '');
}

module.exports = {
    renderLaTeX: async function (expression) {

        const basenamePath = generateFilename();

        const onlyName = path.basename(basenamePath);

        console.log(`[Renderer] [${onlyName}] Rendering image... `);

        await writeFile(basenamePath + '.tex', renderLatexTemplate(expression), 'utf8');

        const startTime = new Date().getTime();

        try {
            await runWithTimeout(new Promise((resolve, reject) => {

                const SCRIPT = `
                    cd ${RENDER_FOLDER}; 
                    pdflatex 
                        -halt-on-error 
                        "${basenamePath}.tex"; 
                    convert 
                        -density 600 "${basenamePath}.pdf" 
                        -background white 
                        -flatten 
                        -adaptive-resize 50% 
                        -adaptive-resize 75% 
                        "${basenamePath}.png"
                `.replace(/\s+/gm, ' ');

                const renderProcess = exec(SCRIPT, err => {
                    if (err)
                        return reject(err);
                    return resolve();
                });

                renderProcess.stdout.pipe(process.stdout);
                renderProcess.stderr.pipe(process.stderr);

            }), 10e3);
        } catch (e) {
            console.error(`[Renderer] [${onlyName}] Processing took too long!`);

            exec(`cd ${RENDER_FOLDER}; rm -f ${basenamePath}.*`, () => {
                console.log(`[Renderer] [${onlyName}] Immediatly removed tempfiles "${onlyName}.*"`);
            });

            return null;
        } finally {

            const deltaTime = new Date().getTime() - startTime;
            console.log(`[Renderer] [${onlyName}] Processing took ${deltaTime}ms`);

        }

        // Deletes files after 1min
        setTimeout(() => {
            exec(`cd ${RENDER_FOLDER}; rm -f ${basenamePath}.*`, () => {
                console.log(`[Renderer] [${onlyName}] Removed tempfiles "${onlyName}.*"`);
            });
        }, 60e3);

        return basenamePath + '.png';
    }
}