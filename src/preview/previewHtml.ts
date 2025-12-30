import * as vscode from "vscode";
import * as rtfToHTML from '@iarna/rtf-to-html';

function outputTemplate (_doc: any, _defaults: any, content: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RTF Preview</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: 1.5;
            margin: 0;
        }
    </style>
</head>
<body>
${content.replace(/\n/g, '\n    ')}
</body>
</html>`
  }

/**
 * Generates and sets HTML content for the RTF preview webview.
 */
export function showPreviewHtml(rtfText: string, webview: vscode.Webview) {
    rtfToHTML.fromString(rtfText, { template: outputTemplate }, (err, res) => {
        webview.html = res
    })
}
