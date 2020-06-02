import * as ts from 'typescript';
import {
  Rule,
  Tree,
  SchematicsException,
  DirEntry
} from '@angular-devkit/schematics';
import { buildRelativePath, ModuleOptions } from '@schematics/angular/utility/find-module';
import { addDeclarationToModule, addExportToModule, addEntryComponentToModule, addImportToModule, insertImport, getSourceNodes, addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { strings } from '@angular-devkit/core';

const { dasherize, classify, camelize, underscore } = strings;
const stringUtils = { dasherize, classify, camelize, underscore };

export class AddToModuleContext {
  classifiedName: string;
  filePath: string;
  relativePath: string;
  source: any;
}

export class AddImportToModuleContext {
  moduleName: string;
  modulePath: string;
  importName: string;
  importPath: string;
  forRoot?: boolean;
}

/**
 * The context necessary for adding a component to a specific file.
 * 
 * @property {string} appRoutingModulePath - The path of the app-routing module that the route should be added to.
 * @property {string} componentName - The name of the component. I.e. 'example.component' or just 'example'.
 * @property {string} componentPath - The relative path to the component.
 * @property {string} route - Optional route for adding to app-routing.module.
 * @property {string} source - Optional source file of the app-routing.module.
 */
export class AddToRoutesContext {
  appRoutingModulePath: string;
  componentName: string;
  componentPath: string;
  route?: string;
  source?: any;
}

/**
 * Adds a route with the specified component into the app-routing module.
 * 
 * @param context The context information of what is being added to the app-routing module.
 */
export function addComponentToAppRouting(context: AddToRoutesContext): Rule {
  return (host: Tree) => {
    addRoute(host, createRouteContext(host, context));

    return host;
  };
}

/**
 * When the 'solution' command is executed, adds the generated component to the given project module.
 * By default, it also adds a custom bootstrap function to the app.module file.
 * 
 * @param options The options passed from the calling command
 */
export function addSolutionToNgModule(options: ModuleOptions | any): Rule {
  return (host: Tree) => {
    addDeclaration(host, createAddToModuleContext(host, options));
    addExport(host, createAddToModuleContext(host, options));
    addEntryComponent(host, createAddToModuleContext(host, options));

    if (!options.disableLcuBootstrap) {
      addCustomLcuBootstrap(host, options);
    }
    return host;
  };
}

/**
 * Adds the specified element type (i.e. Directive, Service, etc.) to the given project module.
 * Must specify the 'classifiedName' and 'componentPath' properties for it to work properly.
 * 
 * @param options The options passed from the calling command
 */
export function addElementToNgModule(options: ModuleOptions | any, exportElement?: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, createAddElementToModuleContext(host, options));

    if (exportElement) {
      addExport(host, createAddElementToModuleContext(host, options));
    }

    return host;
  }
}

/**
 * Adds the specified Module dependency to the imports array of the target Module.
 * 
 * @param context The context information of what is being added to the imports array.
 */
export function importModule(context: AddImportToModuleContext): Rule {
  return (host: Tree) => {
    const result = new AddToModuleContext();
    
    context.moduleName = constructModuleName(context.moduleName);

    result.filePath = findFileByName(context.moduleName, context.modulePath, host);
    result.classifiedName = classify(context.importName) + (context.forRoot ? '.forRoot()' : '');
    result.relativePath = context.importPath;
  
    let text = host.read(result.filePath);
    if (!text) throw new SchematicsException(`File ${result.filePath} does not exist.`);
    let sourceText = text.toString('utf-8');
    result.source =ts.createSourceFile(result.filePath, sourceText, ts.ScriptTarget.Latest, true);
  
    addImport(host, result);
    
    return host;
  };
}

/**
 * When the 'lcu' command is executed, it updates the 'lcu' project app.module and adds project module to it.
 * 
 * @param options The options passed from the calling command
 * @param appModulePath (Optional) Specifies the path to look for the app.module in
 */
export function updateAppModule(options: ModuleOptions, appModulePath?: string): Rule {
  return (host: Tree) => {
    addImport(host, createUpdateModuleContext(host, options, appModulePath, true));
    addExport(host, createUpdateModuleContext(host, options, appModulePath));
    return host;
  };
}

/**
 * When creating a new LCU, adds a custom bootstrap method to the app.module file.
 * 
 * @param host The current application Tree
 * @param options The options passed from the calling command
 */
