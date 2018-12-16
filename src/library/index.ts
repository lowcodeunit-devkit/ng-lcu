import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain, externalSchematic } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';
import { addDeployScriptsToPackageFile } from '../utils/helpers';
import { Logger } from '@angular-devkit/core/src/logger';

export function library(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@schematics/angular', 'library', {
        name: options.name,
        entryFile: options.entryFile,
        prefix: options.prefix,
        skipInstall: true
      }),
      processInitWith(options, context),
      addDeployScripts(options),
      manageDeployAllScript(options)
    ]);

    if (!options.skipInstall)
      context.addTask(new NodePackageInstallTask());

    return rule(host, context);
  };
}

export function addDeployScripts(options: any) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    var project = workspace.projects[options.name];

    var projectSafeName = strings.dasherize(options.name);

    addDeployScriptsToPackageFile(host, [
      {
        key: `deploy:${projectSafeName}`,
        value: `npm version patch --prefix ${project.root} && ng build ${projectSafeName} && npm publish ./dist/${projectSafeName} --access public`
      }
    ]);

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

    if (deployAll)
      deployAll += ` && ${deployProj}`;
    else
      deployAll = deployProj;

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
      `${projectName}.service.ts`,
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
      case "Default":
        break;

      case "Blank":
        rule = blankOutLibrary(options, context);

        break;

      case "Solution":
        rule = chain([
          blankOutLibrary(options, context),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'solution', {
            name: options.name,
            project: options.name,
          })
        ]);
        break;

      case "Element":
        rule = chain([
          blankOutLibrary(options, context),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'element', {
            name: options.name,
            project: options.name,
          })
        ]);
        break;

      case "SPE":
        rule = chain([
          blankOutLibrary(options, context),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'element', {
            name: options.name,
            path: 'lib/elements',
            project: options.name,
          }),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'solution', {
            name: options.name,
            path: 'lib/solutions',
            project: options.name,
          })
        ]);
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);

    return rule;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  options.entryFile = 'lcu.api';

  options.initWith = options.initWith || 'Default';

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lib';

  options.skipInstall = options.skipInstall || false;

  return host;
}
