var admin = $("#admin").val();
var front = $("#front").val();
var tableId = $("#tableId").val();
let sortField = 'createdAt'; // Default sorting field
let sortOrder = 'DESC'; // Default sorting order
let currentPage;
let entriesPerPage;
let statusFilter;
let search;
let tableUrl;
var valid = {
    ajaxError: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        return msg;
    },

    phonenumber: function (inputtxt) {
        var phoneno = /^\d{10}$/;
        return phoneno.test(inputtxt);
    },
    validPhone: function (inputtxt) {
        var phoneno = /^[0-9]\d{2,4}-\d{6,8}$/;
        return phoneno.test(inputtxt);
    },
    validURL: function (inputtxt) {
        var re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return re.test(inputtxt);
    },
    validateEmail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validFBurl: function (enteredURL) {
        var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
        return FBurl.test(enteredURL);
    },
    validTwitterurl: function (enteredURL) {
        var twitterURL = /^(http|https)\:\/\/twitter.com\/.*/i;
        return twitterURL.test(enteredURL);
    },
    validYoutubeURL: function (enteredURL) {
        var youtubeURL = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        return youtubeURL.test(enteredURL);
    },
    validGPlusURL: function (enteredURL) {
        var gPlusURL = /\+[^/]+|\d{21}/;
        return gPlusURL.test(enteredURL);
    },
    validInstagramURL: function (enteredURL) {
        var instagramURL = /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_\.]+)/im;
        return instagramURL.test(enteredURL);
    },
    validateExtension: function (val, type) {
        if (type == 1)
            var re = /(\.jpeg|\.jpg|\.png)$/i;
        else if (type == 2)
            var re = /(\.jpeg|\.jpg|\.png\.pdf|\.doc|\.xml|\.docx|\.PDF|\.DOC|\.XML|\.DOCX|\.xls|\.xlsx)$/i;
        else if (type == 3)
            var re = /(\.pdf|\.docx|\.PDF|\.DOC|\.DOCX)$/i;
        return re.test(val)
    },
    snackbar: function (msg) {
        $("#snackbar").html(msg).fadeIn('slow').delay(3000).fadeOut('slow');
    },
    snackbar2: function (msg) {
        $("#snackbar").html(msg).fadeIn('slow');
    },
    snackbar_error: function (msg) {
        $("#snackbar-error").html(msg).fadeIn('slow').delay(3000).fadeOut('slow');
    },
    snackbar_success: function (msg) {
        $("#snackbar-success").html(msg).fadeIn('slow').delay(3000).fadeOut('slow');
    },
    error: function (msg) {
        return "<p class='alert alert-danger'><strong>Error : </strong> " + msg + "</p>";
    },
    success: function (msg) {
        return "<p class='alert alert-success'>" + msg + "</p>";
    },
    info: function (msg) {
        return "<p class='alert alert-info'>" + msg + "</p>";
    }
};