function addCustomLcuBootstrap(host: Tree, options: ModuleOptions | any): void {
  let component = stringUtils.classify(`${options.workspace}`) + stringUtils.classify(`${options.name}ElementComponent`);
  let selector = 'SELECTOR_' + stringUtils.underscore(`${options.workspace}`).toUpperCase() + '_' + stringUtils.underscore(`${options.name}Element`).toUpperCase();
  let variableName = stringUtils.camelize(options.name);

  let appModule = './projects/lcu/src/app/app.module.ts';

  let buffer = host.read(appModule);

  if (!buffer) {
    console.log(`No app.module found in directory: '${appModule}' - trying in lib directory instead.`);
    appModule = './projects/lcu/src/lib/app.module.ts';
    buffer = host.read(appModule);

    if (!buffer) {
      console.log(`Could not find 'app.module' in any directory - skipping update.`);
      return;
    }
  }

  const content = buffer.toString('utf-8');

  let sourceFile: any = ts.createSourceFile(appModule, content, ts.ScriptTarget.Latest, true);

  let node = findClassMethod(sourceFile, 'AppModule', 'ngDoBootstrap');
  
  if (!node) {
    throw new SchematicsException(`Expected body in ${sourceFile.fileName} to be empty. Set 'disableLcuBootstrap' option to true to create solution without custom bootstrap.`);
  }

  let bootstrapChanges: Change[] = [];
  let toAdd = ``;

  if (node.getWidth() === 0) { // First time the solution command is run - sets up constructor, declaration, and imports
    toAdd += `\n\tconstructor(protected injector: Injector) {}`;
    toAdd += `\n\n\tpublic ngDoBootstrap() {\n\t\tconst ${variableName} = createCustomElement(${component}, { injector: this.injector });`;
    toAdd += `\n\n\t\tcustomElements.define(${selector}, ${variableName});\n\t}\n`;

    bootstrapChanges.push(new InsertChange(appModule, node.pos-1, 'implements DoBootstrap '));
    bootstrapChanges.push(new InsertChange(appModule, node.pos, toAdd));
    bootstrapChanges.push(insertImport(sourceFile, appModule, 'DoBootstrap', '@angular/core'));
    bootstrapChanges.push(insertImport(sourceFile, appModule, 'Injector', '@angular/core'));
    bootstrapChanges.push(insertImport(sourceFile, appModule, 'createCustomElement', '@angular/elements'));
    bootstrapChanges.push(insertImport(sourceFile, appModule, component, constructWorkspacePath(options, 'common')));
    bootstrapChanges.push(insertImport(sourceFile, appModule, selector, constructWorkspacePath(options, 'common')));
  } else { // Any subsequent time the solution command is run - only adds the new lines
    toAdd += `\n\t\tconst ${variableName} = createCustomElement(${component}, { injector: this.injector });`;
    toAdd += `\n\n\t\tcustomElements.define(${selector}, ${variableName});\n\t`;  

    bootstrapChanges.push(new InsertChange(appModule, node.end - 1, toAdd));
    bootstrapChanges.push(insertImport(sourceFile, appModule, component, constructWorkspacePath(options, 'common')));
    bootstrapChanges.push(insertImport(sourceFile, appModule, selector, constructWorkspacePath(options, 'common')));
  }

  const recorder = host.beginUpdate(appModule);
  for (let change of bootstrapChanges) {
      if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
      }
  }
  host.commitUpdate(recorder);
}

/**
 * Adds given class to a module's declarations array
 * 
 * @param host The current application Tree
 * @param context The context containing data relating to module
 */
