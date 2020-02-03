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

export function documentation(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info(`documentation() rule initialized...`);
    context.logger.info(`documentation() options: ${JSON.stringify(options)}`);
    setupOptions(host, options);

    const workspace = getWorkspace(host);

    var project = workspace.projects[options.project];

    const targetPath = normalize(project.root + "/src/" + options.path);

    const templateSource = apply(url("./files"), [
      template({
        ...strings,
        ...options
      }),
      move(targetPath)
    ]);

    return chain([
      mergeWith(templateSource, MergeStrategy.Default),
    //   !options.export ? noop() : prepareLcuApiExport(project, options)
    ]);
  };
}

function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  options.project = options.project
    ? options.project
    : workspace.defaultProject
    ? <string>workspace.defaultProject
    : Object.keys(workspace.projects)[0];

  options.path = options.path || "docs";

  options.export = options.export || "src/lcu.api.ts";

  options.name = options.name || "docs";

  options.spec = options.spec || false;

  return host;
}
