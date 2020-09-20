(function ($) {
    $.extend($.fn.treegrid.defaults, {
        clickToEdit: true,
        dblclickToEdit: false,
    });

    $.extend($.fn.treegrid.methods, {
        editCell: function (jq, param) {
            return jq.each(function () {
                editCell(this, param);
            });
        },
        enableCellEditing: function (jq) {
            return jq.each(function () {
                enableCellEditing(this);
            });
        },
        input: function(jq, param){
			if (!param){return null;}
			var ed = jq.treegrid("getColumnOption", param.field).editor;
			if (ed){
				var t = $(ed.target);
				if (t.hasClass('textbox-f')){
					t = t.textbox('textbox');
				}
				return t;
			} else {
				return null;
			}
		},
    })

    function editCell(target, param){
        var dg = $(target);
		var opts = dg.treegrid('options');
        var input = dg.treegrid('input', param);
        debugger;
		if (input){
			dg.datagrid('gotoCell', param);
			input.focus();
			return;
		}
		if (!endCellEdit(target, true)){return;}
		if (opts.onBeforeCellEdit.call(target, param.index, param.field) == false){
			return;
		}

		var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields'));
		$.map(fields, function(field){
			var col = dg.datagrid('getColumnOption', field);
			col.editor1 = col.editor;
			if (field != param.field){
				col.editor = null;
			}
		});

		var col = dg.datagrid('getColumnOption', param.field);
		if (col.editor){
			dg.datagrid('beginEdit', param.index);
			var input = dg.datagrid('input', param);
			if (input){
				dg.datagrid('gotoCell', param);
				setTimeout(function(){
					input.unbind('.cellediting').bind('keydown.cellediting', function(e){
						if (e.keyCode == 13){
							return opts.navHandler['13'].call(target, e);
							// return false;
						}
					});
					input.focus();
				}, 0);
				opts.onCellEdit.call(target, param.index, param.field, param.value);
			} else {
				dg.datagrid('cancelEdit', param.index);
				dg.datagrid('gotoCell', param);
			}
		} else {
			dg.datagrid('gotoCell', param);
		}

		$.map(fields, function(field){
			var col = dg.datagrid('getColumnOption', field);
			col.editor = col.editor1;
		});
    }

    function enableCellEditing(target) {
        var dg = $(target);
        var opts = dg.treegrid('options');
        var panel = dg.treegrid('getPanel');

        // panel.attr('tabindex', 1).css('outline-style', 'none').unbind('.cellediting').bind('keydown.cellediting', function (e) {
        //     var h = opts.navHandler[e.keyCode];
        //     if (h) {
        //         return h.call(target, e);
        //     }
        // }).bind('keypress.cellediting', function (e) {
        //     return opts.navHandler['keypress'].call(target, e);
        // });
        // panel.panel('panel').unbind('.cellediting').bind('keydown.cellediting', function (e) {
        //     e.stopPropagation();
        // }).bind('keypress.cellediting', function (e) {
        //     e.stopPropagation();
        // }).bind('mouseover.cellediting', function (e) {
        //     var td = $(e.target).closest('td[field]');
        //     if (td.length) {
        //         td.addClass('datagrid-row-over');
        //         td.closest('tr.datagrid-row').removeClass('datagrid-row-over');
        //     }
        // }).bind('mouseout.cellediting', function (e) {
        //     var td = $(e.target).closest('td[field]');
        //     td.removeClass('datagrid-row-over');
        // });
        opts.isRtl = dg.treegrid('getPanel').css('direction').toLowerCase() == 'rtl';
        opts.oldOnClickCell = opts.onClickCell;
        opts.oldOnDblClickCell = opts.onDblClickCell;
        opts.onClickCell = function (field, row) {
            if (opts.clickToEdit) {
                debugger;
                $(this).treegrid('editCell', { id: row.id, field: field });
            } else {
                if (endCellEdit(this, true)) {
                    $(this).treegrid('gotoCell', {
                        index: index,
                        field: field
                    });
                }
            }
            opts.oldOnClickCell.call(this, index, field, value);
        }
        if (opts.dblclickToEdit) {
            opts.onDblClickCell = function (index, field, value) {
                $(this).treegrid('editCell', { index: index, field: field });
                opts.oldOnDblClickCell.call(this, index, field, value);
            }
        }
        opts.OldOnBeforeSelect = opts.onBeforeSelect;
        opts.onBeforeSelect = function () {
            return false;
        };
        dg.treegrid('clearSelections')
    };
})(jQuery);