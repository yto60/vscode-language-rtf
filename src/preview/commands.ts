import * as vscode from "vscode";
import { Container } from "../container";
import { getPreviewHtml } from "./previewHtml";

export function registerPreviewCommand() {
    Container.context.subscriptions.push(
        vscode.commands.registerCommand("rtf.preview", () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage("No active editor found. Please open an RTF file.");
                return;
            }

            const document = editor.document;

            // Check if the document is an RTF file
            if (document.languageId !== "rtf" && !document.fileName.endsWith(".rtf")) {
                vscode.window.showErrorMessage("The active file is not an RTF file.");
                return;
            }

            // Create and show webview panel
            const panel = vscode.window.createWebviewPanel(
                "rtfPreview",
                "RTF Preview",
                {
                    viewColumn: vscode.ViewColumn.Beside,
                    preserveFocus: true
                },
                {
                    enableScripts: true
                }
            );

            // Get RTF text and set HTML content
            const rtfText = document.getText();
            panel.webview.html = getPreviewHtml(rtfText, panel.webview);
        })
    );
}

