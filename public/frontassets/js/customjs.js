$(document).ready(function () {
    $('.year-picker').datepicker({
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        autoclose: true, // Corrected to lowercase
    });
    // Clear year button functionality
    $('#clear-year').on('click', function () {
        $('.year-picker').datepicker('update', ''); // Clear the datepicker value
    });
});


function imageUploadCheck(input, id, extension, size) {
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validate file type
        const validFileExtensions = extension;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validFileExtensions.includes(fileExtension)) {
            const msg = `Please upload a valid file ${(extension)}.`;
            // alert(msg);
            $("#popup-box-alert").html(`<p class='text-white px-4 py-2 rounded bg-red-500'><strong> </strong>${msg}</p>`).fadeIn('slow').delay(2500).fadeOut('slow');
            input.value = ''; // Clear the input
            return;
        }

        // Validate file size (max 20MB)
        const maxSize = size * 1024 * 1024; // 20MB in bytes
        if (file.size > maxSize) {
            const msg = `File size exceeds the maximum limit of ${size} MB.`;
            // alert(msg);
            $("#popup-box-alert").html(`<p class='text-white px-4 py-2 rounded bg-red-500'><strong> </strong>${msg}</p>`).fadeIn('slow').delay(2500).fadeOut('slow');
            input.value = ''; // Clear the input
            return;
        }

        // Optional: Upload the file (replace with your server endpoint)
        // uploadFile(file);
    }
}

