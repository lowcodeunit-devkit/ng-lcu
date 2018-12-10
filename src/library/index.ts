import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain, externalSchematic } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';

// function buildDefaultLibrary(path: Path) {
//   return (host: Tree) => {
//     [
//       "app.component.html",
//       "app.component.spec.ts",
//       "app.component.ts",
//       "app.module.ts"
//     ].forEach(filename => {
//       var filePath = join(path, filename);

//       if (host.exists(filePath))
//         host.delete(filePath);
//     });

//     return host;
//   };
// }

export function library(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);

    const rule = chain([
      externalSchematic('@schematics/angular', 'library', {
        name: options.name,
        entryFile: 'lcu_api',
        prefix: options.prefix,
        skipInstall: true
      })
    ]);

    if (!options.skipInstall)
      context.addTask(new NodePackageInstallTask());

    return rule(tree, context);
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lib';

  options.skipInstall = options.skipInstall || false;

  return host;
}
