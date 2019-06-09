import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function hotfix(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    context.logger.debug(JSON.stringify(options));

    const rule = chain([updateTsConfig(context, options)]);

    return rule(host, context);
  };
}

export function updateTsConfig(context: SchematicContext, options: any) {
  return (host: Tree) => {
    var tsConfigFilePath = 'tsconfig.json';

    var tsConfigFile = host.get(tsConfigFilePath);

    var tsConfigJson = tsConfigFile ? JSON.parse(tsConfigFile.content.toString('utf8')) : {};

    context.logger.debug(JSON.stringify(tsConfigJson));

    var pathKeys = Object.keys(tsConfigJson.paths || {});

    pathKeys.forEach(pathKey => {
      context.logger.debug(pathKey);
  
      if (pathKey == options.name) {
        var newPath = pathKey.replace(options.name, `${options.scope}/${options.workspace}-${options.name}`);

        tsConfigJson.paths[newPath] = tsConfigJson.paths[pathKey];

        delete tsConfigJson.paths[pathKey];
      }
    });

    var newTsConfigContent = JSON.stringify(tsConfigJson, null, '\t');

    context.logger.debug(newTsConfigContent);
  
    host.overwrite(tsConfigFilePath, newTsConfigContent);

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.name = options.name || 'common';

  options.target = options.target || 'lcu';

  return host;
}
