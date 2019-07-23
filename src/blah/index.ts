import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function blah(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.error('Doing blah...');
    
    return tree;
  };
}
