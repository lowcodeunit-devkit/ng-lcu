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
import { addScriptsToPackageFile, removeFilesFromRoot } from '../utils/helpers';
import { Logger } from '@angular-devkit/core/src/logger';

export function lcu(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@lowcodeunit-devkit/ng-lcu', 'application', {
        name: 'lcu',
        es5Patch: true,
        initWith: 'Module',
        routing: false
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
      updateExport('common', context)
      // addScripts(options),
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
        value: `npm run build:common && np run build:lcu && ng serve demo`
      },
      {
        key: `build:common`,
        value: `ng build common`
      },
      {
        key: `build:lcu`,
        value: `ng build lcu --prod --single-bundle && npm run pack`
      },
      {
        key: `pack`,
        value: `npm run pack:lcu`
      },
      {
        key: `pack:lcu`,
        value: `mkdirp dist/wc/lcu && npm run pack:main && npm run pack:pollyfills && npm run pack:join`
      },
      {
        key: `pack:join`,
        value: `concat-glob-cli -f \"dist/wc/lcu/lcu.*.js\" -o dist/wc/${options.workspace}.lcu.js`
      },
      {
        key: `pack:main`,
        value: `concat-glob-cli -f \"dist/lcu/main.*.js\" -o dist/wc/lcu/lcu.1.js`
      },
      {
        key: `pack:pollyfills`,
        value: `concat-glob-cli -f \"dist/lcu/scripts.*.js\" -o dist/wc/lcu/lcu.0.js`
      },
    ]);

    return host;
  };
}

export function manageBuildScript(options: any) {
  return (host: Tree) => {
    var packageFile = host.get('package.json');

    var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

    packageJson.scripts['build'] = 'npm run build:common && npm run build:lcu';

    host.overwrite('package.json', JSON.stringify(packageJson, null, '\t'));

    return host;
  };
}

function updateExport(projectName: string, context: SchematicContext) {
  return (host: Tree) => {
    //  TODO:  Not working... Fix
    var workspace = getWorkspace(host);

    var project = workspace.projects[projectName];

    var srcRoot = join(project.root as Path, 'src');

    var lcuApi = join(srcRoot, `lcu.api.ts`);

    host.overwrite(lcuApi, "export * from './lib/lcu-identity.module';\r\n");

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
