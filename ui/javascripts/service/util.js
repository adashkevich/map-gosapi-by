service.util = (function () {
    return {
        isFunction: function (functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        },
        mute: function (e) {
            event.preventDefault();
            event.stopPropagation();
        },
        validateForm: function (form) {
            var is_valid = form.checkValidity() && !$(form).find('.is-invalid').length;
            $(form).addClass('was-validated');
            return is_valid;
        },
    }
})();

