import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain, externalSchematic } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';
import { addScriptIntoPackageJson } from '../utils/helpers';

export function library(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const rule = chain([
      externalSchematic('@schematics/angular', 'library', {
        name: options.name,
        entryFile: 'lcu_api',
        prefix: options.prefix,
        skipInstall: true
      }),
      processInitWith(options, context)
    ]);

    if (!options.skipInstall)
      context.addTask(new NodePackageInstallTask());

    return rule(host, context);
  };
}

function blankOutLibrary(projectName: string, context: SchematicContext) {
  return (host: Tree) => {
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
      var filePath = join(project.root as Path, 'src', 'lib', filename);

      context.logger.info(`Attempting delete for ${filePath}...`);

      if (host.exists(filePath)) {
        host.delete(filePath);
      
        context.logger.info(`Deleted ${filePath}!`);
      }
    });

    host.overwrite(join(srcRoot, 'lcu_api.ts'), '');

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
        rule = blankOutLibrary(options.name, context);

        break;

      case "Solution":
        break;

      case "PageElement":
        break;

      case "SPE":
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);
    
    return rule;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  options.initWith = options.initWith || 'Default';

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lib';

  options.skipInstall = options.skipInstall || false;

  return host;
}
