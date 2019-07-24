import { Rule, SchematicContext, Tree, apply, url, move, MergeStrategy, mergeWith, template, chain } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addScriptsToPackageFile, adjustValueInPackageFile } from '../utils/helpers';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function lcuCoreApp(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files/project'), [
      template({
        ...strings,
        ...options,
      }),
      move('./'),
    ]);

    const rule = chain([
      mergeWith(templateSource, MergeStrategy.Default)
    ]);

    return rule(tree, context);
  };
}
