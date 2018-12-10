import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import { normalize, strings, Path } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function solution(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);

    console.log(options);

    const targetPath = (options.flat) ?
      normalize(options.path) :
      normalize(options.path + '/' + strings.dasherize(options.name));

    console.log(targetPath);

    const templateSource = apply(url('./files'), [
      filter(path => {
        console.log(path);
        return true;
      }),
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(targetPath),
    ]);

    console.log(templateSource.toString());

    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);

    return rule(tree, context);
  };
}

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  if (!options.project)
    options.project = workspace.defaultProject || Object.keys(workspace.projects)[0];

  const project = workspace.projects[options.project];

  if (options.path === undefined && project.projectType == ProjectType.Application)
    options.path = buildDefaultPath(<WorkspaceProject<ProjectType.Application>>project);
  else if (options.path === undefined)
    options.path = project.root as Path;

  const parsedPath = parseName(options.path, options.name);

  options.name = parsedPath.name;

  options.path = parsedPath.path;

  return host;
}
