import { Rule, SchematicContext, Tree, apply, url, template, chain, mergeWith, MergeStrategy, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function blah(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.error('Doing blah...');
    
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
