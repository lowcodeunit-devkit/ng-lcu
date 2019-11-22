import { getWorkspace } from '@schematics/angular/utility/config';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  move,
  MergeStrategy,
  mergeWith,
  template
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

export function module(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
      context.logger.info(`BOBBY 5570 - module() initialized...`);
      setupOptions(host, options);
      context.logger.info(`BOBBY 5570 - module() options: ${JSON.stringify(options)}`);
  
      const workspace = getWorkspace(host);

      const project = workspace.projects[options.project];
      context.logger.info(`BOBBY 5570 - module() project: ${JSON.stringify(project)}`);

      const targetPath = normalize(project.root + '/src/' + options.path);
      context.logger.info(`BOBBY 5570 - module() targetPath: ${targetPath}`);

      let filePath: string = './files';
      context.logger.info(`BOBBY 5570 - module() filePath before: ${filePath}`);

      if (options.initWith === 'app') {
        filePath += '/app';
      } else {
        filePath += '/component';
      }
      context.logger.info(`BOBBY 5570 - module() filePath after: ${filePath}`);
      
      const solutionSource = apply(url(filePath), [
        template({
          ...strings,
          ...options
        }),
        move(targetPath)
      ]);
  
      return mergeWith(solutionSource, MergeStrategy.Overwrite);
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
  
    options.path = options.path || 'lib';
  
    options.export = options.export || 'src/lcu.api.ts';
  
    options.name = options.name || 'solution';
  
    options.spec = options.spec || false;
  
    return host;
}
