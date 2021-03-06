import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  Rule,
  SchematicContext,
  Tree,
  noop,
  chain,
  externalSchematic,
  branchAndMerge,
  schematic
} from '@angular-devkit/schematics';
import { strings, Path, join } from '@angular-devkit/core';
import { addScriptsToPackageFile } from '../utils/helpers';

export function library(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      branchAndMerge(externalSchematic('@schematics/angular', 'library', {
        name: options.name,
        entryFile: options.entryFile,
        prefix: options.prefix,
        skipInstall: true
      })),
      processInitWith(options, context),
      addDeployScripts(options),
      manageDeployAllScript(options),
      updateTsConfig(context, options),
      updatePackageJsonName(context, options)
    ]);

    if (!options.skipInstall) context.addTask(new NodePackageInstallTask());

    return rule(host, context);
  };
}

export function addDeployScripts(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    var project = workspace.projects[options.name];

    var projectSafeName = strings.dasherize(options.name);

    addScriptsToPackageFile(host, [
      {
        key: `build:${projectSafeName}`,
        value: `ng build ${projectSafeName}`
      },
      {
        key: `deploy:${projectSafeName}`,
        value:
          `npm version patch --prefix ${project.root} ` +
          `&& npm run build:${projectSafeName} && npm publish ./dist/${projectSafeName} --access public`
      }
    ]);

    return host;
  };
}

function updateExport(projectName: string, workspaceName: string) {
  return (host: Tree) => {
    
    let workspace = getWorkspace(host);

    let project = workspace.projects[projectName];

    let srcRoot = join(project.root as Path, 'src');

    let lcuApi = join(srcRoot, `lcu.api.ts`);

    let content = `export * from './lib/${workspaceName}.module';\r\n`;
    
    host.overwrite(lcuApi, content);

    return host;
  };
}

export function updateTsConfig(context: SchematicContext, options: any) {
  return (host: Tree) => {
    var tsConfigFilePath = 'tsconfig.json';

    var tsConfigFile = host.get(tsConfigFilePath);

    var tsConfigJson = tsConfigFile ? JSON.parse(tsConfigFile.content.toString('utf8')) : {};

    var pathKeys = Object.keys(tsConfigJson.compilerOptions.paths || {});

    pathKeys.forEach(pathKey => {
      var newPath = pathKey.replace(options.name, `${options.scope}/${options.workspace}-${options.name}`);

      tsConfigJson.compilerOptions.paths[newPath] = tsConfigJson.compilerOptions.paths[pathKey];

      delete tsConfigJson.compilerOptions.paths[pathKey];
    });

    host.overwrite(tsConfigFilePath, JSON.stringify(tsConfigJson, null, '\t'));

    return host;
  };
}

export function updatePackageJsonName(context: SchematicContext, options: any) {
  return (host: Tree) => {
    var workspace = getWorkspace(host);

    var projectName: string = options.name;

    var project = workspace.projects[projectName];

    var packageFilePath = join(project.root as Path, 'package.json');

    context.logger.info(`Loading package at path: ${packageFilePath}`);

    var packageFile = host.get(packageFilePath);

    try {
      if (packageFile && packageFile.content) {
        var packageFileContent = packageFile.content.toString('utf8');

        var packageJson = packageFileContent ? JSON.parse(packageFileContent) : {};

        var variant = projectName ? `-${projectName}` : '';

        packageJson.name = `${options.scope}/${options.workspace}${variant}`;

        host.overwrite(packageFilePath, JSON.stringify(packageJson, null, '\t'));

      } else {
        context.logger.info('No file found');
      }
    } catch (err) {
      context.logger.error(err);
    }

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

function blankOutLibrary(options: any, context: SchematicContext) {
  return (host: Tree) => {
    var projectName = options.name;

    var workspace = getWorkspace(host);

    var project = workspace.projects[projectName];

    var srcRoot = join(project.root as Path, 'src');

    var libRoot = join(srcRoot, 'lib');

    [
      `${projectName}.component.spec.ts`,
      `${projectName}.component.ts`,
      `${projectName}.module.ts`,
      `${projectName}.service.spec.ts`,
      `${projectName}.service.ts`
    ].forEach(filename => {
      var filePath = join(libRoot, filename);

      if (host.exists(filePath)) {
        host.delete(filePath);
      }
    });

    var lcuApi = join(srcRoot, `${options.entryFile}.ts`);

    host.overwrite(lcuApi, '');

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
        rule = chain([
          blankOutLibrary(options, context),
          externalSchematic('@schematics/angular', 'module', {
            name: options.workspace,
            project: options.name,
            flat: true
          }),
          updateExport(options.name, options.workspace),
        ]);
        break;
      
      case 'LCU-Starter-Lib':
        rule = chain([
          blankOutLibrary(options, context),
          schematic('lcu-starter-lib', {
            name: options.name,
            project: options.name,
            elementName: options.elementName
          }),
          schematic('module', {
            name: options.workspace,
            project: options.name,
            elementName: options.elementName,
            flat: true
          }),
          updateExport(options.name, options.workspace),
        ]);
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);
    context.logger.info(`lcu-core-app Getting some more options ${options}...`);

    return rule;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.entryFile = 'lcu.api';

  options.initWith = options.initWith || 'Default';

  options.name = options.name || 'library';

  options.elementName = options.elementName || 'starter';

  options.prefix = options.prefix || 'lcu';

  options.skipInstall = options.skipInstall || false;

  return host;
}
