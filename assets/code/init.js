
function loadHTMLContent(htmlFilePath) {
    readf(htmlFilePath, function (htmlContent) {
        document.getElementById('content').innerHTML = htmlContent;
    });
}

function loadCSS(cssFilePath) {
    readf(cssFilePath, function (cssContent) {
        const style = document.createElement('style');
        style.textContent = cssContent;
        document.head.appendChild(style);
    });
}

function loadJS(jsFilePath) {
    readf(jsFilePath, function (jsContent) {
        const script = document.createElement('script');
        script.textContent = jsContent;
        document.body.appendChild(script);
    });
}
