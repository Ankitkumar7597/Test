function createDatatable(flag_name) {
    if (flag_name == 'testListTableFlag') {
        dataTable = $('#testList').DataTable({
            order: [[6, 'desc']],
            paging: true,
            pageLength: 10,
            processing: true,
            serverSide: true,
            ajax: {
                url: admin + "/form-list-grid-data",
                type: "POST",
            },
            columns: [
                { data: "sr" },
                { data: "name" },
                { data: "mobile_number" },
                { data: "address" },
                { data: "office_address" },
                { data: "displayStatus" },
                { data: "creationDate" },
                { data: null },
            ],
            columnDefs: [
                {
                    targets: [-1], // Targets the last column
                    render: function (data, type, row) {
                        var action = '';

                        // Edit button with modal
                        action += `<a class="openPopupModel" data-bs-target="#eventModal" dataModelId="eventModal" dataBody="eventModal_body" 
                                dataTitle="Edit Form" href="javascript:void(0);" dataHref="${admin}/add-from/${row.id}" role="button" data-bs-toggle="modal">
                                <img src="/images/edit.png" style="width:16px; margin-right: 13px;" title="Edit"></a>`;

                        // Status button (toggle active/inactive)
                        action += `<a href="javascript:void(0)"> <img class="status-btn" data-modalName='Test' 
                                src="${row.status ? '/images/block.png' : '/images/unblock.png'}" style="width:16px; margin-right:13px;" 
                                data-id="${row.id}" data-status="${row.status ? 'Active' : 'Inactive'}" title="${row.status ? 'Inactive' : 'Active'}" /></a>`;

                        return action;
                    }
                },
            ],
        });
    }
    if (flag_name == 'test2ListTableFlag') {
        dataTable = $('#testList').DataTable({
            order: [[6, 'desc']],
            paging: true,
            pageLength: 10,
            processing: true,
            serverSide: true,
            ajax: {
                url: admin + "/form-list-grid-data-2",
                type: "POST",
            },
            columns: [
                { data: "sr" },
                { data: "name" },
                { data: "mobile_number" },
                { data: "address" },
                { data: "office_address" },
                { data: "displayStatus" },
                { data: "creationDate" },
                { data: null },
            ],
            columnDefs: [
                {
                    targets: [-1], // Targets the last column
                    render: function (data, type, row) {
                        var action = '';

                        // Edit button with modal
                        action += `<a class="openPopupModel" data-bs-target="#eventModal" dataModelId="eventModal" dataBody="eventModal_body" 
                                dataTitle="Edit Form" href="javascript:void(0);" dataHref="${admin}/add-from/${row.id}" role="button" data-bs-toggle="modal">
                                <img src="/images/edit.png" style="width:16px; margin-right: 13px;" title="Edit"></a>`;

                        // Status button (toggle active/inactive)
                        action += `<a href="javascript:void(0)"> <img class="status-btn" data-modalName='Test2' 
                                src="${row.status ? '/images/block.png' : '/images/unblock.png'}" style="width:16px; margin-right:13px;" 
                                data-id="${row.id}" data-status="${row.status ? 'Active' : 'Inactive'}" title="${row.status ? 'Inactive' : 'Active'}" /></a>`;

                        return action;
                    }
                },
            ],
        });
    }

}