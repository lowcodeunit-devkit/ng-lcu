import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function lcuCoreApp(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];

    const targetPath = normalize(project.root + '/src/');

    const solutionSource = apply(url('./files/src/app'), [
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    // const docsSource = apply(url('./files/docs'), [
    //   template({
    //     ...strings,
    //     ...options,
    //   }),
    //   move('./docs'),
    // ]);

    return chain([
      mergeWith(solutionSource, MergeStrategy.Default),
      // mergeWith(docsSource, MergeStrategy.Default)
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

  options.name = options.name;

  return host;
}
