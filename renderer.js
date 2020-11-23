
const path = require('path');
const util = require('util');

const { writeFile } = require('fs/promises');
const exec = util.promisify(require('child_process').exec);

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

        const basename = generateFilename();
        console.log(`[${basename}.tex] Rendering image... `);

        await writeFile(basename + '.tex', renderLatexTemplate(expression), 'utf8');

        const startTime = new Date().getTime();

        try {
            await runWithTimeout(exec(
                `cd ${RENDER_FOLDER}; pdflatex -halt-on-error "${basename}.tex"; convert -density 600 "${basename}.pdf" -background white -flatten -adaptive-resize 50% -adaptive-resize 75% "${basename}.png"`),
                10e3
            );
        } catch (e) {
            console.error('Processing took too long!');
        }
        
        const deltaTime = new Date().getTime() - startTime;
        console.log(`Processing took ${deltaTime}ms`);

        exec(`cd ${RENDER_FOLDER}; rm ${basename}.*`).then(() => {
            console.log(`Removed tempfiles "${basename}.*"`);
        });

        return basename + '.png';
    }
}