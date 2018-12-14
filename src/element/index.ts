import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function element(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];
    
    const targetPath = normalize(project.root + '/' + options.path);

    const templateSource = apply(url('./files/display'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    return chain([
      mergeWith(templateSource, MergeStrategy.Default),
      !options.export ? noop() : prepareLcuApiExport(project, options)
    ]);
  };
}

function prepareLcuApiExport(project: WorkspaceProject<ProjectType>, options: any) {
  return (host: Tree) => {
    var exportFile = normalize(project.root + '/' + options.export);
    
    const textBuf = host.read(exportFile);

    var text = textBuf ? textBuf.toString('utf8') : '';

    var newExport = `export * from './../${options.path}/${strings.dasherize(options.name)}.api';`;
    
    if (text.indexOf(newExport) < 0) {
      text += `\r\n${newExport}`;

      host.overwrite(exportFile, text);
    }
    
    return host;
  };
}

function determineRelativePath(exportFile: string, targetPath: string) {
  return normalize([].join('/'));
}

function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.project = options.project ? options.project :
    workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];

  options.name = options.name || 'element';

  options.spec = options.spec || false;

  return host;
}
