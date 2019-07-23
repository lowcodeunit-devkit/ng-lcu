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
  schematic,
  ExecutionOptions
} from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';
import { addScriptsToPackageFile, removeFilesFromRoot } from '../utils/helpers';
import { Logger } from '@angular-devkit/core/src/logger';

export function lcu(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.debug('Starting LCU...');

    setupOptions(host, options);

    const rule = chain([
      // schematic('library', {
      //   name: 'common',
      //   initWith: 'Blank'
      // }),
      // schematic('application', {
      //   name: 'lcu',
      //   es5Patch: true,
      //   initWith: 'Blank',
      //   isDefault: true,
      //   routing: false,
      //   singleBundle: true,
      //   webCompPolys: true
      // }),
      // schematic('application', {
      //   name: 'demo',
      //   initWith: options.initWith || 'LCU-Core-App'
      // }),
      // externalSchematic('@schematics/angular', 'module', {
      //   name: `${options.workspace}`,
      //   project: 'common',
      //   flat: true
      // }),
      // externalSchematic('@schematics/angular', 'module', {
      //   name: `app`,
      //   project: 'lcu',
      //   flat: true
      // }),
      // updateExport('common', options.workspace, context),
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
        key: `demo:lcu`,
        value: `npm run build:common && npm run build:lcu && npm run start:demo`
      },
      {
        key: `pack`,
        value: `npm run pack:lcu`
      },
      {
        key: `pack:lcu`,
        value: `rimraf dist/lcu/wc && mkdirp dist/lcu/wc && npm run pack:main && npm run pack:pollyfills && npm run pack:join`
      },
      {
        key: `pack:join`,
        value: `concat-glob-cli -f \"dist/lcu/wc/lcu.*.js\" -o dist/lcu/wc/${options.workspace}.lcu.js`
      },
      {
        key: `pack:main`,
        value: `concat-glob-cli -f \"dist/lcu/main.*.js\" -o dist/lcu/wc/lcu.startup.js`
      },
      {
        key: `pack:pollyfills`,
        value: `concat-glob-cli -f \"dist/lcu/scripts.*.js\" -o dist/lcu/wc/lcu.pollyfills.js`
      }
    ]);

    return host;
  };
}

export function manageBuildScripts(options: any) {
  return (host: Tree) => {
    var packageFile = host.get('package.json');

    var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

    packageJson.scripts['build'] = 'npm run build:common && npm run build:lcu';

    packageJson.scripts['start'] = `ng serve demo --port=4210`;

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

    host.overwrite(lcuApi, `export * from './lib/${workspaceName}.module';\r\n`);

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.initWith = options.initWith;

  return host;
}
