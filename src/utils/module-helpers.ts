import * as ts from 'typescript';
import {
  Rule,
  Tree,
  SchematicsException,
  DirEntry
} from '@angular-devkit/schematics';
import { buildRelativePath, ModuleOptions } from '@schematics/angular/utility/find-module';
import { addDeclarationToModule, addExportToModule, addEntryComponentToModule, addImportToModule, insertImport, getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { InsertChange, Change } from '@schematics/angular/utility/change';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;
const stringUtils = { dasherize, classify };

export class AddToModuleContext {
  classifiedName: string;
  filePath: string;
  relativePath: string;
  source: any;
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
 * When the 'lcu' command is executed, it updates the 'lcu' project app.module and adds project module to it.
 * 
 * @param options The options passed from the calling command
 */
export function updateAppModule(options: ModuleOptions, appModulePath?: string): Rule {
  return (host: Tree) => {
    addImport(host, createUpdateModuleContext(host, options, appModulePath));
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
  let selector = 'Selector' + stringUtils.classify(`${options.workspace}`) + stringUtils.classify(`${options.name}Element`);

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

  let node = findClassBlock(sourceFile, 'AppModule');

  if (node.getWidth() > 0) {
    throw new SchematicsException(`Expected body in ${sourceFile.fileName} to be empty. Set 'disableLcuBootstrap' option to true to create solution without custom bootstrap.`);
  }

  let toAdd = `\n\tconstructor(protected injector: Injector) {}`;
  toAdd += `\n\n\tpublic ngDoBootstrap() {\n\t\tconst cfgMgr = createCustomElement(${component}, { injector: this.injector });`
  toAdd += `\n\n\t\tcustomElements.define(${selector}, cfgMgr);\n\t}\n`

  let bootstrapChanges: Change[] = [
    new InsertChange(appModule, node.pos-1, 'implements DoBootstrap '),
    new InsertChange(appModule, node.pos, toAdd),
    insertImport(sourceFile, appModule, 'DoBootstrap', '@angular/core'),
    insertImport(sourceFile, appModule, 'Injector', '@angular/core'),
    insertImport(sourceFile, appModule, 'createCustomElement', '@angular/elements'),
    insertImport(sourceFile, appModule, component, constructWorkspacePath(options, 'common')),
    insertImport(sourceFile, appModule, selector, constructWorkspacePath(options, 'common'))
  ];

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
};

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
};

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
};

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
};

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
  const result = new AddToModuleContext();

  result.filePath = options.module || ''; 
  result.classifiedName = stringUtils.classify(`${options.workspace}`) + stringUtils.classify(`${options.name}ElementComponent`);

  const componentPath = `${options.path}/`
  + stringUtils.dasherize(options.name) + '/'
  + stringUtils.dasherize(options.name)
  + '.component';

  result.relativePath = buildRelativePath(result.filePath, componentPath);

  const text = host.read(result.filePath);
  if (!text) throw new SchematicsException(`File ${result.filePath} does not exist.`);
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(result.filePath, sourceText, ts.ScriptTarget.Latest, true);

  return result;
}

/**
 * Creates the context data necessary for updating/adding a module to the app.module file.
 * 
 * @param host The current application Tree
 * @param options The options passed from the calling command
 */
function createUpdateModuleContext(host: Tree, options: ModuleOptions | any, appModulePath?: string): AddToModuleContext {
  const result = new AddToModuleContext();

  result.filePath = findFileByName('app.module.ts', appModulePath ? appModulePath : '/projects/lcu/src/app', host);
  result.classifiedName = classify(`${options.workspace}Module`);
  result.relativePath = constructWorkspacePath(options, 'common');

  let text = host.read(result.filePath);
  if (!text) throw new SchematicsException(`File ${result.filePath} does not exist.`);
  let sourceText = text.toString('utf-8');
  result.source =ts.createSourceFile(result.filePath, sourceText, ts.ScriptTarget.Latest, true);

  return result;
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
