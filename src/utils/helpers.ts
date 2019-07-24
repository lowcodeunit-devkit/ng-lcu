import { SchematicsException, Tree } from "@angular-devkit/schematics";
import {
    JsonAstArray,
    JsonAstKeyValue,
    JsonAstNode,
    JsonAstObject,
    JsonValue,
    parseJsonAst,
    JsonParseMode,
    strings,
    join,
    Path
} from "@angular-devkit/core";
import { UpdateRecorder } from "@angular-devkit/schematics";

const pkgJsonPath = "/package.json";
const angularJsonPath = "/angular.json";
const configJsonPath = "/../../.rocket-rc.json";

export enum NodeDependencyType {
    Default = "dependencies",
    Dev = "devDependencies",
    Peer = "peerDependencies",
    Optional = "optionalDependencies"
}

export interface NodeDependency {
    type: NodeDependencyType;
    name: string;
    version: string;
    overwrite?: boolean;
}

export interface NodeKeyValue {
    key: string;
    value: string;
}

export function addIntoPackageJson(host: Tree, nodeName: string, kvp: NodeKeyValue): Tree {
    const packageJsonAst = _readJson(host, pkgJsonPath);
    const scriptsNode = findPropertyInAstObject(packageJsonAst, nodeName);
    const recorder = host.beginUpdate(pkgJsonPath);
    if (!scriptsNode) {
        // Haven't found the scripts key, add it to the root of the package.json.
        appendPropertyInAstObject(
            recorder,
            packageJsonAst,
            "scripts",
            {
                [kvp.key]: kvp.value
            },
            2
        );
    } else if (scriptsNode.kind === "object") {
        const scriptNode = findPropertyInAstObject(scriptsNode, kvp.key);
        if (!scriptNode) {
            insertPropertyInAstObjectInOrder(recorder, scriptsNode, kvp.key, kvp.value, 4);
        } else {
            // found, we need to overwrite
            const { end, start } = scriptNode;
            recorder.remove(start.offset, end.offset - start.offset);

            recorder.insertRight(start.offset, kvp.value);
        }
    }
    host.commitUpdate(recorder);
    return host;
}

export function addScriptIntoPackageJson(host: Tree, script: NodeKeyValue): Tree {
    return addIntoPackageJson(host, 'scripts', script);
}

export function adjustValueInPackageFile(host: Tree, key: string, name: string, packageRoot: Path = <Path>""): Tree {
    var pkgPath = join(packageRoot, pkgJsonPath);

    const packageJsonAst = _readJson(host, pkgPath);

    const nameNode = findPropertyInAstObject(packageJsonAst, key);

    const recorder = host.beginUpdate(pkgPath);

    if (!nameNode) {
        // Haven't found the name key, add it to the root of the package.json.
        appendPropertyInAstObject(recorder, packageJsonAst, key, name, 2);
    } else {
        // found, we need to overwrite
        const { end, start } = nameNode;

        recorder.remove(start.offset, end.offset - start.offset);

        recorder.insertRight(start.offset, name);
    }

    host.commitUpdate(recorder);

    const packageJsonAst2 = _readJson(host, pkgPath);

    return host;
}

export function removeFilesFromRoot(host: Tree, root: Path, files: string[]) {
    files.forEach(filename => {
        var filePath = join(root, filename);

        if (host.exists(filePath)) {
            host.delete(filePath);
        }
    });
}

export function addScriptsToPackageFile(host: Tree, scripts: any[]) {
    scripts.forEach(script => {
        addScriptIntoPackageJson(host, script);
    });

    return host;
}

