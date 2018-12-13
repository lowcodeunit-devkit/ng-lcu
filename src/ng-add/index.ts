import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path } from '@angular-devkit/core';
import { addScriptIntoPackageJson } from '../utils/helpers';


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
      addDeployScriptsToPackageFile(options) 
    ]);

    return rule(tree, context);
  };
}

function addDeployScriptsToPackageFile(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
  
    var project = workspace.projects[options.name];

    var projectSafeName = strings.dasherize(options.name);
    
    [
      {
        key: 'deploy',
        value: `npm version patch && npm run deploy:all`
      },
      {
        key: 'deploy:all',
        value: `npm run deploy:${projectSafeName}`
      },
      {
        key: `deploy:${projectSafeName}`,
        value: `npm version patch --prefix ${project.root} && ng build ${projectSafeName} && npm publish ./dist/${projectSafeName} --access public`
      }
    ].forEach(script => {
      addScriptIntoPackageJson(host, script);
    });

    return host;
  };
}
