import { getWorkspace } from "@schematics/angular/utility/config";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";
import {
    Rule,
    SchematicContext,
    Tree,
    apply,
    url,
    noop,
    filter,
    move,
    MergeStrategy,
    mergeWith,
    template,
    chain,
    externalSchematic
} from "@angular-devkit/schematics";
import { ProjectType, WorkspaceProject } from "@schematics/angular/utility/workspace-models";
import { normalize, strings, Path, join } from "@angular-devkit/core";
import { addDeployScriptsToPackageFile } from "../utils/helpers";
import { Logger } from "@angular-devkit/core/src/logger";

export function application(options: any): Rule {
    return (host: Tree, context: SchematicContext) => {
        setupOptions(host, options);

        const rule = chain([
            externalSchematic("@schematics/angular", "application", {
                name: options.name,
                routing: true,
                prefix: options.prefix,
                style: "scss"
            }),
            processInitWith(options, context),
            addScripts(options),
            manageDeployAllScript(options),
            manageAppAssets(options)
        ]);

        if (!options.skipInstall) context.addTask(new NodePackageInstallTask());

        return rule(host, context);
    };
}

export function addScripts(options: any) {
    return (host: Tree) => {
        const workspace = getWorkspace(host);

        var project = workspace.projects[options.name];

        var projectSafeName = strings.dasherize(options.name);

        addDeployScriptsToPackageFile(host, [
            {
                key: `deploy:${projectSafeName}`,
                value: `ng build ${projectSafeName} --prod && npm publish ./dist/${projectSafeName} --access public`
            }
        ]);

        return host;
    };
}

export function manageAppAssets(options: any) {
    return (host: Tree) => {
        var projectSafeName = strings.dasherize(options.name);

        var packageGlob = {
            glob: "package.json",
            input: "./",
            output: "/"
        };

        var angularFile = host.get("angular.json");

        var angularJson = angularFile ? JSON.parse(angularFile.content.toString("utf8")) : {};

        angularJson.projects[projectSafeName].architect.build.options.assets.push(packageGlob);

        host.overwrite("angular.json", JSON.stringify(angularJson, null, "\t"));

        return host;
    };
}

export function manageDeployAllScript(options: any) {
    return (host: Tree) => {
        var projectSafeName = strings.dasherize(options.name);

        var deployProj = `npm run deploy:${projectSafeName}`;

        var packageFile = host.get("package.json");

        var packageJson = packageFile ? JSON.parse(packageFile.content.toString("utf8")) : {};

        var deployAll = packageJson.scripts["deploy:all"];

        if (deployAll) deployAll += ` && ${deployProj}`;
        else deployAll = deployProj;

        packageJson.scripts["deploy:all"] = deployAll;

        host.overwrite("package.json", JSON.stringify(packageJson, null, "\t"));

        return host;
    };
}

function blankOutLibrary(options: any, context: SchematicContext) {
    return (host: Tree) => {
        var projectName = options.name;

        var workspace = getWorkspace(host);

        var project = workspace.projects[projectName];

        var srcRoot = join(project.root as Path, "src");

        var appRoot = join(srcRoot, "app");

        if (host.exists(appRoot)) host.delete(appRoot);

        host.create(join(appRoot, '.gitkeep'), '');

        return host;
    };
}

function processInitWith(options: any, context: SchematicContext) {
  return (host: Tree) => {
    context.logger.info(`Processing Initialization for ${options.initWith}...`);

    var rule: Rule = noop();

    switch (options.initWith) {
      case "Default":
        break;

      case "Blank":
        rule = blankOutLibrary(options, context);
        break;

      case "Forge":
        rule = chain([
          blankOutLibrary(options, context),
          externalSchematic('@lowcodeunit-devkit/ng-lcu', 'forge', {
            name: options.name,
            project: options.name,
          })
        ]);
        break;
    }

    context.logger.info(`Processing Initialized for ${options.initWith}!`);

    return rule;
  };
}

export function setupOptions(host: Tree, options: any): Tree {
    options.entryFile = "lcu.api";

    options.initWith = options.initWith || "Default";

    options.name = options.name || "library";

    options.prefix = options.prefix || "lib";

    options.skipInstall = options.skipInstall || false;

    return host;
}
