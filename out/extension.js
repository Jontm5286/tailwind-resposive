"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// Regex patterns for different file types
const CLASS_ATTRIBUTE_PATTERNS = {
    html: /class=["']([^"']*)["']/g,
    jsx: /className=["']([^"']*)["']/g,
    vue: /class=["']([^"']*)["']/g,
    svelte: /class=["']([^"']*)["']/g,
};
// Utility function to categorize Tailwind classes
function categorizeTailwindClasses(classNames) {
    const result = {
        layout: [],
        positioning: [],
        display: [],
        flexbox: [],
        grid: [],
        spacing: [],
        sizing: [],
        typography: [],
        backgrounds: [],
        borders: [],
        effects: [],
        transitions: [],
        transforms: [],
        interactivity: [],
        other: [],
    };
    const patterns = {
        layout: /^(container|object-|overflow|overscroll|z-)/,
        positioning: /^(static|fixed|absolute|relative|sticky|inset|top|right|bottom|left)/,
        display: /^(block|inline|flex|grid|hidden|visible|invisible)/,
        flexbox: /^(flex-|justify-|items-|self-|order-)/,
        grid: /^(grid-|col-|row-|gap-)/,
        spacing: /^(p|m)([trblxy]|[^a-z])/,
        sizing: /^(w-|h-|min-|max-)/,
        typography: /^(font-|text-|leading-|tracking-|align-|whitespace-|break-|placeholder-)/,
        backgrounds: /^(bg-|gradient-|from-|via-|to-)/,
        borders: /^(border-|rounded-|divide-)/,
        effects: /^(shadow-|opacity-|mix-|blur-)/,
        transitions: /^(transition-|duration-|ease-|delay-)/,
        transforms: /^(transform-|rotate-|scale-|skew-|translate-)/,
        interactivity: /^(appearance-|cursor-|outline-|pointer-|select-|focus-|hover-|active-)/,
    };
    classNames.forEach((className) => {
        let categorized = false;
        // Check each pattern category
        for (const [category, pattern] of Object.entries(patterns)) {
            if (pattern.test(className)) {
                result[category].push(className);
                categorized = true;
                break;
            }
        }
        // If not categorized, add to other
        if (!categorized) {
            result.other.push(className);
        }
    });
    return result;
}
// Formats Tailwind classes based on specified sort order
const BREAKPOINTS_ORDER = ["sm", "md", "lg", "xl", "2xl"];
function formatTailwindClasses(classStr, sortOrder) {
    try {
        // Remove duplicate classes and split into array
        const uniqueClasses = Array.from(new Set(classStr.trim().split(/\s+/).filter(Boolean)));
        if (sortOrder === "alphabetical") {
            // Simple alphabetical sorting
            return uniqueClasses.sort().join(" ");
        }
        else if (sortOrder === "recommended" || sortOrder === "custom") {
            // Handle breakpoints and categorize classes
            const defaultClasses = [];
            const breakpointGroups = {};
            // Separate classes by breakpoints
            uniqueClasses.forEach((cls) => {
                if (!cls)
                    return;
                const breakpoint = BREAKPOINTS_ORDER.find((bp) => cls.startsWith(`${bp}:`));
                if (breakpoint) {
                    const pureClass = cls.replace(`${breakpoint}:`, "");
                    if (!breakpointGroups[breakpoint])
                        breakpointGroups[breakpoint] = [];
                    breakpointGroups[breakpoint].push(pureClass);
                }
                else {
                    defaultClasses.push(cls);
                }
            });
            // Categorize default classes
            const categorized = categorizeTailwindClasses(defaultClasses);
            // Build result with categorized classes first
            let result = [
                ...categorized.layout,
                ...categorized.positioning,
                ...categorized.display,
                ...categorized.flexbox,
                ...categorized.grid,
                ...categorized.spacing,
                ...categorized.sizing,
                ...categorized.typography,
                ...categorized.backgrounds,
                ...categorized.borders,
                ...categorized.effects,
                ...categorized.transitions,
                ...categorized.transforms,
                ...categorized.interactivity,
                ...categorized.other,
            ].join(" ");
            // Add breakpoint classes in order
            BREAKPOINTS_ORDER.forEach((breakpoint) => {
                const classes = breakpointGroups[breakpoint];
                if ((classes === null || classes === void 0 ? void 0 : classes.length) > 0) {
                    const categorizedBreakpoint = categorizeTailwindClasses(classes);
                    const breakpointClasses = [
                        ...categorizedBreakpoint.layout,
                        ...categorizedBreakpoint.positioning,
                        ...categorizedBreakpoint.display,
                        ...categorizedBreakpoint.flexbox,
                        ...categorizedBreakpoint.grid,
                        ...categorizedBreakpoint.spacing,
                        ...categorizedBreakpoint.sizing,
                        ...categorizedBreakpoint.typography,
                        ...categorizedBreakpoint.backgrounds,
                        ...categorizedBreakpoint.borders,
                        ...categorizedBreakpoint.effects,
                        ...categorizedBreakpoint.transitions,
                        ...categorizedBreakpoint.transforms,
                        ...categorizedBreakpoint.interactivity,
                        ...categorizedBreakpoint.other,
                    ].join(" ");
                    if (breakpointClasses) {
                        result += ` ${breakpoint}:${breakpointClasses}`;
                    }
                }
            });
            return result.trim();
        }
        // Default case - return unchanged
        return classStr;
    }
    catch (error) {
        console.error("Error formatting Tailwind classes:", error);
        return classStr; // Return original string on error
    }
}
// Main formatting function that processes the entire document
function formatDocumentTailwindClasses(document, sortOrder) {
    var _a;
    const edits = [];
    const text = document.getText();
    const fileExtension = (_a = document.fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    let pattern;
    // Select the appropriate regex pattern based on file type
    if (fileExtension === "jsx" || fileExtension === "tsx") {
        pattern = CLASS_ATTRIBUTE_PATTERNS.jsx;
    }
    else if (fileExtension === "vue") {
        pattern = CLASS_ATTRIBUTE_PATTERNS.vue;
    }
    else if (fileExtension === "svelte") {
        pattern = CLASS_ATTRIBUTE_PATTERNS.svelte;
    }
    else {
        // Default to HTML pattern
        pattern = CLASS_ATTRIBUTE_PATTERNS.html;
    }
    let match;
    while ((match = pattern.exec(text)) !== null) {
        // The full match including the class/className attribute
        const fullMatch = match[0];
        // Just the class content
        const classContent = match[1];
        // Format the class content
        const formattedClasses = formatTailwindClasses(classContent, sortOrder);
        // Only create an edit if there's a change
        if (formattedClasses !== classContent) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + fullMatch.length);
            // Replace the attribute content but keep the attribute name
            const replacement = fullMatch.replace(classContent, formattedClasses);
            edits.push(vscode.TextEdit.replace(new vscode.Range(startPos, endPos), replacement));
        }
    }
    return edits;
}
// Format on save functionality
function registerFormatOnSaveHandler(context) {
    const formatOnSaveDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
        const config = vscode.workspace.getConfiguration("tailwindFormatter");
        const formatOnSave = config.get("autoFormatOnPaste", true) ||
            config.get("formatOnSave", false);
        if (formatOnSave) {
            const document = event.document;
            const supportedLanguages = [
                "html",
                "javascript",
                "typescript",
                "javascriptreact",
                "typescriptreact",
                "vue",
                "svelte",
            ];
            if (supportedLanguages.includes(document.languageId)) {
                const sortOrder = config.get("sortOrder", "recommended");
                const edits = formatDocumentTailwindClasses(document, sortOrder);
                if (edits.length > 0) {
                    const edit = new vscode.WorkspaceEdit();
                    edits.forEach((textEdit) => {
                        edit.replace(document.uri, textEdit.range, textEdit.newText);
                    });
                    // Queue the edits to be applied before the document is saved
                    event.waitUntil(Promise.resolve(vscode.workspace.applyEdit(edit)));
                }
            }
        }
    });
    context.subscriptions.push(formatOnSaveDisposable);
}
// Extension activation function
function activate(context) {
    console.log("Tailwind Formatter extension is now active!");
    // Register the command to format Tailwind classes
    const commandDisposable = vscode.commands.registerCommand("tailwind-responsive.format", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage("No active editor found");
                return;
            }
            const document = editor.document;
            const config = vscode.workspace.getConfiguration("tailwindFormatter");
            const sortAlphabetically = config.get("sortAlphabetically", true);
            const edits = formatDocumentTailwindClasses(document, sortAlphabetically ? "alphabetical" : "recommended");
            if (edits.length > 0) {
                // Apply edits to document
                const edit = new vscode.WorkspaceEdit();
                edits.forEach((textEdit) => {
                    edit.replace(document.uri, textEdit.range, textEdit.newText);
                });
                yield vscode.workspace.applyEdit(edit);
                vscode.window.showInformationMessage(`Formatted ${edits.length} Tailwind class instances`);
            }
            else {
                vscode.window.showInformationMessage("No Tailwind classes found to format");
            }
        }
        catch (error) {
            console.error("Error executing Tailwind format command:", error);
            vscode.window.showErrorMessage(`Error formatting Tailwind classes: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    // Register command in extension context
    context.subscriptions.push(commandDisposable);
    // Register format on save handler
    registerFormatOnSaveHandler(context);
}
exports.activate = activate;
// Extension deactivation function
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map