// Function to fetch data from the server
function fetchData(tableId, tableUrl, page, entriesPerPage, statusFilter, search) {
    $.ajax({
        url: `${admin}/${tableUrl}`,
        method: 'POST', // Change the method to POST
        data: {
            page: page,
            entriesPerPage: entriesPerPage,
            status: statusFilter,
            search: search,
            sortField: sortField,
            sortOrder: sortOrder
        },
        success: function (data) {
            updateTable(tableId, data.commonData, data.currentPage, data.entriesPerPage, data.columns, data.modalType);
            updatePagination(tableId, tableUrl, data.totalPages, data.currentPage);
            updateEntriesInfo(tableId, data.entriesInfo);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

// Function to update the table body with data
function updateTable(tableId, response, currentPage, entriesPerPage, columns, modalType) {
    const tbody = $('#' + tableId + ' tbody');
    tbody.empty();
    if (response.length === 0) {
        // Display a message when no records are found
        const noRecordsRow = `<tr><td colspan="${columns.length + 2}" style="text-align: center; font-size: 16px; padding: 20px;">No Records Found</td></tr>`;
        tbody.append(noRecordsRow);
    } else {
        let startSrNo = (currentPage - 1) * entriesPerPage + 1;
        response.forEach((response, index) => {
            var created = new Date(response.createdAt);
            var createdValue = moment(created).format('Do MMM, YYYY hh:mm A')
            const rowStyle = index % 2 === 0 ? 'background: #e3f5fa;' : '';
            let rowContent = `<td class="table-td-class">${startSrNo + index}</td>`;

            columns.forEach(column => {
                if (response[column]) {
                    rowContent += `<td class="table-td-class">${response[column]}</td>`;
                }



                if (response.countryData && response.countryData[column]) {
                    rowContent += `<td class="table-td-class">${response.countryData[column]}</td>`;
                }
                if (response.stateData && response.stateData[column]) {
                    rowContent += `<td class="table-td-class">${response.stateData[column]}</td>`;
                }
                if (response.categoryData && response.categoryData[column]) {
                    rowContent += `<td class="table-td-class">${response.categoryData[column]}</td>`;
                }


                if (typeof column === 'string') {
                    if (column.includes(",")) {
                        let checkImage = column.split(',');
                        if (checkImage[1] === 'IMG') {
                            rowContent += `
                            <td class="table-td-class">
                            <div class='images_1'><img src="${modalType.imagePath}${response[checkImage[2]]}" class="table-img15"></div>`;
                            if (checkImage[0]) {
                                rowContent += `${response[checkImage[0]]}`
                            }
                            rowContent += `</td>`;
                        }
                    }
                }
                // Check if the current column is the last column in the loop
                if (column == 'createdValue') {
                    // Add the buttons and links for the last column
                    rowContent += `
                    <td class="table-td-class" style="width:190px">${createdValue}</td>`;
                }
                if (column == 'status') {
                    rowContent += `
                    <td class="table-td-class">
                            <button style="background-color: ${response.isActive ? 'green' : 'red'}; color: #fff; padding: 2px 13px; border-radius: 15px; border: none; font-size:11px;">
                                ${response.isActive ? 'Active' : 'Inactive'}
                            </button>
                        </td>`;
                }
                if (column == 'actions') {
                    rowContent += `
                    <td class="table-td-class">
                    <a href="javascript:void(0)">
                        <img src="/images/edit.png" style="width:15px; margin-right: 13px;" dataHref="${admin}/${modalType.dataHref}/${response.id}" class="openPopupModel" dataBody="${modalType.dataBody}" dataTitle="${modalType.dataTitle}" dataModelId ="${modalType.dataModelId}" dataPageFormName="${modalType.dataPageFormName}" dataModalFormClass="${modalType.dataModalFormClass}">
                    </a>
                    <a href="javascript:void(0)">
                        <img class="status-btn" data-modalName = '${modalType.modalName}'
                            src="${response.isActive ? '/images/unblock.png' : '/images/block.png'}"
                            style="width:15px; cursor: pointer;" data-id="${response.id}" data-status="${response.isActive ? 'Active' : 'Inactive'}"
                        />
                    </a>
                </td>`;
                }
            });

            const row = `<tr style="color: #000; ${rowStyle}">${rowContent}</tr>`;
            tbody.append(row);
        });
    }
}




// Function to update pagination links
function updatePagination(tableId, tableUrl, totalPages, currentPage) {
    let tbId = $("#" + tableId);
    const pagination = tbId.parents().parents().find('#paginationLinks');
    pagination.empty();

    // Disable "Previous" button if on the first page
    const previousClass = currentPage === 1 ? 'disabled' : '';
    const previousLink = `<a href="javascript:void(0)" class="previous ${previousClass}" onclick="changePage('${tableId}','${tableUrl}',${currentPage - 1})">&laquo;</a>`;
    pagination.append(previousLink);

    // Display page numbers and dots for pagination
    const maxVisiblePages = 5; // Adjust as needed
    const dots = '<span class="dots">...</span>';

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        pagination.append(`<a href="javascript:void(0)" class="pagination-number" onclick="changePage('${tableId}','${tableUrl}',1)">1</a>`);
        if (startPage > 2) {
            pagination.append(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const linkClass = i === currentPage ? 'active-page' : 'pagination-number';
        const link = `<a href="javascript:void(0)" class="${linkClass}" onclick="changePage('${tableId}','${tableUrl}',${i})">${i}</a>`;
        pagination.append(link);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagination.append(dots);
        }
        pagination.append(`<a href="javascript:void(0)" class="pagination-number" onclick="changePage('${tableId}','${tableUrl}',${totalPages})">${totalPages}</a>`);
    }

    // Disable "Next" button if on the last page
    const nextClass = currentPage === totalPages ? 'disabled' : '';
    const nextLink = `<a href="javascript:void(0)" class="next ${nextClass}" ${nextClass ? '' : `onclick="changePage('${tableId}','${tableUrl}',${currentPage + 1})"`}>&raquo;</a>`;
    pagination.append(nextLink);
}

// Function to update the "Showing X to Y of Z Entries" information
function updateEntriesInfo(tableId, totalEntries) {
    $('#' + tableId).parents().parents().find('#entriesInfo').text(totalEntries);
}

// Function to change the current page and fetch data
window.changePage = function (tableId, tableUrl, page) {
    let tbId = $("#" + tableId);
    const entriesPerPage = tbId.parent().parent().find('.location').find('#entriesPerPage').val();
    const statusFilter = tbId.parent().parent().find('.location').find('#statusFilter').val();
    const search = tbId.parent().parent().find('.location').find('#search').val();

    fetchData(tableId, tableUrl, page, entriesPerPage, statusFilter, search);
    // Prevent the default behavior of anchor tags
    return false;
};

// Attach click event to sort icons
$('.fa-angle-up, .fa-angle-down').on('click', function () {
    const field = $(this).data('field');
    sortData(field, currentPage);
});

// Function to handle sorting
function sortData(field, page) {
    // Toggle sorting order if clicking on the same field
    if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        // Set a new field and default to ascending order
        sortField = field;
        sortOrder = 'ASC';
    }

    // Fetch data with the updated sorting configuration
    fetchData(tableId, tableUrl, page, entriesPerPage, statusFilter, search);
}

// Function to handle entries per page change
$('.entriesPerPage').on('change', function () {
    entriesPerPageFun($(this).val())
    entriesPerPage = $(this).val();
    fetchData(tableId, tableUrl, currentPage, entriesPerPage, statusFilter, search);

});

$('.statusFilter').on('change', function () {
    statusFilterFun($(this).val())
    statusFilter = $(this).val();
    fetchData(tableId, tableUrl, currentPage, entriesPerPage, statusFilter, search);
});

$('.search').on('input', function () {
    searchFun($(this))
});


function entriesPerPageFun(entriesPerPage) {
    if (!entriesPerPage) $(".entriesPerPage").prop('selectedIndex', 0);
}
function statusFilterFun(statusFilter) {
    if (!statusFilter) $(".statusFilter").prop('selectedIndex', 0);
}
function searchFun($this) {
    if (!$this) $(".search").val('');
    if ($this) {
        let tbId = $("#" + tableId);
        const page = tbId.parents().parents().find('#paginationLinks.active-page').text(); // get current page
        const entriesPerPage = tbId.parents().parents().find('#entriesPerPage').val();
        const statusFilter = tbId.parents().parents().find('#statusFilter').val();
        const search = $this.val().trim(); // get search input value
        fetchData(tableId, tableUrl, page, entriesPerPage, statusFilter, search);
    }
}

function customDataTable(tableId, tableUrl) {
    let tbId = $("#" + tableId);
    const initialPage = 1;
    const initialEntriesPerPage = tbId.parent().parent().find('.location').find('#entriesPerPage').val();
    const initialStatusFilter = tbId.parent().parent().find('.location').find('#statusFilter').val();
    const initialSearch = tbId.parent().parent().find('.location').find('#search').val();
    // Corrected the selector for search

    fetchData(tableId, tableUrl, initialPage, initialEntriesPerPage, initialStatusFilter, initialSearch);
}

if (tableId) {
    tableUrl = $('#' + tableId).attr('data-url')
    customDataTable(tableId, tableUrl)
}

// Add this click event handler for the status buttons
$(document).on('click', '.status-btn', function () {
    const id = $(this).data('id');
    let type = $(this).attr('data-type');
    const modalName = $(this).attr('data-modalName');
    const newStatus = $(this).data('status') === 'Active' ? 'Inactive' : 'Active';
    // Call a function to update the status on the server
    if (type != undefined) {
        type = type
    } else {
        type = ''
    }
    updateStatus(tableId, tableUrl, id, newStatus, modalName, type);
});
// Add a new function to update the status on the server
function updateStatus(tableId, tableUrl, id, newStatus, modalName, type) {
    // Make an AJAX request to update the status
    $.ajax({
        url: `${admin}/update-status`,
        method: 'POST',
        data: {
            id: id,
            newStatus: newStatus,
            modalName: modalName,
            type: type
        },
        success: function (response) {
            if (dataTable) {
                dataTable.ajax.reload(null, false);
            }
            newStatus === 'Active' ? valid.snackbar_success('Active Successfully') : valid.snackbar_error('Inactive Successfully');
            const button = $(`.status-button[data-id="${id}"]`);
            button.data('status', newStatus).css('background-color', newStatus === 'active' ? 'green' : 'red');
            const imgSrc = newStatus === 'active' ? '/images/unblock.png' : '/images/block.png';
            button.find('img').attr('src', imgSrc);

            // Refresh the table
            if (tableId) {
                let tbId = $("#" + tableId);
                const currentPage = tbId.parents().parents().find('#paginationLinks.active-page').text(); // get current page
                const entriesPerPage = tbId.parents().parents().find('#entriesPerPage').val();
                const statusFilter = tbId.parents().parents().find('#statusFilter').val();
                const search = tbId.parents().parents().find('#search').val().trim(); // get search input value
                fetchData(tableId, tableUrl, currentPage, entriesPerPage, statusFilter, search);
            }
        },
        error: function (error) {
            console.error('Error updating status:', error);
            // Handle error, show a message, etc.
        }
    });
}