$(document).on('keypress', '.only-number-valid', function (event) {
    if (!`${event.target.value}${event.key}`.match(/^[0-9]*$/
    )) {
        // block the input if result does not match
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});

$(document).on("keydown", ".remove_space", function (e) {
    if (e.which === 32 && e.target.selectionStart === 0) {
        e.preventDefault();
    }
});

$(document).on("keypress", ".mobile-valid", function (e) {
    var $this = $(this);
    var regex = new RegExp("^[0-9\b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    // for 10 digit number only
    if ($this.val().length > 9) {
        e.preventDefault();
        return false;
    }
    if (e.charCode < 54 && e.charCode > 47) {
        if ($this.val().length == 0) {
            e.preventDefault();
            return false;
        } else {
            return true;
        }
    }
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
});
$(document).on("change", ".mobile-valid", function (e) {
    var $this = $(this);
    if (isNaN($this.val())) {
        $this.val("");
        e.preventDefault();
        return false;
    }
    e.preventDefault();
    return false;
});


document.addEventListener('DOMContentLoaded', function () {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();

            const carjobBox = this.closest('.carjob-box');
            const jobDetails = carjobBox.querySelector('.job-details');

            if (this.textContent === 'Read More') {
                this.textContent = 'Read Less';
                carjobBox.classList.add('career-showdata');
                if (jobDetails) {
                    jobDetails.classList.remove('line-clamp-5'); // Remove line-clamp-5 class
                }
            } else {
                this.textContent = 'Read More';
                carjobBox.classList.remove('career-showdata');
                if (jobDetails) {
                    jobDetails.classList.add('line-clamp-5'); // Add line-clamp-5 class back
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const applyBtns = document.querySelectorAll('.apply-job');
    const popupBox = document.getElementById('apply-form');
    const closeBtn = document.getElementById('applyform-close');
    const form = document.getElementById('apply-form-content');

    applyBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            popupBox.classList.remove('hidden');
            document.body.classList.add('overflow-y-hidden'); // Add overflow-y-hidden class to body
        });
    });

    closeBtn.addEventListener('click', function () {
        popupBox.classList.add('hidden');
        document.body.classList.remove('overflow-y-hidden'); // Remove overflow-y-hidden class from body
    });

    // Hide popup when clicking outside the popup
    window.addEventListener('click', function (event) {
        if (event.target === popupBox) {
            popupBox.classList.add('hidden');
            document.body.classList.remove('overflow-y-hidden'); // Remove overflow-y-hidden class from body
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const popupBtn = document.getElementById("distributer-btn");
    const popupBox = document.getElementById("distributer-form");
    const closeBtn = document.getElementById("close-btn");
    const form = document.getElementById("distributer-form-content");

    popupBtn.addEventListener("click", function (event) {
        event.preventDefault();
        popupBox.classList.remove("hidden");
        document.body.classList.add("overflow-y-hidden"); // Add class to body when popup opens
    });

    closeBtn.addEventListener("click", function () {
        popupBox.classList.add("hidden");
        document.body.classList.remove("overflow-y-hidden"); // Remove class from body when popup closes
    });

    // Hide popup when clicking outside the popup
    window.addEventListener("click", function (event) {
        if (event.target === popupBox) {
            popupBox.classList.add("hidden");
            document.body.classList.remove("overflow-y-hidden"); // Remove class from body when popup closes
        }
    });
});


$(document).ready(function () {
    $("#investerMonth, #investerYear").on('change', function () {
        let month = $("#investerMonth").val(); // Ensure month is taken from the correct element
        let year = $("#investerYear").val();   // Get year value
        let categoryId = $("#categoryId").val();   // Get year value

        // Prepare the data object to be sent
        let Data = {};
        Data.month = month;
        Data.year = year;
        Data.categoryId = categoryId;



        $.ajax({
            url: `/invester-month-wise`, // Your server endpoint
            type: 'POST',
            data: JSON.stringify(Data), // Send data as JSON string
            contentType: 'application/json', // Content type header for JSON
            dataType: "json", // Expect JSON response
            success: function (data) {
                if (data.status === "SUCCESS") {
                    let investerData = data.data.investorData;
                    let groupedData = data.data.groupedData;

                    $("#investerList").empty();

                    if (groupedData && Object.keys(groupedData).length > 0) {
                        // Sort the years in descending order
                        Object.keys(groupedData).sort((a, b) => b - a).forEach(year => {
                            // Create a header for each year
                            let yearHeader = `<h3 class="quarterlyFinancialHeading">Quarterly Financial Results ${year}</h3>`;
                            $("#investerList").append(yearHeader);

                            // Create a list of results for each year
                            groupedData[year].forEach(result => {
                                let listItem = `
                                    <li>
                                        <a href="/uploads/investorPdf/${result.pdf}" download="Investor_${result.pdfName}">
                                            ${result.pdfName}
                                        </a>
                                    </li>
                                `;
                                $("#investerList").append(listItem);
                            });
                        });
                    } else {
                        $("#investerList").append("<li>No investors found</li>");
                    }

                    console.log("Investor Data:", investerData);
                } else {
                    console.log('Received error response:', data.message);
                    $("#errorMessage").html(valid.error(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                }
            },

            error: function (jqXHR, exception) {
                // Handle AJAX errors
                var msg = valid.ajaxError(jqXHR, exception);
                $("#errorMessage").html(valid.error(msg)).fadeIn('slow').delay(5000).fadeOut('slow');
                $("#btn_spinner").css("display", "none");
                $("#contactSubmitBtn").attr("disabled", false);
                $(".g-recaptcha-outer-div").html(``);
                $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`);
                onLoadCallback();
            }
        });

    });
});

/* 
function fetchQuote() {
    $.ajax({
        url: 'https://www.alphavantage.co/query',
        method: 'GET',
        data: {
            function: 'GLOBAL_QUOTE',
            symbol: 'CONTPTR.BO',
            apikey: '51ACHQ9B0MYOYMG4' // Replace with your actual API key
        },
        success: function (data) {
            console.log(data); // Check if the data is being received as expected
            var quote = data['Global Quote'];
            if (quote) {
                $('#quoteData').html(
                    `<p>${quote['05. price']} ${quote['09. change']} ${quote['10. change percent']}</p>`
                );
            } else {
                console.error('Global Quote not found in the response');
            }
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

setInterval(fetchQuote, 20000);

fetchQuote(); */


