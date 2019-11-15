import * as ts from 'typescript';
import {
  Rule,
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';
import { buildRelativePath, ModuleOptions } from '@schematics/angular/utility/find-module';
import { addDeclarationToModule, addExportToModule, addEntryComponentToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;
const stringUtils = { dasherize, classify };

export class AddToModuleContext {
  source: any;
  relativePath: string;
  classifiedName: string;
}

export function addSolutionToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    addExport(host, options);
    addEntryComponent(host, options);
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  const componentPath = `${options.path}/`
    + stringUtils.dasherize(options.name) + '/'
    + stringUtils.dasherize(options.name)
    + '.component';

  result.relativePath = buildRelativePath(options.module, componentPath);

  // TODO: Get workspace in a cleaner manner
  let lcuFile = host.get('lcu.json');
  let lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};
  let workspace = lcuJson.templates.workspace;

  result.classifiedName = stringUtils.classify(`${workspace}`) + stringUtils.classify(`${options.name}ElementComponent`);
  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addDeclarationToModule(
    context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const declarationRecorder = host.beginUpdate(modulePath);

  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
};

function addExport(host: Tree, options: ModuleOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const exportChanges = addExportToModule(
    context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
};

function addEntryComponent(host: Tree, options: ModuleOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const entryComponentChanges = addEntryComponentToModule(
    context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const entryComponentRecorder = host.beginUpdate(modulePath);

  for (const change of entryComponentChanges) {
    if (change instanceof InsertChange) {
      entryComponentRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(entryComponentRecorder);
};
