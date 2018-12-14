import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function element(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    console.log(options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];
    
    const targetPath = normalize(project.root + '/' + options.path);

    console.log(targetPath);

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    console.log(templateSource.toString())

    return mergeWith(templateSource, MergeStrategy.Default);
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.project = options.project ? options.project :
    workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];

  options.name = options.name || 'element';

  options.spec = options.spec || false;

  return host;
}