function addDeclaration(host: Tree, context: AddToModuleContext): void {
  const declarationChanges = addDeclarationToModule(
    context.source,
    context.filePath,
    context.classifiedName,
    context.relativePath);

  const declarationRecorder = host.beginUpdate(context.filePath);

  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

/**
 * Adds given class to a module's entryComponents array
 * 
 * @param host The current application Tree
 * @param context The context containing data relating to module
 */
function addEntryComponent(host: Tree, context: AddToModuleContext): void {
  const entryComponentChanges = addEntryComponentToModule(
    context.source,
    context.filePath,
    context.classifiedName,
    context.relativePath);

  const entryComponentRecorder = host.beginUpdate(context.filePath);

  for (const change of entryComponentChanges) {
    if (change instanceof InsertChange) {
      entryComponentRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(entryComponentRecorder);
}

/**
 * Adds given class to a module's exports array
 * 
 * @param host The current application Tree
 * @param context The context containing data relating to module
 */
function addExport(host: Tree, context: AddToModuleContext): void {
  const exportChanges = addExportToModule(
    context.source,
    context.filePath,
    context.classifiedName,
    context.relativePath);

  const exportRecorder = host.beginUpdate(context.filePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
}

/**
 * Adds given class to a module's imports array
 * 
 * @param host The current application Tree
 * @param context The context containing data relating to module
 */
function addImport(host: Tree, context: AddToModuleContext): void {
  const importChanges = addImportToModule(
    context.source,
    context.filePath,
    context.classifiedName,
    context.relativePath);

  const importRecorder = host.beginUpdate(context.filePath);

  for (const change of importChanges) {
    if (change instanceof InsertChange) {
      importRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(importRecorder);
}

/**
 * Adds given service to a module's providers array
 * 
 * @param host The current application Tree
 * @param context The context containing data relating to module
 */
function addProvider(host: Tree, context: AddToModuleContext): void {
  const providerChanges = addImportToModule(
    context.source,
    context.filePath,
    context.classifiedName,
    context.relativePath);

  const providerRecorder = host.beginUpdate(context.filePath);

  for (const change of providerChanges) {
    if (change instanceof InsertChange) {
      providerRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(providerRecorder);
}

/**
 * Adds given route to app-routing module's 'routes' array.
 * 
 * @param host The current application Tree.
 * @param context The context containing data relating to app-routing module.
 */
function addRoute(host: Tree, context: AddToRoutesContext): void {
  const routeChanges: Change[] = [
    addRouteDeclarationToModule(context.source, context.appRoutingModulePath, `{ path: '${context.route}', component: ${context.componentName} }`),
    insertImport(context.source, context.appRoutingModulePath, context.componentName, context.componentPath)
  ];

  const routeRecorder = host.beginUpdate(context.appRoutingModulePath);

  for (const change of routeChanges) {
    if (change instanceof InsertChange) {
      routeRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(routeRecorder);
}

/**
 * Builds a classified name (i.e. 'AppComponent') based on a given string.
 * 
 * @param name The name of the component.
 */
function constructClassifiedName(name: string): string {
  let component = name.endsWith('.ts') ? stringUtils.classify(name.slice(0, -3)) : stringUtils.classify(name);
  return (component.endsWith('Component')) ? component.split('.').join('') : component + 'Component';
}

/**
 * Checks if the module name is complete, otherwise it builds the full module name.
 * 
 * @param name The name of the module.
 */
function constructModuleName(name: string): string {
  return (name.endsWith('module.ts') ? name : name + '.module.ts');
}

/**
 * Builds the package name (scope & workspace) of the project.
 * 
 * @param options The options passed from the calling command
 * @param project The project name to append
 */
function constructWorkspacePath(options: any, project?: string): string {
  return (options.scope + '/' + options.workspace) + (project ? '-' + project : '');
}

/**
 * Creates the context data necessary for adding a component to a module.
 * 
 * @param host The current application Tree
 * @param options The options passed from the calling command
 */
function createAddToModuleContext(host: Tree, options: ModuleOptions | any): AddToModuleContext {
  const context = new AddToModuleContext();

  context.filePath = options.module || ''; 
  context.classifiedName = stringUtils.classify(`${options.workspace}`) + stringUtils.classify(`${options.name}ElementComponent`);

  const componentPath = `${options.path}/`
  + stringUtils.dasherize(options.name) + '/'
  + stringUtils.dasherize(options.name)
  + '.component';

  context.relativePath = buildRelativePath(context.filePath, componentPath);

  const buffer = host.read(context.filePath);

  if (!buffer) throw new SchematicsException(`File ${context.filePath} does not exist.`);

  context.source = ts.createSourceFile(
    context.filePath,
    buffer.toString('utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  return context;
}


/**
 * Creates the context data necessary for adding certain elements (component, directives, etc.) to a module.
 * 
 * @param host The current application Tree
 * @param options The options passed from the calling command
 */
function createAddElementToModuleContext(host: Tree, options: ModuleOptions | any): AddToModuleContext {
  const context = new AddToModuleContext();

  context.filePath = options.module || options.filePath;
  context.classifiedName = options.classifiedName;
  context.relativePath = buildRelativePath(context.filePath, options.componentPath);

  const buffer = host.read(context.filePath);
  
  if (!buffer) throw new SchematicsException(`File ${context.filePath} does not exist.`);

  context.source = ts.createSourceFile(
    context.filePath,
    buffer.toString('utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  return context;
}

/**
 * Creates the context data necessary for adding a new route to the app-routing.module file.
 * 
 * @param host The current application Tree
 * @param context The routes context given from the calling command.
 */
function createRouteContext(host: Tree, context: AddToRoutesContext): AddToRoutesContext {
  context.route = context.route ? context.route : stringUtils.dasherize(context.componentName);
  context.componentName = constructClassifiedName(context.componentName);

  const buffer = host.read(context.appRoutingModulePath);

  if (!buffer) throw new SchematicsException(`No routing module file found in ${context.appRoutingModulePath}.`);

  context.source = context.source ? context.source : ts.createSourceFile(
    context.appRoutingModulePath,
    buffer.toString('utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  return context;
}

/**
 * Creates the context data necessary for updating/adding a module to the app.module file.
 * 
 * @param host The current application Tree.
 * @param options The options passed from the calling command.
 * @param appModulePath Optional path of the module you want updated.
 * @param forRoot Optional boolean to indicate if the module uses a forRoot() method.
 */
function createUpdateModuleContext(host: Tree, options: ModuleOptions | any, appModulePath?: string, forRoot?: boolean): AddToModuleContext {
  const context = new AddToModuleContext();

  context.filePath = findFileByName('app.module.ts', appModulePath ? appModulePath : '/projects/lcu/src/app', host);
  context.classifiedName = classify(`${options.workspace}Module`) + (forRoot ? '.forRoot()' : '');
  context.relativePath = constructWorkspacePath(options, 'common');

  let buffer = host.read(context.filePath);

  if (!buffer) throw new SchematicsException(`File ${context.filePath} does not exist.`);

  context.source =ts.createSourceFile(
    context.filePath,
    buffer.toString('utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  return context;
}

/**
 * Parses a given file and finds the first (empty) class block node, returning it.
 * Used if you want to add content to the body block of a class.
 * 
 * @param sourceFile A given file that you want to find a class block in
 * @param className A given class name  you want to find a class block in (i.e. 'AppComponent')
 */
function findClassBlock(sourceFile: any, className: string): any {
  let nodes = getSourceNodes(sourceFile);
  let classNode = nodes.find(n => n.kind == ts.SyntaxKind.ClassKeyword);

  if (!classNode) {
    throw new SchematicsException(`Expected class in ${sourceFile.fileName}.`);
  }
  
  if (!classNode.parent) {
      throw new SchematicsException(`Expected class in ${sourceFile.fileName} to have a parent node.`);
  }

  let siblings = classNode.parent.getChildren();
  let classIndex = siblings.indexOf(classNode);

  siblings = siblings.slice(classIndex);

  let classIdentifierNode = siblings.find(n => n.kind === ts.SyntaxKind.Identifier);

  if (!classIdentifierNode) {
      throw new SchematicsException(`Expected class in ${sourceFile.fileName} to have an identifier.`);
  }

  if (classIdentifierNode.getText() !== className) {
      throw new SchematicsException(`Expected first class in ${sourceFile.fileName} to have the name '${className}'.`);
  }

  let curlyNodeIndex = siblings.findIndex(n => n.kind === ts.SyntaxKind.FirstPunctuation);

  siblings = siblings.slice(curlyNodeIndex);

  let listNode = siblings.find(n => n.kind === ts.SyntaxKind.SyntaxList);

  if (!listNode) {
      throw new SchematicsException(`Expected first class in ${sourceFile.fileName} to have a body.`);
  }
  return listNode;
}

/**
 * Parses a given file and class block and finds the specified function node, returning it.
 * Used if you want to add/modify content to the body block of a function.
 * 
 * @param sourceFile A given file that you want to find a class block in
 * @param className A given class name  you want to find a class block in (i.e. 'AppComponent')
 * @param functionName A given function name that you want to find within the class block (i.e. 'ngDoBootstrap')
 */
function findClassMethod(sourceFile: any, className: string, functionName: string): any {
  let classNode = findClassBlock(sourceFile, className);

  if (classNode.getWidth() > 0) {
    return classNode.getChildren().find(
      (n: ts.Node | any) => n.kind === ts.SyntaxKind.MethodDeclaration && n.name && n.name.escapedText === functionName);
  } else {
    return classNode;
  }
}

/**
 * Finds and returns the full path of a given file.
 * 
 * @param file The name of the file (i.e. 'app.module.ts')
 * @param path The path of the given file (i.e. '/projects/lcu/src/lib')
 * @param host The current application Tree
 */
function findFileByName(file: string, path: string, host: Tree): string {
  let dir: DirEntry | null = host.getDir(path);

  while(dir) {
      let fileName = dir.path + '/' + file;
      if (host.exists(fileName)) {
          return fileName;
      }
      dir = dir.parent;
  }
  throw new SchematicsException(`File ${file} not found in ${path} or one of its ancestors`);
}
