import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
const Alert = (response: any) => {
    return Toastify({
        text: response,
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
    }).showToast();
};
