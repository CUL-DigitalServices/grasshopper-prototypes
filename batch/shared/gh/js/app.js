requirejs.config({
    'baseUrl': 'shared/',
    'paths': {

        // Vendor
        'jquery': 'vendor/js/jquery',
        'lodash': 'vendor/js/lodash',
        'bootstrap': 'vendor/js/bootstrap',

        // Plugins
        'jquery.check-all': 'vendor/js/jquery.check-all',
        'jquery.jeditable': 'vendor/js/jquery.jeditable',
        'jquery.jeditable.timetable': 'vendor/js/jquery.jeditable.timetable'
    },
    'shim' : {
        'bootstrap': {
            'deps': ['jquery']
        },
        'jquery.check-all': {
            'deps': ['jquery']
        },
        'jquery.jeditable': {
            'deps': ['jquery']
        },
        'jquery.jeditable.timetable': {
            'deps': ['jquery.jeditable']
        }
    }
});

require(['jquery','lodash','bootstrap','jquery.check-all','jquery.jeditable','jquery.jeditable.timetable'], function($, _) {

    // Cache some jQuery selectors
    var $batchEditContainer = $('#gh-js-batch-edit-container');
    var $batchEditForm = $('#gh-batch-edit-form');
    var selectedClass = 'info';

    /**
     * Function that is invoked when a batch parent was edited
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onBatchEditParent = function(event) {

        // The batch edit parent input
        var $batchParent = $(this);
        // The batch type
        var batchType = $batchParent.attr('data-batch');

        // The batch children to update
        var selector = '.gh-batch-edit-child[data-batch="' + batchType + '"]';
        var $selector = $(selector);
        $batchChildren = $.map($selector, function($batchChild) {
            var $parentRow = $($batchChild).parent().parent();
            if ($parentRow.hasClass(selectedClass)) {
                return $parentRow;
            }
        });

        // Update all the children
        $.each($batchChildren, function(i) {
            $($batchChildren[i]).find(selector).html($batchParent.val());
        });

        if ($('.gh-batch-row-select:checked').length) {
            isEditing();
        }
    };

    /**
     * Function that is invoked when a checkbox was changed
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onCheckboxChange = function(event) {

        // Remove the markup from the unselected rows
        var $checkboxes = $('.gh-batch-row-select');
        $.each($checkboxes, function(i) {
            $($checkboxes[i]).parent().parent().removeClass(selectedClass);
        });

        // Add a markup to the selected rows
        var $checkedCheckboxes = $('.gh-batch-row-select:checked');
        $.each($checkedCheckboxes, function(i) {
            $($checkedCheckboxes[i]).parent().parent().addClass(selectedClass);
        });
    };

    /**
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onDateChange = function(event) {
        var day = $('.gh-edit-date-day').val();
        var start = $('.gh-edit-date-start').val();
        var end = $('.gh-edit-date-end').val();
        var timeSlot = 'Lent, on ' + day + ' ' + start + '-' + end;
        $('.gh-edit-date').val(timeSlot).trigger('change');
    };

    /**
     * Function that toggles the edit dates containers
     *
     * @private
     */
    var onEditDatesClick = function() {
        $('.gh-batch-edit-dates').hide();
        $('.gh-batch-edit-dates-form').show();
        // Disable the default behaviour
        return false;
    };

    /**
     * Function that toggles the edit dates containers
     *
     * @private
     */
    var onEditDatesOkClick = function() {
        $('.gh-batch-edit-dates').show();
        $('.gh-batch-edit-dates-form').hide();
        // Disable the default behaviour
        return false;
    };

    /**
     * Function that is invoked when the form is submitted
     *
     * @private
     */
    var onFormSubmit = function() {
        // Disable the default behaviour
        return false;
    };

    /**
     *
     */
    var onAddEventClick = function() {
        console.log('Add Event');
    };

    /**
     * Function that saves the entered form data
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onSaveClick = function(event) {
        // Uncheck all the checkboxes
        $('.gh-batch-row-select:checked').trigger('click');
        // Save the date batch editing forms
        $('.gh-editable-timetable form').trigger('submit');
        // Hide the save button
        $(this).hide();
        // Reset the top form
        $('#gh-batch-edit-form').trigger('reset');
        // Disable the default behaviour
        return false;
    };

    /**
     * Delete a single row
     */
    var deleteRow = function() {
        $(this).parent().parent().remove();
    };

    /**
     * Delete all the rows
     */
    var deleteRows = function() {
        $('.gh-batch-row').remove();
    };

    /**
     * Show the save button is the user is editing
     */
    var isEditing = function() {
        $('#gh-btn-save').show();
    };

    /**
     * Add event listeners to the UI components
     *
     * @private
     */
    var addBinding = function() {
        // Disable the default form behaviour
        $('#gh-batch-edit-form').on('submit', onFormSubmit);
        // Add a new event
        $('#gh-btn-add-event').on('click', onAddEventClick);
        // Save the form
        $('#gh-btn-save').on('click', onSaveClick);
        // Add keyup event to batch edit parent
        $('.gh-batch-edit-parent').on('keyup', onBatchEditParent);
        $('.gh-batch-edit-parent').on('change', onBatchEditParent);

        // Row delete
        $('.gh-batch-delete').on('click', deleteRows);
        $('.gh-batch-row-delete').on('click', deleteRow);

        // Row checkbox change
        $('.gh-batch-row-select').on('change', onCheckboxChange);
        $('.gh-batch-select').on('change', onCheckboxChange);

        // Toogle the time container
        $('.gh-btn-edit-dates').on('click', onEditDatesClick);
        $('.gh-btn-edit-dates-form').on('click', onEditDatesOkClick);
        // Date edit form
        $('.gh-batch-edit-dates-form input').on('keyup', onDateChange);
        $('.gh-batch-edit-child').on('change', isEditing);
    };

    /**
     * Initialize the UI Components
     *
     * @private
     */
    var init = function() {

        // Initialize the jQuery check-all plugin
        $('.gh-batch-select').checkAll({
            'childCheckboxes': 'input.gh-batch-row-select',
            'container': $('#gh-batch-table')
        });

        // Initialize the Jeditable plugin
        $('.gh-editable').editable(function(value, settings) { return value; },{
            'style': 'inherit'
        });

        $('.gh-editable-timetable').editable(function(value, settings) {
            return value;
        },{
            'type': 'timetable',
            'style': 'inherit',
            'submit': 'ok'
        });

        $('.gh-editable-select.gh-editable-select-type').editable(function(value, settings) { return value; },{
            'data': {'Lecture':'Lecture','Seminar':'Seminar'},
            'type': 'select',
            'style': 'inherit'
        });

        // Bind event listeners to the UI components
        addBinding();
    };

    init();
});
