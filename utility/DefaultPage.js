export default function DefaultPage(html) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>def</title>
        </head>
        <body>
            <div id="root">${html}</div>
            <script src="/build/bundle.js"></script>
        </body>
    </html>
`
}