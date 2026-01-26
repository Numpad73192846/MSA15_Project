const Api = (() => {
    function getCsrf() {
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
        return { csrfToken, csrfHeader };
    }
    
});

window.Api = Api;