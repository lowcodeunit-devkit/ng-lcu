import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  noop,
  filter,
  move,
  MergeStrategy,
  mergeWith,
  template,
  chain,
  externalSchematic
} from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';
import { addDeployScriptsToPackageFile, removeFilesFromRoot } from '../utils/helpers';
import { Logger } from '@angular-devkit/core/src/logger';

export function lcu(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@lowcodeunit-devkit/ng-lcu', 'application', {
        name: 'lcu',
        initWith: 'Blank'
      }),
      externalSchematic('@lowcodeunit-devkit/ng-lcu', 'library', {
        name: 'common',
        initWith: 'Blank'
      }),
      externalSchematic('@lowcodeunit-devkit/ng-lcu', 'application', {
        name: 'demo',
        initWith: 'Default'
      }),
      addScripts(options),
      manageAppAssets(options)
    ]);

    if (!options.skipInstall) context.addTask(new NodePackageInstallTask());

    return rule(host, context);
  };
}

export function addScripts(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    var project = workspace.projects[options.name];

    var projectSafeName = strings.dasherize(options.name);

    addDeployScriptsToPackageFile(host, [
      {
        key: `deploy:${projectSafeName}`,
        value: `ng build ${projectSafeName} --prod && npm publish ./dist/${projectSafeName} --access public`
      }
    ]);

    return host;
  };
}

export function manageAppAssets(options: any) {
  return (host: Tree) => {
    var projectSafeName = strings.dasherize(options.name);

    var packageGlob = {
      glob: 'package.json',
      input: `./projects/${projectSafeName}/`,
      output: '/'
    };

    var angularFile = host.get('angular.json');

    var angularJson = angularFile ? JSON.parse(angularFile.content.toString('utf8')) : {};

    angularJson.projects[projectSafeName].architect.build.options.assets.push(packageGlob);

    host.overwrite('angular.json', JSON.stringify(angularJson, null, '\t'));

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  return host;
}
