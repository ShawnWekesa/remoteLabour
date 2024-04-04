window.addEventListener('load', function() {
    fetch('common.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const headContents = doc.head.innerHTML;
            const commonCode = doc.getElementById('common-code').innerHTML;
            document.head.innerHTML += headContents;
            document.getElementById('common-code').innerHTML = commonCode;
        });
});