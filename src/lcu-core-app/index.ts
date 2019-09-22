import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Rule, SchematicContext, Tree, apply, url, noop, filter, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

/**
 * Rule Factory (entry function) that returns a Rule
 * 
 * @param options options passed from the command line when calling the schematic
 * 
 * A Rule is a function that applies actions to a Tree given the SchematicContext
 */
export function lcuCoreApp(options: any): Rule {

  /** A tree is a staging area for changes, 
   * containing the original file system, and a list of changes to apply to it.  
   * */
  return (host: Tree, context: SchematicContext) => {
    
    setupOptions(host, options);

    const workspace = getWorkspace(host);
    context.logger.info(`LCU Core App OPTIONS: ${JSON.stringify(options)}...`);
    let project = workspace.projects[options.project];

    /** source within of root path */
    const targetPath = normalize(project.root + '/src/');

    /** location of source files */
    const solutionSource = apply(url('./files/src'), [

      /** template function executes the templates that can be found */
      template({
        ...strings, // all the functions called before (dasherize, etc.)
        ...options, // command line options (name, path, etc.)
      }),

      /** move everything to the correct folder */
      move(targetPath),
    ]);

    // const docsSource = apply(url('./files/docs'), [
    //   template({
    //     ...strings,
    //     ...options,
    //   }),
    //   move('./docs'),
    // ]);

    /** return a chain of existing rules */
    return chain([
      mergeWith(solutionSource, MergeStrategy.Default),
      // mergeWith(docsSource, MergeStrategy.Default)
    ]);
  };
}

function setupOptions(host: Tree, options: any): Tree {
  let lcuFile = host.get('lcu.json');

  let lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};

  const workspace = getWorkspace(host);

  options.scope = lcuJson.templates.scope;

  options.workspace = lcuJson.templates.workspace;

  options.project = options.project ? options.project :
    workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];

  options.name = options.name;

  return host;
}
