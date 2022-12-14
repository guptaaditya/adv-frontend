const iziToast = require('izitoast');

const ToastFactory = (function () {
    let init = false;
    const toastSettings = {
        timeout: 3000,
        resetOnHover: true,
        position: 'topRight',
        close: true,
        closeOnEscape: true,
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
    };
    return {
        getToast: function () {
            if (!init) {
                iziToast.settings(toastSettings);
                init = true;
            }
            return iziToast;
        }
    };
})();

export function showToast(view, type = '', settings = {}) {
    const allowedTypes = ['success', 'info', 'error', 'warning'];
    //type could be success, info, error, warning
    /*
        When view is a string, its a message without title,
        When view is a object with title and message property use it as it is.
    */
    if(settings.exclusive) {
        iziToast.destroy();
    }
    const sanitizedType = type.toLowerCase();
    const typeMethod = allowedTypes.indexOf(sanitizedType) > -1 ? sanitizedType : 'show';
    const toastInfo = {
        title: view.title || '',
        message: view.message || view || '',
        ...settings,
    };
    ToastFactory.getToast()[typeMethod](toastInfo);
};

export const onLogin = (props) => {
    showToast('Message', 'success');
    props.history.push('/next-url');
}
