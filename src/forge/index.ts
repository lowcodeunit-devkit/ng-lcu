import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function forge(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];

    const targetPath = normalize(project.root + '/src/' + options.path);

    const solutionSource = apply(url('./files/default'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    return chain([
      mergeWith(solutionSource, MergeStrategy.Default)
    ]);
  };
}

function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.path = options.path || 'app';

  options.name = options.name || 'forge';

  options.spec = options.spec || false;

  return host;
}
