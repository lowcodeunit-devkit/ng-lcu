import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
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
  branchAndMerge,
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function testing(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    context.logger.info(`OPTIONS: ${JSON.stringify(options)}...`);

    return chain([
      branchAndMerge(
        chain([
          externalSchematic('@briebug/cypress-schematic', 'ng-add', {
            addCypressTestScripts: true,
          }),
          manageBuildScripts(options),
        ])
      ),
    ]);
  };
}

export function manageBuildScripts(options: any) {
  return (host: Tree) => {
    var packageFile = host.get('package.json');

    var packageJson = packageFile ? JSON.parse(packageFile.content.toString('utf8')) : {};

    var port = /--port=([0-9].*)/.exec(packageJson.scripts['start']) || 4200;

    packageJson.scripts['e2e'] = `start-server-and-test start ${port} cy:run`;

    var curDeploy =  packageJson.scripts['deploy'];
    
    packageJson.scripts['deploy'] = ['npm run e2e', curDeploy ? '&&' : '', curDeploy].join(' ');

    packageJson.scripts['test'] = 'npm run cy:open';

    host.overwrite('package.json', JSON.stringify(packageJson, null, '\t'));

    return host;
  };
}

function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  const workspace = getWorkspace(host);

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.project = options.project
    ? options.project
    : workspace.defaultProject
    ? <string>workspace.defaultProject
    : Object.keys(workspace.projects)[0];

  options.testPlatform = options.testPlatform || 'Cypress.io';

  return host;
}
