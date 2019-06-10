service.auth = (function () {
    var init = false,
        LOGIN_BTN = '#authModal .modal-footer .log-in-btn',
        LOGOUT_BTN = '#logOutBtn',
        BACK_BTN = '#authModal .modal-footer .back-btn',
        PASSWORD_BTN = '#authModal .modal-footer .get-password-btn',
        LOGIN_TAB = '#loginFormTab',
        REG_TAB = '#registrationFormTab',
        BUTTONS = '#authModal .modal-footer button',
        REG_FORM = 'form#registrationForm',
        LOGIN_FORM = 'form#loginForm',
        PASSWORD_FORM = 'form#passwordForm',
        MODAL = '#authModal',
        REG_EMAIL_INPUT = '#regEmailInput',
        LOGIN_PHONE_INPUT = '#loginPhoneInput',
        SPINNER_HTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ',
        authCallback = null,
        config = { mode: 'popup' };

    var validateForm = service.util.validateForm;

    function getAuthFormData(form) {
        var data = $.extend({}, JSONForms.encode(form), $(form).data());
        return { auth: data };
    }

    function getRegistrationFormData(form) {
        var data = JSONForms.encode(form);
        delete data.terms_of_use;
        return data;
    }

    function getLoginFormData(form) {
        return JSONForms.encode(form);
    }

    function disableAuthForm(form, btn, btnText) {
        $(form).find('input').prop('disabled', true);
        $(btn).prop('disabled', true)
            .html(SPINNER_HTML + btnText);
    }

    function disableRegistrationForm(form) {
        disableAuthForm(form, $(PASSWORD_BTN).first(), 'Получить CMC код');
    }

    function disableLoginForm(form) {
        disableAuthForm(form, $(PASSWORD_BTN).first(), 'Получить CMC код');
    }

    function disablePasswordForm(form) {
        disableAuthForm(form, $(LOGIN_BTN).first(), 'Войти');
    }

    function enableAuthForm(form, btn, btnText) {
        $(form).find('input').prop('disabled', false);
        $(btn).prop('disabled', false).html(btnText);
    }

    function enableRegistrationForm(form) {
        enableAuthForm(form, $(PASSWORD_BTN).first(), 'Получить CMC код');
    }

    function enableLoginForm(form) {
        enableAuthForm(form, $(PASSWORD_BTN).first(), 'Получить CMC код');
    }

    function enablePasswordForm(form) {
        enableAuthForm(form, $(LOGIN_BTN).first(), 'Войти');
    }

    function invalidatePhone(errorMsg) {
        var $errorFeedback = $('<div class="invalid-feedback">' + errorMsg + '</div>');
        $(LOGIN_PHONE_INPUT).addClass('is-invalid').parent().append($errorFeedback);

        $(LOGIN_PHONE_INPUT).one('change', function () {
            $(this).removeClass('is-invalid');
            $errorFeedback.remove();
        });
    }

    function invalidateEmail(errorMsg) {
        var $errorFeedback = $('<div class="invalid-feedback">' + errorMsg + '</div>');
        $(REG_EMAIL_INPUT).addClass('is-invalid').parent().append($errorFeedback);

        $(REG_EMAIL_INPUT).one('change', function () {
            $(this).removeClass('is-invalid');
            $errorFeedback.remove();
        });
    }

    function updateLogOutBtn() {
        $(LOGOUT_BTN)[service.auth.isAuth() ? 'show' : 'hide']();
    }

    return {

        init: function(cfg) {
            $.extend(config, cfg);
            updateLogOutBtn();

            init = true;
        },

        hooks: function() {
            $(LOGOUT_BTN).click(function () {
                localStorage.removeItem('jwt');
                location.reload();
            });
            
            $(MODAL).on('hidden.bs.modal', function () {
                authCallback = null;
            });

            $(REG_TAB).on('show.bs.tab', function () {
                $('#authModal .modal-footer button').hide().filter('.get-password-btn').show();
            });

            $(LOGIN_TAB).on('show.bs.tab', function () {
                $('#authModal .modal-footer button').hide().filter('.get-password-btn').show();
            });

            $(PASSWORD_BTN).click(function () {
                $('#authTabContent form.active').submit();
            });

            $(BACK_BTN).click(function () {
                service.auth.hidePasswordForm();
            });

            $(LOGIN_BTN).click(function () {
                $('#passwordForm').submit();
            });

            $(REG_FORM).submit(function () {
                if(validateForm(this)) {
                    var data = getRegistrationFormData(this), form = this;
                    disableRegistrationForm(form);

                    service.auth.sendPassword(data, function () {
                        service.auth.showPasswordForm(data);
                    }, function () {
                        alert("Ошибка сервера");
                    }, function () {
                        enableRegistrationForm(form);
                    });
                }
            });

            $(LOGIN_FORM).submit(function () {
                if(validateForm(this)) {
                    var data = getLoginFormData(this), form = this;
                    disableLoginForm(form);

                    service.auth.sendPassword(data, function () {
                        service.auth.showPasswordForm(data);
                    }, function () {
                        alert("Ошибка сервера");
                    }, function () {
                        enableLoginForm(form);
                    });
                }
            });

            $(PASSWORD_FORM).submit(function () {
                if(validateForm(this)) {
                    var form = this;
                    disablePasswordForm(form);

                    service.auth.getToken(getAuthFormData(form), function () {
                        authCallback && authCallback();
                        service.auth.hidePasswordForm();
                        service.auth.hideModal();
                        updateLogOutBtn();
                    }, function () {
                        alert('Введён неправильный пароль');
                    }, function () {
                        enablePasswordForm(form);
                    });
                }
            });

            $(LOGIN_PHONE_INPUT).change(function () {
                if ($(this).val().length === 14) {
                    var $nextBtn = $(PASSWORD_BTN);
                    $nextBtn.prop('disabled', true).html(SPINNER_HTML + 'Получить CMC код');
                    $.ajax({
                        dataType: 'json',
                        url: endpoint + '/api/v1/check/phone/' + $(this).val(),
                        cache: false,
                        success: function (data) {
                            if(!data.success) {
                                invalidatePhone(data.error);
                            }
                        },
                        error: function () {
                            invalidatePhone('При валидации поля произошла ошибка');
                        },
                        complete: function () {
                            $nextBtn.prop('disabled', false).html('Получить CMC код')
                        }
                    });
                }
            });

            $(REG_EMAIL_INPUT).change(function () {
                if ($(this).val().length >= 6) {
                    var $nextBtn = $(PASSWORD_BTN);
                    $nextBtn.prop('disabled', true).html(SPINNER_HTML + 'Получить CMC код');
                    $.ajax({
                        dataType: 'json',
                        url: endpoint + '/api/v1/check/email/' + $(this).val(),
                        cache: false,
                        success: function (data) {
                            if(!data.success) {
                                invalidateEmail(data.error);
                            }
                        },
                        error: function () {
                            invalidateEmail('При валидации поля произошла ошибка');
                        },
                        complete: function () {
                            $nextBtn.prop('disabled', false).html('Получить CMC код')
                        }
                    });
                }
            });

            $('#authTabContent form').submit(function () {
                return false;
            });
        },

        sendPassword: function (data, success, error, complete) {
            $.ajax({
                dataType: 'json',
                url: endpoint + '/api/v1/send_password',
                method: 'POST',
                data: data,
                success: function (data) {
                    if(data.success) {
                        success && success(data);
                    } else {
                        error && error(data);
                    }
                },
                error: error,
                complete: complete
            });
        },

        getToken: function (data, success, error, complete) {
            $.ajax({
                dataType: 'json',
                url: endpoint + '/api/v1/user_token',
                method: 'POST',
                data: data,
                success: function (data) {
                    localStorage.setItem('jwt', data.jwt);
                    success && success(data);
                },
                error: error,
                complete: complete
            });
        },

        isAuth: function () {
            return !!localStorage.getItem('jwt');
        },
        
        showModal: function (activeTab, callback) {
            if(service.util.isFunction(activeTab)) {
                callback = activeTab;
                activeTab = null;
            }
            authCallback = callback;

            if(config.mode === 'popup') {
                service.auth.showPopup(activeTab);
            } else {
                service.auth.showStatic(activeTab);
            }
        },

        showPopup: function(activeTab) {
            $(MODAL).one('show.bs.modal', function () {
                $(activeTab === 'registration' ? '#registrationFormTab' : '#loginFormTab').tab('show');
            }).modal('show');
        },

        showStatic: function(activeTab) {
            $('.auth-modal-wrapper').show();
            $(activeTab === 'registration' ? '#registrationFormTab' : '#loginFormTab').tab('show');
        },

        hideModal: function() {
            if(config.mode === 'popup') {
                service.auth.hidePopup();
            } else {
                service.auth.hideStatic();
            }
        },

        hidePopup: function() {
            $(MODAL).modal('hide');
        },

        hideStatic: function() {
            $('.auth-modal-wrapper').hide();
        },

        showPasswordForm: function (data) {
            $('#authModal form.active.show').removeClass('active show');
            $('#passwordForm').removeData().data(data).addClass('active show');
            $(BUTTONS).show().filter(PASSWORD_BTN).hide();
        },
        
        hidePasswordForm: function () {
            $('#authModal form.active.show').removeClass('active show');
            var prevTabId = $('#authModal .nav-link.active').attr('aria-controls');
            $('#' + prevTabId).addClass('active show');
            $(BUTTONS).hide().filter(PASSWORD_BTN).show();
        }
    }
})();