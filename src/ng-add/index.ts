import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path } from '@angular-devkit/core';
import { addScriptsToPackageFile, adjustValueInPackageFile } from '../utils/helpers';
import { hostname } from 'os';


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
      updateGitIgnore(context)
    ]);

    return rule(tree, context);
  };
}

export function updateGitIgnore(context: SchematicContext) {
  return (host: Tree) => {

    let gitignore = host.get('.gitignore');
    let parsedGitignore;

    if (gitignore) {
      // parsedGitignore = JSON.parse(gitignore.content.toString('utf8'));
      // context.logger.info(`Shannon 1 parsed gitignore: ${parsedGitignore}`);
    }
    

    let gitignoreString: string = JSON.stringify(gitignore);

    const txt = '\n this is a test \n';

    // deployAll += ` && ${deployProj}`;
    gitignoreString += `&& ${txt}`;
  
    const fs = require('fs');
    const parse = require('parse-gitignore');

    context.logger.info(`Shannon - parser: ${parse(fs.readFileSync(host.get('.gitignore')))}`);

    // let gitignoreChange = JSON.parse(gitignoreString);

    // host.exists('.gitignore');
    context.logger.info(`Shannon parsed gitignore: ${host.get('.gitignore')}`);
    context.logger.info(`Shannon .gitignore: ${gitignoreString}`);
    host.overwrite('.gitignore', JSON.stringify(gitignoreString, null, '\t'));

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
