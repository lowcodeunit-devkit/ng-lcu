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
  chain
} from '@angular-devkit/schematics';
import { findModuleFromOptions, buildRelativePath } from '@schematics/angular/utility/find-module';
import { branchAndMerge } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { normalize, strings } from '@angular-devkit/core';
import { addSolutionToNgModule } from '../utils/module-helpers';

export function solution(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.debug('Starting solution...');

    setupOptions(host, options);
    addSolutionCapabilities(host, options);

    const project = getWorkspace(host).projects[options.project];

    const solutionSource = apply(url('./files/default'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options
      }),
      move(options.path)
    ]);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(solutionSource, MergeStrategy.Default),
        addSolutionToNgModule(options),
        !options.export ? noop() : prepareLcuApiExport(project, options)
      ]))
    ]);

    return rule(host, context);
  };
}

function prepareLcuApiExport(project: WorkspaceProject<ProjectType>, options: any) {
  return (host: Tree) => {
    const exportFile = normalize('/' + project.root + '/' + options.export);

    const textBuf = host.read(exportFile);

    const componentPath = `${options.path}/`
    + strings.dasherize(options.name) + '/'
    + strings.dasherize(options.name)
    + '.component';

    const relativePath = buildRelativePath(exportFile, componentPath);

    let text = textBuf ? textBuf.toString('utf8') : '';

    let newExport = `export * from '${relativePath}';`;

    if (text.indexOf(newExport) < 0) {
      text += `${newExport}\r\n`;

      host.overwrite(exportFile, text);
    }

    return host;
  };
}

function setupOptions(host: Tree, options: any): Tree {
  var lcuFile = host.get('lcu.json');

  var lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  const workspace = getWorkspace(host);

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.disableLcuBootstrap = options.disableLcuBootstrap || false;

  options.export = options.export || 'src/lcu.api.ts';

  options.name = options.name || 'solution';

  options.spec = options.spec || false;

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }

  const project = workspace.projects[options.project];
  const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
  options.path = `/${project.root}/src/` + (options.path ? options.path : projectDirName);

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  let moduleOptions = {...options};
  moduleOptions.path = 'projects/common/src/lib';
  options.module = findModuleFromOptions(host, moduleOptions) || '';

  return host;
}

function addSolutionCapabilities(host: Tree, options: any): Tree {
  let lcuFile = host.get('lcu.json');

  let lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  let capabilityName: string = options.name || 'config-manager';

  let elementName: string = lcuJson.templates.workspace + '-' + options.name + '-element';

  lcuJson.config.solutions[capabilityName] = {
    element: elementName
  };
  
  host.overwrite('lcu.json', JSON.stringify(lcuJson, null, '\t'));

  return host;
}
