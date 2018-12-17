import { NodeDependencyType } from './../utils/helpers';
import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path } from '@angular-devkit/core';
import { addDeployScriptsToPackageFile, addPackageJsonDependency } from '../utils/helpers';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options.repository = options.repository || options.repo;

    const templateSource = apply(url('./files/project'), [
      template({
        ...strings,
        ...options,
      }),
      move('./'),
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Default),
      addDeployScripts()
    ]);

    return rule(tree, context);
  };
}

export function addDeployScripts() {
  return (host: Tree) => {
    addDeployScriptsToPackageFile(host, [
      {
        key: 'deploy',
        value: `npm version patch && npm run deploy:all`
      },
      {
        key: 'deploy:all',
        value: ``
      },
    ]);

    return host;
  };
}

// function addDependencies(options: any) {
//   return (host: Tree) => {
//     [{
//       type: NodeDependencyType.Default,
//       name: '@lcu/common',
//       version: '^2.0.8'
//     }].forEach(dependency => addPackageJsonDependency(host, dependency));

//     return host;
//   };
// }
