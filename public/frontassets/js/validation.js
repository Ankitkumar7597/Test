var admin = $("#admin").val();
var front = $("#front").val();

var captchaWidgets = {};

function onLoadCallback() {
    $('.g-recaptcha').each(function () {
        var formId = $(this).closest('form').attr('id');
        if (formId) {
            var widgetId = grecaptcha.render(this, {
                'sitekey': '6Lc02ioqAAAAANw3J5SrEr_PN7f7eTSEwRA_P9oe'
            });
            captchaWidgets[formId] = widgetId;
        }
    });
}


function resetCaptchaByFormId(formId) {
    if (captchaWidgets[formId]) {
        grecaptcha.reset(captchaWidgets[formId]);
    }
}




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
        var twitterURL = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
        return twitterURL.test(enteredURL);
    },
    validGPlusURL: function (enteredURL) {
        var gPlusURL = /\+[^/]+|\d{21}/;
        return gPlusURL.test(enteredURL);
    },
    validInstagramURL: function (enteredURL) {
        var instagramURL = /^(http|https)\:\/\/www.instagram.com\/.*/im;
        return instagramURL.test(enteredURL);
    },
    validLinkedinURL: function (enteredURL) {
        var LinkedinURL = /^(http|https)\:\/\/www.linkedin.com\/.*/im;
        return LinkedinURL.test(enteredURL);
    },
    validYoutubeURL: function (enteredURL) {
        //var YoutubeURL =  /^(http|https)\:\/\/www.youtube.com\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        //	/(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
        var YoutubeURL = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        return YoutubeURL.test(enteredURL);
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
        return "<p class='text-white px-4 py-2 rounded bg-red-600'><strong>Error: </strong>" + msg + "</p>";
    },
    success: function (msg) {
        return "<p class='text-white px-4 py-2 rounded bg-green-600'>" + msg + "</p>";
    },
    info: function (msg) {
        return "<p class='text-white px-4 py-2 rounded bg-blue-600'>" + msg + "</p>";
    },


};
$(document).ready(function () {
    $('.in_field').on('change', function (e) {
        var select2 = $(this).attr('id');
        var val = $("#" + select2).val();
        if (val != '') {
            $("#" + select2).removeClass("error");
            $("#" + select2 + "-error").css("display", "none");
        }

    });

    $.validator.addMethod("threeDigitNumber", function (value, element) {
        const intValue = parseInt(value);
        return this.optional(element) || (/^\d+$/.test(value) && intValue >= 1 && intValue <= 100);
    }, "Please enter a valid two or three-digit number.");

    // Add custom PAN number validation method
    $.validator.addMethod("validatePanNumber", function (value, element) {
        // PAN number regex pattern
        var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

        // Check if the PAN number matches the pattern
        return this.optional(element) || panPattern.test(value);
    }, "Please enter a valid PAN number.");

    $.validator.addMethod("validateAadhaarNumber", function (value, element) {
        // Aadhaar number regex pattern
        var aadhaarPattern = /^\d{12}$/;

        // Check if the Aadhaar number matches the pattern
        return this.optional(element) || aadhaarPattern.test(value);
    }, "Please enter a valid Aadhaar number.");


    $.validator.addMethod("validateGST", function (value, element) {
        // PAN number regex pattern
        var gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

        // Check if the PAN number matches the pattern
        return gstRegex.test(value);
    }, "Please enter a Valid GST number.");

    $.validator.addMethod("checklower", function (value) {
        return /[a-z]/.test(value);
    });
    $.validator.addMethod("checkupper", function (value) {
        return /[A-Z]/.test(value);
    });
    $.validator.addMethod("checkdigit", function (value) {
        return /[0-9]/.test(value);
    }); $.validator.addMethod("checkspecial", function (value) {
        return /[!@#$%^&*()_+|*{}<>]/.test(value);
    });
    $.validator.addMethod("checkgstvalid", function (value) {
        if (value.length == 0) {
            return true
        }
        else {
            var gstinformat = RegExp('^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1})+$');
            return gstinformat.test(value);
        }
    });

    $.validator.addMethod("validateEmail", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        }
    });
    $.validator.addMethod("phonenumber", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^\d{10}$/;
            return re.test(value);
        }
    });
    $.validator.addMethod("validFBurl", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^(http|https)\:\/\/www.facebook.com\/.*/i;
            return re.test(value);
        }
    });
    $.validator.addMethod("validYoutubeURL", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
            return re.test(value);
        }
    });
    $.validator.addMethod("validTwitterurl", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
            return re.test(value);
        }
    });
    $.validator.addMethod("validInstagramURL", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^(http|https)\:\/\/www.instagram.com\/.*/im;
            return re.test(value);
        }
    });
    $.validator.addMethod("validLinkedinURL", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /^(http|https)\:\/\/www.linkedin.com\/.*/im;
            return re.test(value);
        }
    });

    $.validator.addMethod("validURL", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            return re.test(value);
        }
    });

    $.validator.addMethod("validURL2", function (value) {
        if (value.length == 0) {
            return true;
        } else {
            var link = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            return link.test(value);
        }
    });


    $.validator.addMethod("checkFutureDate", function (value) {

        var current_date = new Date().setHours(0, 0, 0, 0)
        var selected_date = new Date(value).setHours(0, 0, 0, 0)
        if (current_date <= selected_date) {
            return true;
        }
        else {
            return false;
        }
    });



    $.validator.addMethod('lessThanEqual', function (value, element, param) {
        if (this.optional(element)) return true;
        var i = parseInt(value);
        var j = parseInt($("#product_mrp").val());
        return i <= j;
    }, "The value {0} must be less than {1}");

    $('#open_game_result').hide();
    jQuery.validator.addMethod("dollarsscents", function (value, element) {
        return this.optional(element) || /^\d{0,4}(\.\d{0,2})?$/i.test(value);
    }, "You must include two decimal places");


    $.validator.addMethod("validOfferPrice", function (value, element) {
        // Get the values of both "Price" and "Offer Price" and convert them to floating-point numbers
        var price = parseFloat($('#price').val());
        var offerPrice = parseFloat(value);
        if (offerPrice && price) {
            return offerPrice >= 0 && offerPrice <= price;
        } else {
            return true
        }

        // Check if both "Price" and "Offer Price" are valid numbers and if "Offer Price" is within the price range
    }, "Offer price must be within the price range.");

    $("#contact-us-frm").validate({
        ignore: "",
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            PhoneNumber: {
                required: true,
                phonenumber: true   // Ensure it contains only digits
            },
            email: {
                required: true,
                validateEmail: true
            },

        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Name must be at least 2 characters"
            },
            PhoneNumber: {
                required: "Please enter your mobile number",
                phonenumber: "Please enter a valid mobile number"
            },
            email: {
                required: "Please enter your email address",
                validateEmail: "Please enter a valid email address"
            },
        },
        submitHandler: function (form) {
            $("#contactSubmitBtn").attr("disabled", true);
            $("#btn_spinner").css('display', 'block');
            $.ajax({
                url: `/submit-contact-us-form`,
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    // alert(data.status)
                    if (data.status == "SUCCESS") {
                        if (data.data.type == 1) {

                        } else {
                            $('#contact-us-frm')[0].reset();
                            $(".g-recaptcha-outer-div").html(``)
                            $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                            onLoadCallback()
                        }
                        window.setTimeout(function () {
                            $("#contactSubmitBtn").attr('disabled', false);
                            $("#btn_spinner").css('display', 'none');
                        }, 500);
                        $("#errorMessage").html(valid.success(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                    } else {
                        $("#errorMessage").html(valid.error(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                        $("#btn_spinner").css("display", "none");
                        $("#contactSubmitBtn").attr("disabled", false);
                        $(".g-recaptcha-outer-div").html(``)
                        $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                        onLoadCallback()
                    }
                },
                error: function (jqXHR, exception) {
                    var msg = valid.ajaxError(jqXHR, exception);
                    $("#errorMessage").html(valid.error(msg)).fadeIn('slow').delay(5000).fadeOut('slow');
                    $("#btn_spinner").css("display", "none");
                    $("#contactSubmitBtn").attr("disabled", false);
                    $(".g-recaptcha-outer-div").html(``)
                    $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                    onLoadCallback()

                }
            });
            return false;
        }
    });

    $("#distributer-form-content").validate({
        ignore: "",
        rules: {
            companyName: {
                required: true,
                minlength: 2
            },
            cityName: {
                required: true,
                minlength: 2
            },
            businessType: {
                required: true,
                minlength: 2
            },
            mobileNumber: {
                required: true,
                phonenumber: true
            },
            email: {
                required: true,
                validateEmail: true
            },
        },
        messages: {
            companyName: {
                required: "Please enter your company name",
                minlength: "Company name must be at least 2 characters"
            },
            cityName: {
                required: "Please enter your city name",
                minlength: "City name must be at least 2 characters"
            },
            businessType: {
                required: "Please enter your business type",
                minlength: "Business type must be at least 2 characters"
            },
            mobileNumber: {
                required: "Please enter your mobile number",
                phonenumber: "Please enter a valid mobile number"
            },
            email: {
                required: "Please enter your email address",
                validateEmail: "Please enter a valid email address"
            },
        },
        submitHandler: function (form) {
            $("#submitDistributer").attr("disabled", true);
            $("#btn_spinner").css('display', 'block');
            $.ajax({
                url: `/submit-distributor-form`,
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    if (data.status == "SUCCESS") {
                        if (data.data.type == 1) {
                            // Handle type 1 success
                        } else {
                            $('#distributer-form-content')[0].reset();
                            $(".g-recaptcha-outer-div").html(``)
                            $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                            onLoadCallback()
                        }
                        window.setTimeout(function () {
                            $("#submitDistributer").attr('disabled', false);
                            $("#btn_spinner").css('display', 'none');
                            document.body.classList.remove('overflow-y-hidden');
                            $('#distributer-form').addClass('hidden');
                        }, 2000);
                        $("#errorMessageDistribute").html(valid.success(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                    } else {
                        $("#submitDistributer").attr('disabled', false);
                        $("#btn_spinner").css('display', 'none');
                        $(".g-recaptcha-outer-div").html(``)
                        $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                        onLoadCallback()
                        $("#errorMessageDistribute").html(valid.error(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                    }
                },
                error: function (jqXHR, exception) {
                    var msg = valid.ajaxError(jqXHR, exception);
                    $("#errorMessageDistribute").html(valid.error(msg)).fadeIn('slow').delay(5000).fadeOut('slow');
                    $("#btn_spinner").css("display", "none");
                    $("#submitDistributer").attr("disabled", false);
                    $(".g-recaptcha-outer-div").html(``)
                    $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                    onLoadCallback()
                }
            });
            return false;
        }

    });

    $("#apply-form-content").validate({
        ignore: "",
        rules: {
            fullName: {
                required: true,
                minlength: 2
            },
            mobileNumberCareer: {
                required: true,
                phonenumber: true
            },
            emailCareer: {
                required: true,
                validateEmail: true
            },
            upload_resume: {
                required: true,
            },
        },
        messages: {
            fullName: {
                required: "Please enter your  name",
                minlength: "Name must be at least 2 characters"
            },
            mobileNumberCareer: {
                required: "Please enter your mobile number",
                phonenumber: "Please enter a valid mobile number"
            },
            emailCareer: {
                required: "Please enter your email address",
                validateEmail: "Please enter a valid email address"
            },
            upload_resume: {
                required: "Please upload your resume",
            },
        },
        submitHandler: function (form) {
            $("#careerSubmitBtn").attr("disabled", true);
            $("#btn_spinner1").css('display', 'block');
            $.ajax({
                url: `/submit-career-form`,
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    if (data.status == "SUCCESS") {
                        if (data.data.type == 1) {
                            // Handle type 1 success
                        } else {
                            $("#fullName,#mobileNumberCareer,#emailCareer,#upload_resume,#messageCareer").val('')
                            $(".g-recaptcha-outer-div").html(``)
                            $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                            onLoadCallback()
                        }
                        window.setTimeout(function () {
                            $("#careerSubmitBtn").attr('disabled', false);
                            $("#btn_spinner1").css('display', 'none');
                            document.body.classList.remove('overflow-y-hidden');
                            $('#apply-form').addClass('hidden');
                        }, 2000);
                        $("#errorMessageCareer").html(valid.success(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                    } else {
                        $("#careerSubmitBtn").attr('disabled', false);
                        $("#btn_spinner1").css('display', 'none');
                        $(".g-recaptcha-outer-div").html(``)
                        $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                        onLoadCallback()
                        $("#errorMessageCareer").html(valid.error(data.message)).fadeIn('slow').delay(2500).fadeOut('slow');
                    }
                },
                error: function (jqXHR, exception) {
                    var msg = valid.ajaxError(jqXHR, exception);
                    $("#errorMessageCareer").html(valid.error(msg)).fadeIn('slow').delay(5000).fadeOut('slow');
                    $("#btn_spinner1").css("display", "none");
                    $("#careerSubmitBtn").attr("disabled", false);
                    $(".g-recaptcha-outer-div").html(``)
                    $(".g-recaptcha-outer-div").html(`<div class="g-recaptcha"></div>`)
                    onLoadCallback()
                }
            });
            return false;
        }
    });

});