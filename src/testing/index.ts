import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain, externalSchematic } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function testing(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    
    setupOptions(host, options);

    const workspace = getWorkspace(host);
    
    context.logger.info(`OPTIONS: ${JSON.stringify(options)}...`);

    return chain([
      externalSchematic('@briebug/cypress-schematic', 'ng-add', {
        addCypressTestScripts: true
      })
    ]);
  };
}

function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  const workspace = getWorkspace(host);

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.project = options.project ? options.project :
    workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];

  options.testPlatform = options.testPlatform || 'Cypress.io';

  return host;
}