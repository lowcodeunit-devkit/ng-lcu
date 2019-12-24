import { Rule, Tree, SchematicContext, chain, mergeWith, move, template, apply, url, MergeStrategy } from "@angular-devkit/schematics";
import { getWorkspace } from "@schematics/angular/utility/config";
import { normalize, strings } from "@angular-devkit/core";

export function lcuStarterApp(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
        context.logger.info(`lcuStarterApp() - initializing... ${JSON.stringify(options)}`);
        setupOptions(host, options);

        context.logger.info(`lcuStarterApp() - options: ${JSON.stringify(options)}`);
        const workspace = getWorkspace(host);
        let project = workspace.projects[options.project];

        const targetPath = normalize(project.root + '/src');

        const appSource = apply(url('./files/app'), [
            template({
                ...strings,
                ...options,
            }),
            move(targetPath + '/app'),
        ]);

        const styleSource = apply(url('./files/style'), [
            template({
                ...strings,
                ...options,
            }),
            move(targetPath),
        ]);

        return chain([
            mergeWith(appSource, MergeStrategy.Default),
            mergeWith(styleSource, MergeStrategy.Overwrite)
        ]);
    };
}

function setupOptions(host: Tree, options: any): Tree {
    let lcuFile = host.get('lcu.json');

    let lcuJson = lcuFile ? JSON.parse(lcuFile.content.toString('utf8')) : {};
  
    const workspace = getWorkspace(host);
  
    options.scope = lcuJson.templates.scope;
  
    options.workspace = lcuJson.templates.workspace;
  
    options.project = options.project ? options.project :
      workspace.defaultProject ? <string>workspace.defaultProject : Object.keys(workspace.projects)[0];
  
    options.name = options.name;
  
    return host;
}