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
import { normalize, strings } from '@angular-devkit/core';

export function module(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
      context.logger.info(`BOBBY 5570 - module() initialized...`);
      setupOptions(host, options);
  
      const workspace = getWorkspace(host);
      const project = workspace.projects[options.project];
    //   const targetPath = normalize(project.root + '/src/' + options.path);
      const targetPath = normalize(project.root + '/src/lib/');
      context.logger.info(`BOBBY 5570 - module() targetPath: ${targetPath}`);
      const solutionSource = apply(url('./files'), [
        template({
          ...strings,
          ...options
        }),
        move(targetPath)
      ]);
  
    //   return chain([
    //     mergeWith(solutionSource, MergeStrategy.Default),
    //     !options.export ? noop() : prepareLcuApiExport(project, options)
    //   ]);
      return mergeWith(solutionSource, MergeStrategy.Overwrite);
    };
}
  
function setupOptions(host: Tree, options: any): Tree {
    context.logger.info(`BOBBY 5570 - setupOptions() initialized...`);
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
  
    options.path = options.path || 'lib/elements';
  
    options.export = options.export || 'src/lcu.api.ts';
  
    options.name = options.name || 'solution';
  
    options.spec = options.spec || false;
  
    return host;
}