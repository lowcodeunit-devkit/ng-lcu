import { getWorkspace } from '@schematics/angular/utility/config';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain, externalSchematic } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path, join } from '@angular-devkit/core';

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

function processInitWith(options: any, context: SchematicContext) {
  return (host: Tree) => {
    context.logger.info(`Processing Initialization for ${options.initWith}...`);

    var rule: Rule = noop();

    switch (options.initWith) {
      case "Default":
        break;

      case "Blank":
        rule = blankOutLibrary(host, options.name);

        break;

      case "Solution":
        break;

      case "PageElement":
        break;

      case "SPE":
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);
    context.logger.info(rule.toString());

    return rule;
  };
}

function blankOutLibrary(host: Tree, projectName: string) {
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

      if (host.exists(filePath)) {
        host.delete(filePath);
      }
    });

    host.overwrite(join(srcRoot, 'lcu_api.ts'), '');

    return host;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.initWith = options.initWith || 'Default';

  options.name = options.name || 'library';

  options.prefix = options.prefix || 'lib';

  options.skipInstall = options.skipInstall || false;

  return host;
}
