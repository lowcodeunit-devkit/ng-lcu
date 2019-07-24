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
  externalSchematic,
  schematic
} from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';
import { addScriptsToPackageFile, removeFilesFromRoot } from '../utils/helpers';
import { Logger } from '@angular-devkit/core/src/logger';

export function forge(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      schematic('library', {
        name: 'common',
        initWith: 'Blank'
      }),
      schematic('application', {
        name: options.name,
        initWith: 'Default'
      }),
      externalSchematic('@schematics/angular', 'module', {
        name: `${options.name}`,
        project: 'common',
        flat: true
      }),
      updateExport('common', options.workspace, context),
      addScripts(options),
      manageBuildScripts(options)
    ]);

    return rule(host, context);
  };
}

export function addScripts(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    addScriptsToPackageFile(host, [
      {
        key: `demo`,
        value: `npm run build:common && npm run start:demo`
      },
      {
        key: 'start:demo',
        value: 'ng serve demo --port=42xx'
      }
    ]);

    return host;
  };
}

export function manageBuildScripts(options: any) {
  return (host: Tree) => {
    var packageFile = host.get('package.json');

    var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

    packageJson.scripts['build'] = 'npm run build:common';

    packageJson.scripts['start'] = `ng serve demo --port=42xx`;

    host.overwrite('package.json', JSON.stringify(packageJson, null, '\t'));

    return host;
  };
}

function updateExport(projectName: string, workspaceName: string, context: SchematicContext) {
  return (host: Tree) => {
    //  TODO:  Not working... Fix
    var workspace = getWorkspace(host);

    var project = workspace.projects[projectName];

    var srcRoot = join(project.root as Path, 'src');

    var lcuApi = join(srcRoot, `lcu.api.ts`);

    host.overwrite(lcuApi, `export * from './lib/${projectName}.module';\r\n`);

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  return host;
}
