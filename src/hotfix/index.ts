import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function hotfix(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    context.logger.info(JSON.stringify(options));

    const rule = chain([]);

    return rule(host, context);
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
