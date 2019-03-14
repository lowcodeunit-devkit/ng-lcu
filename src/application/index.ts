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

export function application(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@schematics/angular', 'application', {
        name: options.name,
        routing: options.routing,
        prefix: options.prefix,
        style: 'scss'
      }),
      processInitWith(options, context),
      options.blockDeploy ? noop() : addScripts(options),
      options.blockDeploy ? noop() : manageDeployAllScript(options),
      manageAppAssets(options, context)
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

    addScriptsToPackageFile(host, [
      !options.singleBundle
        ? {
            key: `build:${projectSafeName}`,
            value: `ng build demo --prod`
          }
        : {
            key: `build:${projectSafeName}`,
            value: `ng build lcu --prod --single-bundle && npm run pack`
          },
      {
        key: `deploy:${projectSafeName}`,
        value:
          `npm version patch --prefix ${project.root}` +
          `&& npm run build:${projectSafeName} && npm publish ./dist/${projectSafeName} --access public`
      }
    ]);

    return host;
  };
}

export function createPackageJson(host: Tree, options: any, projectName: string, context: SchematicContext) {
  var workspace = getWorkspace(host);

  var project = workspace.projects[projectName];

  var packageFilePath = join(project.root as Path, 'package.json');

  context.logger.info(`Loading package at path: ${packageFilePath}`);

  var packageJson = {
    name: `${options.scope}/${options.workspace}-${projectName}`,
    version: '0.0.1',
    peerDependencies: {
      '@angular/common': '^7.2.0',
      '@angular/core': '^7.2.0'
    }
  };

  host.create(packageFilePath, JSON.stringify(packageJson, null, '\t'));
}

export function updatePolyfills(host: Tree, options: any, projectName: string, context: SchematicContext) {
  var workspace = getWorkspace(host);

  var project = workspace.projects[projectName];

  var polysFilePath = join(project.root as Path, 'polyfills.ts');

  var polysFile = host.get(polysFilePath);

  var polysContent = polysFile ? polysFile.content.toString('utf8') : '';

  if (options.webCompPolys) polysContent += `\r\nimport '@webcomponents/custom-elements/custom-elements.min';`;

  host.create(polysFilePath, polysContent);
}

export function manageAppAssets(options: any, context: SchematicContext) {
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

    if (options.isDefault) angularJson.defaultProject = projectSafeName;

    if (options.singleBundle) {
      angularJson.projects[projectSafeName].architect.build.options.assets = angularJson.projects[
        projectSafeName
      ].architect.build.options.assets.filter((a: any) => a != `projects/${projectSafeName}/src/assets`);

      angularJson.projects[projectSafeName].architect.build.options.assets.push('lcu.json')
    }

    if (options.es5Patch) delete angularJson.projects[projectSafeName].architect.build.options.es5BrowserSupport;

    if (options.es5Patch) delete angularJson.projects[projectSafeName].architect.build.options.es5BrowserSupport;

    if (options.webCompPolys)
      angularJson.projects[projectSafeName].architect.build.options.scripts.push(
        'node_modules/@webcomponents/custom-elements/src/native-shim.js'
      );

    host.overwrite('angular.json', JSON.stringify(angularJson, null, '\t'));

    createPackageJson(host, options, projectSafeName, context);

    return host;
  };
}

export function manageDeployAllScript(options: any) {
  return (host: Tree) => {
    var projectSafeName = strings.dasherize(options.name);

    var deployProj = `npm run deploy:${projectSafeName}`;

    var packageFile = host.get('package.json');

    var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

    var deployAll = packageJson.scripts['deploy:all'];

    if (deployAll) deployAll += ` && ${deployProj}`;
    else deployAll = deployProj;

    packageJson.scripts['deploy:all'] = deployAll;

    host.overwrite('package.json', JSON.stringify(packageJson, null, '\t'));

    return host;
  };
}

function blankOutLibrary(options: any, context: SchematicContext, exceptModule: boolean) {
  return (host: Tree) => {
    var projectName = options.name;

    var workspace = getWorkspace(host);

    var project = workspace.projects[projectName];

    var srcRoot = join(project.root as Path, 'src');

    var appRoot = join(srcRoot, 'app');

    var files = [`app.component.html`, `app.component.scss`, `app.component.spec.ts`, `app.component.ts`, `app-routing.module.ts`];

    if (!exceptModule) files.push(`app.module.ts`);

    removeFilesFromRoot(host, appRoot, files);

    return host;
  };
}

function processInitWith(options: any, context: SchematicContext) {
  return (host: Tree) => {
    context.logger.info(`Processing Initialization for ${options.initWith}...`);

    var rule: Rule = noop();

    switch (options.initWith) {
      case 'Default':
        break;

      case 'Blank':
        rule = blankOutLibrary(options, context, false);
        break;

      case 'Forge':
        rule = chain([
          blankOutLibrary(options, context, false),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'forge', {
            name: options.name,
            project: options.name
          })
        ]);
        break;

      case 'Module':
        rule = blankOutLibrary(options, context, true);
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);

    return rule;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.entryFile = 'lcu.api';

  options.blockDeploy = options.blockDeploy || false;

  options.initWith = options.initWith || 'Default';

  options.isDefault = options.isDefault || false;

  options.es5Patch = options.es5Patch || false;

  options.webCompPolys = options.webCompPolys;

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lcu';

  options.routing = options.routing === undefined ? true : options.routing;

  options.singleBundle = options.singleBundle || false;

  options.skipInstall = options.skipInstall || false;

  return host;
}
