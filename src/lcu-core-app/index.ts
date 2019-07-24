import { strings } from '@angular-devkit/core';
import {
  Rule, SchematicContext, SchematicsException, Tree,
  apply, branchAndMerge, mergeWith, template, url,
} from '@angular-devkit/schematics';
 
export function lcuCoreApp(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }
 
    const templateSource = apply(
      url('./files'),
      [
        template({
          ...strings,
          ...options,
        }),
      ]
    );
 
    return branchAndMerge(mergeWith(templateSource));
  };
}