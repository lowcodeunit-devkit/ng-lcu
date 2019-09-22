import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path } from '@angular-devkit/core';
import { addScriptsToPackageFile, adjustValueInPackageFile } from '../utils/helpers';
import { hostname } from 'os';
import { getWorkspace } from "@schematics/angular/utility/config";


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
      adjustPackageValues(options),
      addDeployScripts(),
      addGitIgnore()
    ]);

    return rule(tree, context);
  };
}

/**
 * add .gitignore file
 */
export function addGitIgnore() {
  return (host: Tree) => {

    /** read .gitignore and turn into a string */
    let newGitignore: string = String(host.read('.gitignore'));

    /** add new values to gitignore string 
     * 
     * we can add any values we want, the below is just for testing
    */
    newGitignore += '\n' + '# Mac OSX Finder files' + '\n' + '**/.DS_Store' + '\n' + '.DS_Store' + '\n' + 'test/' + '\n' + 'tester/';

    /** overwrite existing .gitignore with new values */
    host.overwrite('.gitignore', newGitignore);

    return host;
  }
}

export function addDeployScripts() {
  return (host: Tree) => {
    addScriptsToPackageFile(host, [
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

export function adjustPackageValues(options: any) {
  return (host: Tree) => {
    var name = options.scope ? `${options.scope}/${options.workspace}` : options.workspace;

    adjustValueInPackageFile(host, 'name', `"${name}"`);

    adjustValueInPackageFile(host, 'version', `"0.0.1"`);

    adjustValueInPackageFile(host, 'private', "false");

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