export function addPackageJsonDependency(tree: Tree, dependency: NodeDependency): void {
    const packageJsonAst = _readPackageJson(tree);
    const depsNode = findPropertyInAstObject(packageJsonAst, dependency.type);
    const recorder = tree.beginUpdate(pkgJsonPath);
    if (!depsNode) {
        // Haven't found the dependencies key, add it to the root of the package.json.
        appendPropertyInAstObject(
            recorder,
            packageJsonAst,
            dependency.type,
            {
                [dependency.name]: dependency.version
            },
            2
        );
    } else if (depsNode.kind === "object") {
        // check if package already added
        const depNode = findPropertyInAstObject(depsNode, dependency.name);

        if (!depNode) {
            // Package not found, add it.
            insertPropertyInAstObjectInOrder(recorder, depsNode, dependency.name, dependency.version, 4);
        } else if (dependency.overwrite) {
            // Package found, update version if overwrite.
            const { end, start } = depNode;
            recorder.remove(start.offset, end.offset - start.offset);
            recorder.insertRight(start.offset, JSON.stringify(dependency.version));
        }
    }

    tree.commitUpdate(recorder);
}

export function appendPropertyInAstObject(
    recorder: UpdateRecorder,
    node: JsonAstObject,
    propertyName: string,
    value: JsonValue,
    indent: number
) {
    const indentStr = _buildIndent(indent);

    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, "").length, ",");
    }

    recorder.insertLeft(
        node.end.offset - 1,
        "  " + `"${propertyName}": value.replace(/\n/g, indentStr)}` + indentStr.slice(0, -2)
    );
}

export function insertPropertyInAstObjectInOrder(
    recorder: UpdateRecorder,
    node: JsonAstObject,
    propertyName: string,
    value: JsonValue,
    indent: number
) {
    if (node.properties.length === 0) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);

        return;
    }

    // Find insertion info.
    let insertAfterProp: JsonAstKeyValue | null = null;
    let prev: JsonAstKeyValue | null = null;
    let isLastProp = false;
    const last = node.properties[node.properties.length - 1];
    for (const prop of node.properties) {
        if (prop.key.value > propertyName) {
            if (prev) {
                insertAfterProp = prev;
            }
            break;
        }
        if (prop === last) {
            isLastProp = true;
            insertAfterProp = last;
        }
        prev = prop;
    }

    if (isLastProp) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);

        return;
    }

    const indentStr = _buildIndent(indent);

    const insertIndex = insertAfterProp === null ? node.start.offset + 1 : insertAfterProp.end.offset + 1;

    recorder.insertRight(
        insertIndex,
        indentStr + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}` + ","
    );
}

export function appendValueInAstArray(recorder: UpdateRecorder, node: JsonAstArray, value: JsonValue, indent = 4) {
    const indentStr = _buildIndent(indent);

    if (node.elements.length > 0) {
        // Insert comma.
        const last = node.elements[node.elements.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, "").length, ",");
    }

    recorder.insertLeft(
        node.end.offset - 1,
        "  " + JSON.stringify(value, null, 2).replace(/\n/g, indentStr) + indentStr.slice(0, -2)
    );
}

export function findPropertyInAstObject(node: JsonAstObject, propertyName: string): JsonAstNode | null {
    let maybeNode: JsonAstNode | null = null;
    for (const property of node.properties) {
        if (property.key.value == propertyName) {
            maybeNode = property.value;
        }
    }

    return maybeNode;
}

function _buildIndent(count: number): string {
    return "\n" + new Array(count + 1).join(" ");
}
function _readJson(tree: Tree, path: string): JsonAstObject {
    const buffer = tree.read(path);
    if (buffer === null) {
        throw new SchematicsException(`Could not read ${path}.`);
    }
    const content = buffer.toString();

    const json = parseJsonAst(content, JsonParseMode.Strict);
    if (json.kind != "object") {
        throw new SchematicsException(`Invalid ${path}. Was expecting an object`);
    }

    return json;
}

function _readPackageJson(tree: Tree): JsonAstObject {
    const buffer = tree.read(pkgJsonPath);
    if (buffer === null) {
        throw new SchematicsException("Could not read package.json.");
    }
    const content = buffer.toString();

    const packageJson = parseJsonAst(content, JsonParseMode.Strict);
    if (packageJson.kind != "object") {
        throw new SchematicsException("Invalid package.json. Was expecting an object");
    }

    return packageJson;
}
