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
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@schematics/angular', 'library', {
        name: options.name,
        entryFile: 'lcu_api',
        prefix: options.prefix,
        skipInstall: true
      }),
      !options.blank ? noop() : blankOutLibrary(host, options.name)
    ]);

    if (!options.skipInstall)
      context.addTask(new NodePackageInstallTask());

    return rule(host, context);
  };
}

function blankOutLibrary(host: Tree, projectName: string) {
  return (host: Tree) => {
    [
      "app.component.html",
      "app.component.spec.ts",
      "app.component.ts",
      "app.module.ts"
    ].forEach(filename => {
      var workspace = getWorkspace(host);

      var project = workspace.projects[projectName];

      var filePath = join(project.root as Path, projectName, filename);

      console.log(filePath);

      if (host.exists(filePath))
        host.delete(filePath);
    });
    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.blank = options.blank || false;

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lib';

  options.skipInstall = options.skipInstall || false;

  return host;
}
