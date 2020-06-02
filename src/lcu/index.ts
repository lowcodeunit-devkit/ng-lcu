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
import { updateAppModule, addElementToNgModule } from '../utils/module-helpers';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;
const stringUtils = { dasherize, classify };

export function lcu(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info('Starting LCU...');

    setupOptions(host, options);

    const rule = chain([
      branchAndMerge(chain([
        schematic('library', {
          name: 'common',
          initWith: 'LCU-Starter-Lib',
          elementName: options.elementName
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
          initWith: options.initWith || 'LCU-Starter-App',
          elementName: options.elementName
        }),
        schematic('module', {
          name: options.workspace,
          project: 'common',
          elementName: options.elementName,
          flat: true
        }),
        schematic('module', {
          initWith: 'app',
          project: 'lcu',
          path: 'app',
          flat: true
        }),
        schematic('documentation', {
          initWith: 'lcu',
          project: 'demo',
          path: 'docs',
          includeComponent: true,
          includeRouting: true
        }),
        updateExport('common', options.workspace),
        updateAppModule(options),
        updateAppModule(options, '/projects/demo/src/app'),
        updateTsConfig(),
        addStarterElements(options),
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

function updateExport(projectName: string, workspaceName: string, contentToAdd?: string) {
  return (host: Tree) => {
    
    let workspace = getWorkspace(host);

    let project = workspace.projects[projectName];

    let srcRoot = join(project.root as Path, 'src');

    let lcuApi = join(srcRoot, `lcu.api.ts`);

    let content = `export * from './lib/${workspaceName}.module';\r\n`;

    if (contentToAdd) {
      content += contentToAdd;
    }
    
    host.overwrite(lcuApi, content);

    return host;
  };
}

/**
 * Updates the tsconfig.json file to be compatible as a Angular 9 library.
 */
function updateTsConfig() {
  return (host: Tree) => {
    const tsConfigFilePath = 'tsconfig.json';

    let tsConfigFile = host.get(tsConfigFilePath);

    let tsConfigJson = tsConfigFile ? JSON.parse(tsConfigFile.content.toString('utf8')) : {};

    let compilerOptions = tsConfigJson.compilerOptions || {};

    let angularCompilerOptions = tsConfigJson.angularCompilerOptions || {};

    compilerOptions['noImplicitAny'] = true;
    compilerOptions['suppressImplicitAnyIndexErrors'] = true;

    angularCompilerOptions['enableIvy'] = false;
    angularCompilerOptions['strictInjectionParameters'] = true;
    angularCompilerOptions['strictTemplates'] = true;

    tsConfigJson.compilerOptions = compilerOptions;
    tsConfigJson.angularCompilerOptions = angularCompilerOptions;

    host.overwrite(tsConfigFilePath, JSON.stringify(tsConfigJson, null, '\t'));

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.initWith = options.initWith;
  
  // starter files
  options.elementName = options.projectName || 'card';

  options.path = options.path || '/projects/common/src/lib/';

  options.filePath = options.path + stringUtils.dasherize(options.workspace) + '.module.ts';

  return host;
}

function addStarterElements(options: any): Rule {
  return (host: Tree) => {

    const files = [
      { name: `${stringUtils.dasherize(options.elementName)}.component`, type: 'component', path: `controls/${stringUtils.dasherize(options.elementName)}` },
      { name: `${stringUtils.dasherize(options.elementName)}.directive`, type: 'directive', path: 'directives' },
      { name: `${stringUtils.dasherize(options.elementName)}.model`, type: 'model', path: 'models' },
      { name: `${stringUtils.dasherize(options.elementName)}.service`, type: 'service', path: 'services' },
      { name: `${stringUtils.dasherize(options.elementName)}-management-state.context`, type: 'state', path: 'state' },
      { name: `${stringUtils.dasherize(options.elementName)}-management.state`, type: 'state', path: 'state' },
      { name: `${stringUtils.dasherize(options.elementName)}.utils`, type: 'utils', path: 'utils' }
    ];

    const rules: Rule[] = [];

    let exportContent = '';

    files.forEach((file) => {
      if (file.type === 'component' || file.type === 'directive') {
        options.classifiedName = stringUtils.classify(options.elementName) + stringUtils.classify(file.type);
        options.componentPath = options.path + file.path + '/' + file.name;
        rules.push(addElementToNgModule({...options}, true));
      }

      exportContent += `export * from './lib/` + `${file.path}/${file.name}';\r\n`;
    });

    rules.push(updateExport('common', options.workspace, exportContent));

    return chain(rules);
  };
}

function randomizePort(){
  var num = Math.floor(Math.random() * 10);
  
  return num;
}
