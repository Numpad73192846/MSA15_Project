const UI = (() => {
    function toast(message, { title = '알림', type = "success", ms = 3000 } = {}) {
        const toastRoot = document.getElementById("toastRoot");
        if (!toastRoot) return;

        const toastElement = document.createElement("div");
        toastElement.classList.add("toast", `toast--${type}`);
        toastElement.innerHTML = `
            <div class="toast__title">${title}</div>
            <div class="toast__msg">${message}</div>
        `;
        toastRoot.appendChild(toastElement);
        setTimeout(() => {
            toastElement.remove();
        }, ms);
    }

    return {
        toast
    };
})();

window.UI = UI;