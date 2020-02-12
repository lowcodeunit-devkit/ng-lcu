import {
  Rule,
  Tree,
  SchematicContext,
  apply,
  url,
  move,
  template,
  chain,
  mergeWith,
  MergeStrategy
} from "@angular-devkit/schematics";
import { getWorkspace } from "@schematics/angular/utility/config";
import { normalize, strings} from "@angular-devkit/core";
import { importModule, AddImportToModuleContext } from "../utils/module-helpers";

/**
 * Schematic for adding the LCU-Documentation library and accompanying documents to an Application.
 * 
 * @param options The options passed from the CLI.
 */
export function documentation(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info(`Starting documentation...`);

    setupOptions(host, options);

    const workspace = getWorkspace(host);

    let project = workspace.projects[options.project];

    options.targetPath = normalize(project.root + "/src/" + options.path);

    const templateSource = apply(url(`./files/${options.initWith}`), [
      template({
        ...strings,
        ...options
      }),
      move(options.targetPath)
    ]);

    const moduleContext: AddImportToModuleContext = {
      moduleName: 'app',
      modulePath: `${project.root}/src/app`,
      importName: 'LcuDocumentationModule',
      importPath: '@lowcodeunit/lcu-documentation-common',
      forRoot: true
    };

    return chain([
      mergeWith(templateSource, MergeStrategy.Default),
      importModule(moduleContext),
      addDocsToAssetsPath(options)
    ]);
  };
}

/**
 * Adds the local path of the documents to the 'angular.json' file so they are served up with the app.
 * 
 * @param options The options passed from the calling command.
 * @param docsPath Optional path to specify the location of the documents. If no path given, defaults to target path.
 * @param project Optional project name to specify which project the documents are added to.
 */
export function addDocsToAssetsPath(options: any, docsPath?: string, project?: string): Rule {
  return (host: Tree) => {
    let projectSafeName = project ? strings.dasherize(project) : 'demo';

    let path = docsPath ? docsPath : options.targetPath;
    
    let angularFile = host.get('angular.json');

    let angularJson = angularFile ? JSON.parse(angularFile.content.toString('utf8')) : {};

    angularJson.projects[projectSafeName].architect.build.options.assets.push(path);

    host.overwrite('angular.json', JSON.stringify(angularJson, null, '\t'));

    return host;
  };
}

/**
 * Sets up the options specific to this schematic.
 * 
 * @param host The current application Tree.
 * @param options The options passed from the calling command.
 */
function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.project = options.project
    ? options.project
    : workspace.defaultProject
    ? <string>workspace.defaultProject
    : Object.keys(workspace.projects)[0];

  options.path = options.path || "docs";
  
  options.initWith = options.initWith || 'default'; // TODO: Do I need to lowercase() here?

  options.name = options.name || "docs";

  options.spec = options.spec || false;

  return host;
}
