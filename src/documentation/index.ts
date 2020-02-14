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
  MergeStrategy,
  noop
} from "@angular-devkit/schematics";
import { getWorkspace } from "@schematics/angular/utility/config";
import { normalize, strings} from "@angular-devkit/core";
import { importModule, AddImportToModuleContext, addElementToNgModule, AddToRoutesContext, addComponentToAppRouting } from "../utils/module-helpers";
import { findProjectRoot } from "../utils/helpers";

/**
 * Schematic for adding the LCU-Documentation library and accompanying documents to an Application.
 * 
 * @param options The options passed from the CLI.
 */
export function documentation(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info(`Starting documentation...`);

    setupOptions(host, options);

    const projectRoot = findProjectRoot(host, options);

    options.targetPath = normalize(projectRoot + "/src/" + options.path);

    const templateSource = apply(url(`./files/init-with/${options.initWith}`), [
      template({
        ...strings,
        ...options
      }),
      move(options.targetPath)
    ]);

    const moduleContext: AddImportToModuleContext = {
      moduleName: 'app',
      modulePath: `${projectRoot}/src/app`,
      importName: 'LcuDocumentationModule',
      importPath: '@lowcodeunit/lcu-documentation-common',
      forRoot: true
    };
    
    const routesContext: AddToRoutesContext = {
      appRoutingModulePath: `${projectRoot}/src/app/app-routing.module.ts`,
      componentName: 'documentation',
      componentPath: './controls/documentation/documentation.component',
      route: 'documentation'
    }

    return chain([
      mergeWith(templateSource, MergeStrategy.Default),
      options.includeComponent ? addComponentFiles(options) : noop(),
      options.includeRouting ? addComponentToAppRouting(routesContext) : noop(),
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
 */
export function addDocsToAssetsPath(options: any, docsPath?: String): Rule {
  return (host: Tree) => {
    const projectSafeName = options.project ? strings.dasherize(options.project) : 'demo';

    const path = docsPath ? docsPath : options.targetPath;
    
    let angularFile = host.get('angular.json');

    let angularJson = angularFile ? JSON.parse(angularFile.content.toString('utf8')) : {};

    angularJson.projects[projectSafeName].architect.build.options.assets.push(path);

    host.overwrite('angular.json', JSON.stringify(angularJson, null, '\t'));

    return host;
  };
}

/**
 * Adds the component files necessary to contain and run the lcu-documentation tool.
 * 
 * @param options The options passed from the calling command.
 */
function addComponentFiles(options: any): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    const project = workspace.projects[options.project];

    const targetPath = normalize(project.root + "/src/app/controls");

    const templateSource = apply(url(`./files/controls`), [
      template({
        ...strings,
        ...options
      }),
      move(targetPath)
    ]);

    options.classifiedName = 'DocumentationComponent';
    options.componentPath = `/${project.root}/src/app/controls/documentation/documentation.component`;
    options.module = `/${project.root}/src/app/app.module.ts`;

    return chain([
      mergeWith(templateSource, MergeStrategy.Default),
      addElementToNgModule(options)
    ]);
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
