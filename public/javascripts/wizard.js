var Wizard = function (cfg) {

    if(!cfg.$el) {
        throw "`$el` option should be present in wizard config!";
    }

    cfg.current_index = cfg.current_index || 0;

    if(!cfg.steps) {
        throw "`steps` option should be present in wizard config!";
    }

    var $el = cfg.$el,
        steps = cfg.steps,
        current_index = cfg.current_index;
    

    return {
        show: function (index) {
            $el.find('.wizard-step').hide();
            current_index = index || 0;
            steps[current_index].$el.show();
        }
    };
};