import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');


describe('lcu-library', () => {
  it('works', async() => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    // const tree = runner.runSchematic('lcu-library', {}, Tree.empty());
    const tree = await runner.runSchematicAsync('lcu-library', {}, Tree.empty());

    // expect(tree.files).toEqual([]);
    tree.subscribe(tree=>{
      console.log(tree);
      expect(tree.files).toEqual([]);
    });
  });
});
