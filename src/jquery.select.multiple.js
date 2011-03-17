/*!
 * jQuery Select Multiple Plugin
 * Examples and documentation at: http://github.com/emprimeiro/select-multiple/
 * Version: 0.1 (17-03-2011)
 * Copyright 2011, Emprimeiro http://emprimeiro.com.br/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Requires IE7+
 */


jQuery.fn.extend( {

    selectMultiple : function(settings) {

        /*
         * Default values
         */
        settings = jQuery.extend({
            'select_all' : true,
            'width' : null,
            'optgroup_selectable' : true,
            'string_ok' : 'ok',
            'string_cancel' : 'cancelar',
            'string_select_all' : 'marcar todos',
            'string_deselect_all' : 'demarcar todos'
        }, settings);

        this.hide();

        /*
         * Generate a Id if the element don't have
         */
        if(!this.attr('id'))
        {
            var rand_number = Math.floor(Math.random() * 1000 + 1 );
            this.attr('id', 'sm-' + rand_number);
        }        

        var dropdown = document.createElement('span');

        $(dropdown).addClass('select-multiple');
        $(dropdown).attr('data-id' , this.attr('id'));     

        this.after(dropdown);
        
        /*
         * Width defined by settings
         */
        if(settings.width)
        {
        	var width = settings.width;  
        	
        	var padding_left = parseInt($(dropdown).css('padding-left').replace('px'));      	

        	var padding_right = parseInt($(dropdown).css('padding-right').replace('px'));      	     	
        	
        	width = width - (padding_left + padding_right);
        
            $(dropdown).css('width' , width);
        }

        $(dropdown).click(function()
        {
            var select = $('#' + $(this).attr('data-id'));

            var content = '';

            var label = select.prev();
            
    
            if(label.attr('nodeName') == 'LABEL')
            {
                content += '<span class="select-multiple-title">' + select.prev().html() + '</span>';
            }

            content += '<input type="hidden" name="sm-select" value="' + $(this).attr('data-id')  + '"/>';

            content += '<div id="select-multiple-content">';

            i = 0;
            j = 0;
            
            var options = select.find('option');

            if(options.length < 10)
            {
                columns_number = 2;
            }
            else
            {
                columns_number = 3;
            }

            var columns_total = Math.ceil(options.length / columns_number);

            var column_opened = false;
            var column_closed = false;

            options.each(function(){
                
                i++;
                j++;

                if(column_opened == false)
                {
                    content += '<div class="select-multiple-column">';
                    column_opened = true;
                }

                column_closed = false;

                if(select.attr('multiple'))
                {
                    $('#select-multiple-container').html('<input type="checkbox"/>');
                }
                else
                {
                    $('#select-multiple-container').html('<input type="radio"/>');
                }

                var mask = $('#select-multiple-container input');

               /*
                * IE7 bug - don't accept the attribute name directly
                */
                $(mask).attr('data-name', 'sm-' + select.attr('name'));
                
                $(mask).attr('value', $(this).val());         

                var id = 'sm-' + select.attr('id') + '-' + i;
                
                $(mask).attr('id', id);
   
                content +=  $('#select-multiple-container').html() + '<label for="' +id + '">' + $(this).html() + '</label>';
                content += '<div class="select-multiple-clear"></div>';

                if(j == columns_total)
                {
                    j = 0;
                    column_opened = false;
                    column_closed = true;
                    content += '</div>';
                }
                     
            });

            if(column_opened == true && column_closed == false)
            {
                content += '</div>';
            }

            content += '<div class="select-multiple-clear"></div>';
            
         
            //#select-multiple-content
            content += '</div>';


            if(select.attr('multiple') && settings.select_all)
            {
                content += '<div id="select-multiple-buttons-left">';
                content += '<a id="select-multiple-select-all" href="javascript:void(0)">' + settings.string_select_all + '</a>';
                content += '<a id="select-multiple-deselect-all" href="javascript:void(0)">' + settings.string_deselect_all + '</a>';
                content += '</div>';
            }


            content += '<div id="select-multiple-buttons-right">';
            content += '<a id="select-multiple-save" href="javascript:void(0)">' + settings.string_ok + '</a>';
            content += '<a id="select-multiple-cancel" href="javascript:void(0)">' + settings.string_cancel + '</a>';  
            content += '</div>';

            $('#select-multiple-container').html(content);

            $('#select-multiple-content').css('width', ((columns_number * 200) + 20) + 'px');

            select.find('option').each(function(){

                if($(this).attr('selected'))
                {
                    $('#select-multiple-content input[value="' + $(this).val() + '"]').attr('checked', true);
                }                
            });

            /*
             * OptGroup
             */
            select.find('optgroup').each(function(){

                var option_first_id = $(this).find('option:first-child').val();

                var option_last_id = $(this).find('option:last-child').val();

                var optgroup_class = 'optgroup-' + option_first_id;

                $(this).find('option').each(function(){
                    $('#select-multiple-content').find('input[value="' + $(this).val() + '"]').addClass(optgroup_class);
                });

                var label = '<span class="select-multiple-optgroup"><span>' + $(this).attr('label') + '</span></span>';

                var first = $('#select-multiple-content').find('input[value="' + option_first_id + '"]');

                $(first).before(label);

                $('#select-multiple-content').find('input[value="' + option_last_id + '"] + label').css({
                    'margin-bottom' : '20px'
                });

                if(settings.optgroup_selectable)
                {
                    $(first).prev().prepend('<input type="checkbox" name="sm-optgroup" value="' + optgroup_class +'"/>');
                    $(first).prev().css('cursor', 'pointer');
                }

            });

            $('[name="sm-optgroup"]').change(function()
            {
                $('.' + $(this).val()).attr('checked', $(this).attr('checked'));
            });

            $('[name="sm-optgroup"] + span').click(function()
            {
                var check = $(this).prev();
                $(check).attr('checked', !$(check).attr('checked'));
                $('.' + $(check).val()).attr('checked', $(check).attr('checked'));
            });

            /*
             * IE7 bug - don't accept the attribute name directly
             */
            $('#select-multiple-content input').each(function(){
                $(this).attr('name', $(this).attr('data-name'));
            });


			/*
             * Popup center
             */
            $('#select-multiple-container').css({
                'margin-top' : '-' +  ($('#select-multiple-container').height() / 2)+ 'px' ,
                'margin-left' : '-' +  ($('#select-multiple-container').width() / 2) + 'px' 
            });

            /*
             * Cancel
             */
            $('#select-multiple-cancel').click(function()
            {
                $('#select-multiple-container').hide();                
            });

            /*
             * Save
             */
            $('#select-multiple-save').click(function(){

                var select = $('#' + $('[name="sm-select"]').val());

                select.find('option').removeAttr('selected');

                $('#select-multiple-content input:checked').each(function(){

                    select.find('option[value="' + $(this).val() + '"]').attr('selected', 'selected');

                });

                update_dropdown_label();
                
                $('#select-multiple-container').hide();
            });


            /*
         	 * Select All
         	 */
            $('#select-multiple-select-all').click(function()
            {
                $('#select-multiple-content input').each(function()
                {
                    $(this).attr('checked', true);
                });
            });

            /*
         	* Deselect All
         	*/
            $('#select-multiple-deselect-all').click(function()
            {
                $('#select-multiple-content input').each(function()
                {
                    $(this).attr('checked', false);
                });
            });

            $('#select-multiple-content [type="checkbox"]').change(function(){
                update_optgroup();
            });

            update_optgroup();

            $('#select-multiple-container').show();
           
        });

		/*
		 * Update the optgroup checked, if all childs are checkeds
 		 */
        function update_optgroup()
        {
            $('[name="sm-optgroup"]').each(function()
            {         
            
                $(this).attr('checked', true);

                var optgroup = this;     

                $('(.' + $(optgroup).val() + ':not(:checked)').each(function()
                {                             
                    $(optgroup).attr('checked', false);
                });
            });

        }

		/*
		 * Update the label showed in the dropdown
 		 */
        function update_dropdown_label()
        {

            $(dropdown).html('');

            $('#' +$(dropdown).attr('data-id') + ' :selected').each(function(){

                $(dropdown).append($(this).html() + ', ') ;
            });

            var content = $(dropdown).html();

            if(content.length > 2)
            {
                $(dropdown).html(content.substr(0, content.length - 2));
            }
        }

        update_dropdown_label();
        
        /*
         * Initialize the container
         */
        if($('#select-multiple-container').length == 0 )
        {
            $('body').append('<div id="select-multiple-container"></div>');
        }


    }
});
