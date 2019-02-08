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
      externalSchematic('@schematics/angular', 'module', {
        name: `${options.workspace}`,
        project: 'common',
        flat: true
      }),
      externalSchematic('@schematics/angular', 'module', {
        name: `${options.workspace}-wc`,
        project: 'lcu',
        flat: true
      }),
      host => {
        context.logger.debug('External schematics run');
      },
      // configureDefaults(options, context)
      // addScripts(options),
    ]);

    return rule(host, context);
  };
}

export function addScripts(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    addDeployScriptsToPackageFile(host, []);

    return host;
  };
}

export function configureDefaults(options: any, context: SchematicContext) {
  return (host: Tree) => {
    context.logger.info('Configuring defaults');

    // updatePackageJsonName(host, context, 'common', options, '');

    // updateTsConfig(host, 'common', options);

    // createPackageJson(host, 'lcu');

    // updatePackageJsonName(host, context, 'lcu', options, 'lcu');

    // createPackageJson(host, 'demo');

    // updatePackageJsonName(host, context, 'demo', options, 'demo');

    //  TODO: Need to export NG Module from lcu.api.ts in common

    return host;
  };
}

export function createPackageJson(host: Tree, project: string) {
  var packageFilePath = `projects\\${project}\\package.json`;

  var packageJson = {
    name: project,
    version: '0.0.1',
    peerDependencies: {
      '@angular/common': '^7.2.0',
      '@angular/core': '^7.2.0'
    }
  };

  host.overwrite(packageFilePath, JSON.stringify(packageJson, null, '\t'));
}

export function updatePackageJsonName(host: Tree, context: SchematicContext, project: string, options: any, variant: string = '') {
  var packageFilePath = `projects/${project}/package.json`;

  var packageFile = host.get(packageFilePath);

  context.logger.info(packageFile ? packageFile.content.toString('utf8') : 'No Package File');

  try {
    if (packageFile) {
      var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

      packageJson.name = `${options.scope}/${options.workspace}${variant}`;

      host.overwrite(packageFilePath, JSON.stringify(packageJson, null, '\t'));
    }
  } catch (err) {
    context.logger.error(err);
  }
}

export function updateTsConfig(host: Tree, project: string, options: any) {
  var tsConfigFilePath = 'tsconfig.json';

  var tsConfigFile = host.get(tsConfigFilePath);

  var tsConfigJson = tsConfigFile ? JSON.parse(tsConfigFile.content.toString('utf8')) : {};

  var pathKeys = Object.keys(tsConfigJson.paths);

  pathKeys.forEach(pathKey => {
    var newPath = pathKey.replace(project, `${options.scope}/${options.workspace}`);

    tsConfigJson.paths[newPath] = tsConfigJson.paths[pathKey];

    delete tsConfigJson.paths[pathKey];
  });

  host.overwrite(tsConfigFilePath, JSON.stringify(tsConfigJson, null, '\t'));
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  console.log(lcuJson);

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  console.log(options);

  return host;
}
