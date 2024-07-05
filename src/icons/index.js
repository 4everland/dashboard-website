const modulesFiles = require.context("./", true, /\.vue$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = {
    component: value.default,
  };
  return modules;
}, {});

export default modules;
