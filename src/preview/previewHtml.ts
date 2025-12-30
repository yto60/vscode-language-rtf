import * as vscode from "vscode";

/**
 * Converts RTF text to HTML for preview display.
 * This is a placeholder implementation that can be replaced with a proper RTF parser later.
 */
function convertRtfToHtml(rtfText: string): string {
    // For now, just escape the text and display it in a pre tag
    // This can be replaced with a proper RTF-to-HTML conversion library later
    const escapedText = rtfText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    return `<pre>${escapedText}</pre>`;
}

/**
 * Generates HTML content for the RTF preview webview.
 */
export function getPreviewHtml(rtfText: string, webview: vscode.Webview): string {
    const htmlContent = convertRtfToHtml(rtfText);

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
    ${htmlContent}
</body>
</html>`;
}

