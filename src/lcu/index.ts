import { getWorkspace } from '@schematics/angular/utility/config';
import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
  branchAndMerge
} from '@angular-devkit/schematics';
import {  Path, join } from '@angular-devkit/core';
import { addScriptsToPackageFile } from '../utils/helpers';
import { updateAppModule } from '../utils/module-helpers';

export function lcu(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.debug('Starting LCU...');

    setupOptions(host, options);

    const rule = chain([
      branchAndMerge(chain([
        schematic('library', {
          name: 'common',
          initWith: 'LCU-Starter-App'
          // initWith: 'Blank'
        }),
        schematic('application', {
          name: 'lcu',
          es5Patch: true,
          initWith: 'Blank',
          isDefault: true,
          routing: false,
          singleBundle: true,
          webCompPolys: true
        }),
        schematic('application', {
          name: 'demo',
          initWith: options.initWith || 'Blank'
          // initWith: options.initWith || 'LCU-Core-App'
        }),
        schematic('module', {
          name: options.workspace,
          project: 'common',
          flat: true
        }),
        schematic('module', {
          initWith: 'app',
          project: 'lcu',
          path: 'app',
          flat: true
        }),
        updateExport('common', options.workspace, context),
        updateAppModule(options),
        addScripts(options),
        manageBuildScripts(options)
      ]))
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
        value: `concat-glob-cli -f \"dist/lcu/main-es2015.*.js\" -o dist/lcu/wc/lcu.startup.js`
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

    packageJson.scripts['start'] = `ng serve demo --port=42${randomizePort()}${randomizePort()}`;

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

function randomizePort(){
  var num = Math.floor(Math.random() * 10);
  
  return num;
}
