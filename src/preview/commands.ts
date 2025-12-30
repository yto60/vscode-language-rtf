import * as vscode from "vscode";
import * as path from "path";
import { Container } from "../container";
import { showPreviewHtml } from "./previewHtml";

let currentPanel: vscode.WebviewPanel | undefined;
let currentDocumentUri: vscode.Uri | undefined;

function isRtfDocument(document: vscode.TextDocument): boolean {
    return document.languageId === "rtf" || document.fileName.endsWith(".rtf");
}

function updatePreviewForDocument(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel
): void {
    if (!isRtfDocument(document)) {
        return;
    }

    const rtfText = document.getText();
    showPreviewHtml(rtfText, panel.webview);

    currentPanel = panel;
    currentDocumentUri = document.uri;
}

export function registerPreviewCommand() {
    const context = Container.context;

    // Register the preview command
    context.subscriptions.push(
        vscode.commands.registerCommand("rtf.preview", () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage("No active editor found. Please open an RTF file.");
                return;
            }

            const document = editor.document;

            // Check if the document is an RTF file
            if (!isRtfDocument(document)) {
                vscode.window.showErrorMessage("The active file is not an RTF file.");
                return;
            }

            // Create and show webview panel
            const panel = vscode.window.createWebviewPanel(
                "rtfPreview",
                `Preview ${path.basename(document.fileName)}`,
                {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                },
                {
                    enableScripts: true
                }
            );

            // Set panel icon
            panel.iconPath = vscode.Uri.joinPath(
                Container.context.extensionUri,
                "images",
                "icon.png"
            );

            panel.onDidDispose(() => {
                if (currentPanel === panel) {
                    currentPanel = undefined;
                    currentDocumentUri = undefined;
                }
            });

            updatePreviewForDocument(document, panel);
        })
    );

    // Subscribe to save events: refresh current preview when an RTF file is saved
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (!currentPanel) {
                return;
            }

            if (!isRtfDocument(document)) {
                return;
            }

            if (currentDocumentUri && document.uri.toString() !== currentDocumentUri.toString()) {
                return;
            }

            updatePreviewForDocument(document, currentPanel);
        })
    );
}
