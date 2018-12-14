import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function pageElement(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const targetPath = (options.flat) ?
      normalize(options.path) :
      normalize(options.path + '/' + strings.dasherize(options.name));

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.project = options.project ? workspace.projects[options.project] :
    workspace.defaultProject ? workspace.projects[<string>workspace.defaultProject] : workspace.projects[0];

  options.name = options.name || 'element';

  return host;
}
