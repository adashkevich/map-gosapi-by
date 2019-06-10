service.util = (function () {
    return {
        isFunction: function (functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        },
        mute: function (event) {
            event.preventDefault();
            event.stopPropagation();
        },
        validateForm: function (form) {
            var is_valid = form.checkValidity() && !$(form).find('.is-invalid').length;
            $(form).addClass('was-validated');
            return is_valid;
        },
        parseCoordinates: function (item) {
            const results = [];
            item.coordinates.split(";").forEach(function (coordinateStr) {
                results.push(coordinateStr.split(",").map(function (pointStr) {
                    return parseFloat(pointStr);
                }));
            });
            return results;
        },
        getFileName: function (url) {
            return url.substring(url.lastIndexOf('/') + 1);
        }
    }
})();

