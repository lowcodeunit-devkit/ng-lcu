import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function solution(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];

    const targetPath = normalize(project.root + '/src/' + options.path);

    const solutionSource = apply(url('./files/default'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    const docsSource = apply(url('./files/docs'), [
      template({
        ...strings,
        ...options,
      }),
      move('./docs'),
    ]);

    return chain([
      mergeWith(solutionSource, MergeStrategy.Default),
      mergeWith(docsSource, MergeStrategy.Default),
      !options.export ? noop() : prepareLcuApiExport(project, options)
    ]);
  };
}

function prepareLcuApiExport(project: WorkspaceProject<ProjectType>, options: any) {
  return (host: Tree) => {
    var exportFile = normalize(project.root + '/' + options.export);

    const textBuf = host.read(exportFile);

    var text = textBuf ? textBuf.toString('utf8') : '';

    var newExport = `export * from './${options.path}/${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.component';`;

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

  options.project = options.project ? options.project :
    workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];

  options.path = options.path || 'lib/elements';

  options.export = options.export || 'src/lcu.api.ts';

  options.name = options.name || 'solution';

  options.spec = options.spec || false;

  return host;
}
