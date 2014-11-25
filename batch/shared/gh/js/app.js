requirejs.config({
    'baseUrl': 'shared/',
    'paths': {

        // Vendor
        'jquery': 'vendor/js/jquery',
        'lodash': 'vendor/js/lodash',

        // Plugins
        'jquery.check-all': 'vendor/js/jquery.check-all',
        'jquery.jeditable': 'vendor/js/jquery.jeditable'
    },
    'shim' : {
        'jquery.check-all' : {
            'deps': ['jquery']
        },
        'jquery.jeditable' : {
            'deps': ['jquery']
        }
    }
});

require(['jquery','lodash','jquery.check-all','jquery.jeditable'], function($, _) {

    // Cache some jQuery selectors
    var $batchEditContainer = $('#gh-js-batch-edit-container');
    var $batchEditForm = $('#gh-batch-edit-form');
    var selectedClass = 'info';

    /**
     * Function that toggles the batch edit container
     *
     * @param  {Boolean}    show    Whether or not the container needs to be shown
     * @private
     */
    var toggleBatchEditContainer = function(show) {
        $batchEditForm.trigger('reset');
        $batchToggleChevron = $('.gh-batch-toggle i');
        if (show) {
            $batchEditContainer.show(150, function() {
                $batchToggleChevron.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            });
        } else {
            $batchEditContainer.hide(150, function() {
                $batchToggleChevron.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            });
        }
    };

    /**
     * Function that toggles the batch edit container
     *
     * @private
     */
    var onToggleBatchEditClick = function() {
        // Toggle the batch edit container
        toggleBatchEditContainer(Boolean($('#gh-js-batch-edit-container:hidden').length));
        // Disable the default behaviour
        return false;
    };

    /**
     * Function that is invoked when a batch parent was edited
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onBatchEditParent = function(event) {

        // The batch edit parent input
        var $batchParent = $(event.currentTarget);
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

        // Count the selected rows
        var numSelected = $checkedCheckboxes.length;

        // Display the number of selected rows
        $('.gh-batch-num-selected').html(numSelected);

        // Determine whether or not a checkbox was checked
        var isChecked = Boolean(numSelected);
        var isHidden = $('#gh-js-batch-edit-container:hidden');
        if (isChecked && isHidden) {
            toggleBatchEditContainer(true);
        } else if (!isChecked) {
            toggleBatchEditContainer(false);
        }
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
     * Function that saves the entered form data
     *
     * @param  {Event}    event    A jQuery event
     * @private
     */
    var onSaveClick = function(event) {
        // Uncheck all the checkboxes
        $('.gh-batch-row-select:checked').trigger('click');
        // Hide the batch edit form container
        toggleBatchEditContainer(false);
        // Hide the save button
        $(event.currentTarget).hide();
        // Disable the default behaviour
        return false;
    };

    /**
     *
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
        // Save the form
        $('#gh-btn-save').on('click', onSaveClick);
        // Add keyup event to batch edit parent
        $('.gh-batch-edit-parent').on('keyup', onBatchEditParent);
        $('.gh-batch-edit-parent').on('change', onBatchEditParent);
        // Row checkbox change
        $('.gh-batch-row-select').on('change', onCheckboxChange);
        // Parent checkbox change
        $('.gh-batch-select').on('change', onCheckboxChange);
        // Toggle batch edit container
        $('.gh-batch-toggle').on('click', onToggleBatchEditClick);
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

        $('.gh-editable-select.gh-editable-select-lecturer').editable(function(value, settings) { return value; },{
            'data': {'Toshimi Boulding':'Toshimi Boulding','Haruko Laurie':'Haruko Laurie'},
            'type': 'select',
            'style': 'inherit'
        });

        $('.gh-editable-select.gh-editable-select-type').editable(function(value, settings) { return value; },{
            'data': {'Lecture':'Lecture','Seminar':'Seminar'},
            'type': 'select',
            'style': 'inherit'
        });

        // Display the number of rows
        $('.gh-batch-toggle-items').html($('.gh-batch-row').length);

        // Bind event listeners to the UI components
        addBinding();
    };

    init();
});
