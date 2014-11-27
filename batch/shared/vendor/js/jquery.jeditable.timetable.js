var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var terms = ['Mich','Lent','East'];

$.editable.addInputType('timetable', {
    'element' : function(settings, original) {

        var $termSelect = $('<select id="term_">');
        var $week = $('<input id="week_" class="double" maxlength="3" size="3" placeHolder="W01">');
        var $daySelect = $('<select id="day_">');
        var $startHour = $('<input id="hour_start_" maxlength="2" size="2" placeHolder="00">');
        var $startMin  = $('<input id="min_start_" maxlength="2" size="2" placeHolder="00">');
        var $endHour = $('<input id="hour_end_" maxlength="2" size="2" placeHolder="00">');
        var $endMin = $('<input id="min_end_" maxlength="2" size="2" placeHolder="00">');

        /* Terms loop */
        for (var i=0; i<terms.length; i++) {
            var option = $('<option>').val(terms[i]).append(terms[i]);
            $termSelect.append(option);
        }

        /* Days loop */
        for (var i=0; i<days.length; i++) {
            var option = $('<option>').val(days[i]).append(days[i]);
            $daySelect.append(option);
        }

        $(this).append($termSelect);
        $(this).append(' ');
        $(this).append($week);
        $(this).append(' ');
        $(this).append($daySelect)
        $(this).append(' ');
        $(this).append($startHour);
        $(this).append(':');
        $(this).append($startMin);
        $(this).append('-');
        $(this).append($endHour);
        $(this).append(':');
        $(this).append($endMin);

        /* Hidden input to store value which is submitted to server. */
        var hidden = $('<input class="input-hidden" type="hidden">');
        $(this).append(hidden);
        return(hidden);
    },
    'content': function(string, settings, original) {

        var term = string.split(',')[0];

        var dateString = string.split(',')[1];
        var week = dateString.split(' ')[1];
        var day = dateString.split(' ')[3];

        var timeString = dateString.split(' ')[4];
        var start = timeString.split('-')[0];
        var startHour = start.split(':')[0];
        var startMin = start.split(':')[1];

        var end = timeString.split('-')[1];
        var endHour = end.split(':')[0];
        var endMin = end.split(':')[1];

        // Collect the form data
        $("#term_", this).children().each(function() {
            if (term == $(this).val()) {
                $(this).attr('selected', 'selected');
            }
        });
        $('#week_', this).val(week);
        $("#day_", this).children().each(function() {
            if (day == $(this).val()) {
                $(this).attr('selected', 'selected');
            }
        });
        $('#hour_start_', this).val(startHour);
        $('#min_start_', this).val(startMin);
        $('#hour_end_', this).val(endHour);
        $('#min_end_', this).val(endMin);
    },
    'submit': function(settings, original) {

        // Collect the form data
        var term = $('#term_').val();
        var week = $('#week_').val();
        var day = $('#day_').val();
        var startHour = $('#hour_start_').val();
        var startMin = $('#min_start_').val();
        var endHour = $('#hour_end_').val();
        var endMin = $('#min_end_').val();

        // Return the form data as a string
        var value = term + ', ' + week + ' on ' + day + ' ' + startHour + ':' + startMin + '-' + endHour + ':' + endMin;
        $('input.input-hidden', this).val(value);
    }
});
