window.tree = $("#tg");

let cellWidthCalc = function (tree, cell, row) {

}

let editcell = function (target, field, row) {
	let input;
	var dg = $(target);
	var opts = dg.treegrid("options");
	var panel = dg.treegrid("getPanel");
	debugger;

	var tr = panel.find('tr[node-id="' + row.id + '"]')
	var td = tr.find('td[field="' + field + '"]');

	var cell = td.find("div.datagrid-cell");

	var col = dg.treegrid("getColumnOption", field);

	if (col && col.editor) {
		var colEditorType, colEditorOptions;
		if (typeof col.editor == "string") {
			colEditorType = col.editor;
		} else {
			colEditorType = col.editor.type;
			colEditorOptions = col.editor.options;
		}
		var editorOptions = opts.editors[colEditorType];

		if (editorOptions) {
			var oldCellHtml = cell.html();
			var cellWidth = cell._outerWidth();
			cell.addClass("datagrid-editable");
			cell._outerWidth(cellWidth);
			cell.html(
				'<table border="0" cellspacing="0" cellpadding="1"><tr><td></td></tr></table>'
			);
			cell.children("table")._bind("click dblclick contextmenu", function (e) {
				e.stopPropagation();
			});

			input = $.data(cell[0], "datagrid.editor", {
				actions: editorOptions,
				target: editorOptions.init(
					cell.find("td"),
					$.extend(
						{
							height: opts.editorHeight,
						},
						colEditorOptions
					)
				),
				field: field,
				type: colEditorType,
				oldHtml: oldCellHtml,
			});

			// input.target[0].value = tree.treegrid('find', row.id)[field];
			tr.addClass('datagrid-row-editing');

			cell._outerWidth(col.boxWidth + col.deltaWidth - 1);
			var ed = $.data(cell[0], "datagrid.editor");
			
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, cell.width());
			}
			ed.actions.setValue(ed.target, row[field]);

			let editingId = row.id

			$(ed.target).on("blur", function () {
				tree.treegrid('endEdit', editingId);
			})
			


			
		}
	}






};

tree.treegrid({
	onClickCell: function (field, row) {
		editcell(this, field, row);

		//debugger;
	},
});




//tree.datagrid().datagrid("enableCellEditing");

// var editingId;
// function edit() {
// 	if (editingId != undefined) {
// 		$("#tg").treegrid("select", editingId);
// 		return;
// 	}
// 	var row = $("#tg").treegrid("getSelected");
// 	if (row) {
// 		editingId = row.id;
// 		$("#tg").treegrid("beginEdit", editingId);
// 	}
// }
// function save() {
// 	if (editingId != undefined) {
// 		var t = $("#tg");
// 		t.treegrid("endEdit", editingId);
// 		editingId = undefined;
// 		var persons = 0;
// 		var rows = t.treegrid("getChildren");
// 		for (var i = 0; i < rows.length; i++) {
// 			var p = parseInt(rows[i].persons);
// 			if (!isNaN(p)) {
// 				persons += p;
// 			}
// 		}
// 		var frow = t.treegrid("getFooterRows")[0];
// 		frow.persons = persons;
// 		t.treegrid("reloadFooter");
// 	}
// }
// function cancel() {
// 	if (editingId != undefined) {
// 		$("#tg").treegrid("cancelEdit", editingId);
// 		editingId = undefined;
// 	}
// }
