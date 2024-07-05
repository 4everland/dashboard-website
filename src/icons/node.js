const fs = require("fs");
const path = require("path");

const svgFolder = path.join(__dirname, "./drawer");

fs.readdir(svgFolder, (err, files) => {
  if (err) {
    console.error(`Error reading SVG folder: ${err}`);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".svg") {
      const svgFilePath = path.join(svgFolder, file);

      fs.readFile(svgFilePath, "utf8", (err, svgContent) => {
        if (err) {
          console.error(`Error reading SVG file ${file}: ${err}`);
          return;
        }
        const replaced = svgContent.replace(/#344054/g, "currentColor");
        const vueContent = `<template>\n${replaced}\n</template>\n`;

        const outputFileName = path.basename(file, ".svg");
        console.log(outputFileName);
        const newFileName = outputFileName.split("_")[2] + "Icon.vue";
        const outputFilePath = path.join(svgFolder, newFileName);

        fs.writeFile(outputFilePath, vueContent, "utf8", (err) => {
          if (err) {
            console.error(`Error writing Vue file ${outputFileName}: ${err}`);
            return;
          }
          console.log(`Vue file ${outputFileName} successfully generated!`);
        });
      });
    }
  });
});
