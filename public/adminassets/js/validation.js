var admin = $("#admin").val();
var front = $("#front").val();
var valid = {
  ajaxError: function (jqXHR, exception) {
    var msg = "";
    if (jqXHR.status === 0) {
      msg = "Not connect.\n Verify Network.";
    } else if (jqXHR.status == 404) {
      msg = "Requested page not found. [404]";
    } else if (jqXHR.status == 500) {
      msg = "Internal Server Error [500].";
    } else if (exception === "parsererror") {
      msg = "Requested JSON parse failed.";
    } else if (exception === "timeout") {
      msg = "Time out error.";
    } else if (exception === "abort") {
      msg = "Ajax request aborted.";
    } else {
      msg = "Uncaught Error.\n" + jqXHR.responseText;
    }
    return msg;
  },
  snackbar: function (msg) {
    $("#snackbar").html(msg).fadeIn("slow").delay(3000).fadeOut("slow");
  },
  snackbar2: function (msg) {
    $("#snackbar").html(msg).fadeIn("slow").delay(3000).fadeOut("slow");
  },
  snackbar_error: function (msg) {
    $("#snackbar-error").html(msg).fadeIn("slow").delay(3000).fadeOut("slow");
  },
  snackbar_success: function (msg) {
    $("#snackbar-success").html(msg).fadeIn("slow").delay(3000).fadeOut("slow");
  },
  error: function (msg) {
    return (
      "<p class='alert alert-danger'><strong>Error : </strong> " + msg + "</p>"
    );
  },
  success: function (msg) {
    return "<p class='alert alert-success'>" + msg + "</p>";
  },
  info: function (msg) {
    return "<p class='alert alert-info'>" + msg + "</p>";
  }
};

$(document).ready(function () {
  $(".in_field").on("change", function (e) {
    var select2 = $(this).attr("id");
    var val = $("#" + select2).val();
    if (val != "") {
      $("#" + select2).removeClass("error");
      $("#" + select2 + "-error").css("display", "none");
    }
  });
  $.validator.addMethod(
    "threeDigitNumber",
    function (value, element) {
      const intValue = parseInt(value);
      return (
        this.optional(element) ||
        (/^\d+$/.test(value) && intValue >= 1 && intValue <= 100)
      );
    },
    "Please enter a valid two or three-digit number."
  );
  // Add custom PAN number validation method
  $.validator.addMethod(
    "validatePanNumber",
    function (value, element) {
      // PAN number regex pattern
      var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      // Check if the PAN number matches the pattern
      return this.optional(element) || panPattern.test(value);
    },
    "Please enter a valid PAN number."
  );
  $.validator.addMethod(
    "validateAadhaarNumber",
    function (value, element) {
      // Aadhaar number regex pattern
      var aadhaarPattern = /^\d{12}$/;
      // Check if the Aadhaar number matches the pattern
      return this.optional(element) || aadhaarPattern.test(value);
    },
    "Please enter a valid Aadhaar number."
  );
  $.validator.addMethod(
    "validateGST",
    function (value, element) {
      // PAN number regex pattern
      var gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

      // Check if the PAN number matches the pattern
      return gstRegex.test(value);
    },
    "Please enter a Valid GST number."
  );
  $.validator.addMethod("checklower", function (value) {
    return /[a-z]/.test(value);
  });
  $.validator.addMethod("checkupper", function (value) {
    return /[A-Z]/.test(value);
  });
  $.validator.addMethod("checkdigit", function (value) {
    return /[0-9]/.test(value);
  });
  $.validator.addMethod("checkspecial", function (value) {
    return /[!@#$%^&*()_+|*{}<>]/.test(value);
  });
  $.validator.addMethod("checkgstvalid", function (value) {
    if (value.length == 0) {
      return true;
    } else {
      var gstinformat = RegExp(
        "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1})+$"
      );
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
      var re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
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
  $.validator.addMethod("checkFutureDate", function (value) {
    var current_date = new Date().setHours(0, 0, 0, 0);
    var selected_date = new Date(value).setHours(0, 0, 0, 0);
    if (current_date <= selected_date) {
      return true;
    } else {
      return false;
    }
  });
  $.validator.addMethod(
    "lessThanEqual",
    function (value, element, param) {
      if (this.optional(element)) return true;
      var i = parseInt(value);
      var j = parseInt($("#product_mrp").val());
      return i <= j;
    },
    "The value {0} must be less than {1}"
  );

  //Login Form
  $("#loginform").validate({
    ignore: "",
    rules: {
      username: {
        required: true
      },
      password: {
        required: true
      },
      hiddenRecaptcha: {
        required: function () {
          var response = grecaptcha.getResponse(oneCaptcha);
          console.log("response", response);
          if (response == "") {
            $(".captcha_error").html(
              '<span class="text-danger font-weight-bold">You must complete the antispam verification *</span>'
            );
            return true;
          } else {
            $(".captcha_error").html("");
            return false;
          }
        }
      }
    },
    messages: {
      username: {
        required: "Please enter username"
      },
      password: {
        required: "Please enter password"
      }
    },
    submitHandler: function (form) {
      $("#submitBtn").attr("disabled", true);
      $("#btn_spinner").css("display", "inline-block");
      $.ajax({
        url: `${admin}/admin-login-check`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#loginmsg").html(valid.success(data.message));
            var url = admin + data.data.url;
            $(location).attr("href", url);
          } else {
            $("#loginmsg")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#loginmsg")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        }
      });
      return false;
    }
  });
  $("#recoverform").validate({
    ignore: "",
    rules: {
      email: {
        required: true,
        remote: {
          url: `${admin}/check-email`,
          type: "post"
        }
      },
      hiddenRecaptcha: {
        required: function () {
          var response = grecaptcha.getResponse(oneCaptcha);
          if (response == "") {
            $(".captcha_error").html(
              '<span class="text-danger font-weight-bold">You must complete the antispam verification *</span>'
            );
            return true;
          } else {
            $(".captcha_error").html("");
            return false;
          }
        }
      }
    },
    messages: {
      email: {
        required: "Please enter email",
        remote: "Email is not found"
      }
    },
    submitHandler: function (form) {
      $("#submitBtn").attr("disabled", true);
      $("#btn_spinner").css("display", "inline-block");
      $.ajax({
        url: `${admin}/forgot-password`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#recovermsg")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
            $("#recoverform")[0].reset();
          } else {
            $("#recovermsg")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#recovermsg")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        }
      });
      return false;
    }
  });

  /* profileForm  */
  $("#profileForm").validate({
    rules: {
      admin_email: {
        required: true,
        validateEmail: true
      },
      panNumber: {
        // validatePanNumber: true,
      }
    },
    messages: {
      admin_email: {
        required: "Please enter email",
        validateEmail: "Please enter valid email format"
      },
      panNumber: {
        // validatePanNumber: 'Please enter a valid PAN number.',
      }
    },
    submitHandler: function (form) {
      $("#submitBtn1").attr("disabled", true);
      $("#btn_spinner").css("display", "inline-block");
      $.ajax({
        url: `${admin}/update-profile`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#errormsg1")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          } else {
            $("#errormsg1")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner").css("display", "none");
          $("#submitBtn1").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#errormsg1")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner").css("display", "none");
          $("#submitBtn1").attr("disabled", false);
        }
      });
      return false;
    }
  });

  /* generalSettingFrm  */
  $("#generalSettingFrm").validate({
    rules: {
      mobileNumber: {
        required: true,
        phonenumber: true
      },
      optionalMobileNumber: {
        phonenumber: true
      },
      businessEmail: {
        required: true,
        validateEmail: true
      },
      facebook: {
        validFBurl: true
      },
      instagram: {
        validInstagramURL: true
      },
      linkedin: {
        validLinkedinURL: true
      },
      youtube: {
        validYoutubeURL: true
      },
      adminAddress: {
        minlength: 10
      },
      adminAddress2: {
        minlength: 10
      }
    },
    messages: {
      mobileNumber: {
        required: "Please enter Mobile Number 1",
        phonenumber: "Please enter valid Mobile Number 1"
      },
      optionalMobileNumber: {
        phonenumber: "Please enter valid Mobile Number 2"
      },
      businessEmail: {
        required: "Please enter Business Email Address",
        validateEmail: "Please Enter valid Business Email Address"
      },
      facebook: {
        validFBurl: "Please enter facebook url"
      },
      instagram: {
        validInstagramURL: "Please enter instagram url"
      },
      linkedin: {
        validLinkedinURL: "Please enter linkedin url"
      },
      youtube: {
        validYoutubeURL: "Please enter valid youtube url"
      },
      adminAddress: {
        minlength: "Address must contain 10 characters"
      },
      adminAddress2: {
        minlength: "Address 2 must contain 10 characters"
      }
    },
    submitHandler: function (form) {
      $("#submitBtn2").attr("disabled", true);
      $("#btn_spinner_2").css("display", "inline-block");
      $.ajax({
        url: `${admin}/update-general-settings`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#errormsg3")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          } else {
            $("#errormsg3")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner_2").css("display", "none");
          $("#submitBtn2").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#errormsg3")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner_2").css("display", "none");
          $("#submitBtn2").attr("disabled", false);
        }
      });
      return false;
    }
  });

  //Change Password Form
  $("#changePassFrm").validate({
    rules: {
      old_password: {
        required: true,
        remote: {
          url: `${admin}/check-old-password`,
          type: "post"
        }
      },
      new_password: {
        required: true,
        minlength: 8,
        checklower: true,
        checkupper: true,
        checkdigit: true,
        checkspecial: true
      },
      confirm_password: {
        required: true,
        equalTo: "#new_password"
      }
    },
    messages: {
      old_password: {
        required: "Please enter old password",
        remote: "Old password does not match"
      },
      new_password: {
        required: "Please enter new password",
        minlength: "Password must contain 8 characters",
        checklower: "Password must contain lower case character",
        checkupper: "Password must contain upper case character",
        checkdigit: "Password must contain number",
        checkspecial: "Password must contain at least one special character"
      },
      confirm_password: {
        required: "Please enter confirm password",
        equalTo: "Confirm password does not match"
      }
    },
    submitHandler: function (form) {
      $("#submitBtnPass").attr("disabled", true);
      $("#btn_spinner_4").css("display", "inline-block");
      $.ajax({
        url: `${admin}/update-admin-password`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#errormsgPass")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
            $("#changePassFrm")[0].reset();
          } else {
            $("#errormsgPass")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner_4").css("display", "none");
          $("#submitBtnPass").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#errormsgPass")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner_4").css("display", "none");
          $("#submitBtnPass").attr("disabled", false);
        }
      });
      return false;
    }
  });

  //Password Reset
  $("#resetFrm").validate({
    ignore: "",
    rules: {
      new_password: {
        required: true,
        minlength: 8,
        checklower: true,
        checkupper: true,
        checkdigit: true,
        checkspecial: true
      },
      confirm_password: {
        required: true,
        equalTo: "#new_password"
      },
      hiddenRecaptcha: {
        required: function () {
          var response = grecaptcha.getResponse(oneCaptcha);
          if (response == "") {
            $(".captcha_error").html(
              '<span class="text-danger font-weight-bold">You must complete the antispam verification *</span>'
            );
            return true;
          } else {
            $(".captcha_error").html("");
            return false;
          }
        }
      }
    },
    messages: {
      new_password: {
        required: "Please enter new password",
        minlength: "Password must contain 8 characters",
        checklower: "Password must contain lower case character",
        checkupper: "Password must contain upper case character",
        checkdigit: "Password mu	st contain number",
        checkspecial: "Password must contain at least one special character"
      },
      confirm_password: {
        required: "Please enter confirm password",
        equalTo: "Confirm password does not match"
      }
    },
    submitHandler: function (form) {
      $("#submitBtn").attr("disabled", true);
      $("#btn_spinner").css("display", "inline-block");
      $.ajax({
        url: `${admin}/submit-reset-password`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "success") {
            $("#resetmsg")
              .html(valid.success(data.msg))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
            var url = admin;
            $(location).attr("href", url);
          } else {
            $("#resetmsg")
              .html(valid.error(data.msg))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#resetmsg")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        }
      });
      return false;
    }
  });

  /* Script Form  */
  $("#scriptForm").validate({
    rules: {
      googleAnalyticsDesc: {
        required: true
      },
      googleAdsenseCodeDesc: {
        required: true
      },
      googleSiteKey: {
        required: true
      },
      googleSecretKey: {
        required: true
      },
      fbPixelDesc: {
        required: true
      },
      fbMessengerPageId: {
        required: true
      }
    },
    messages: {
      googleAnalyticsDesc: {
        required: "Please enter google analytics"
      },
      googleAdsenseCodeDesc: {
        required: "Please enter google adsense code"
      },
      googleSiteKey: {
        required: "Please enter google site key"
      },
      googleSecretKey: {
        required: "Please enter google secret key"
      },
      fbPixelDesc: {
        required: "Please enter facebook pixel"
      },
      fbMessengerPageId: {
        required: "Please enter facebook messenger page id"
      }
    },
    submitHandler: function (form) {
      $("#submitBtn3").attr("disabled", true);
      $("#btn_spinner_3").css("display", "inline-block");
      $.ajax({
        url: `${admin}/update-script`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#errormsg3")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          } else {
            $("#errormsg3")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#btn_spinner_3").css("display", "none");
          $("#submitBtn3").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#errormsgPass")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#btn_spinner_3").css("display", "none");
          $("#submitBtn3").attr("disabled", false);
        }
      });
      return false;
    }
  });

  /* businessSettingFrm  */
  $("#businessSettingFrm").validate({
    rules: {
      businessName: {
        required: true
      },
      businessEmail: {
        required: true,
        validateEmail: true
      }
    },
    messages: {
      businessName: {
        required: "Please enter business name"
      },
      businessEmail: {
        required: "Please enter business email",
        validateEmail: "Please enter valid email format"
      }
    },
    submitHandler: function (form) {
      $("#businessSubmitBtn").attr("disabled", true);
      $("#business_btn_spinner").css("display", "inline-block");
      $.ajax({
        url: `${admin}/update-business-settings`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
          if (data.status == "SUCCESS") {
            $("#businessErrormsg")
              .html(valid.success(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          } else {
            $("#businessErrormsg")
              .html(valid.error(data.message))
              .fadeIn("slow")
              .delay(2500)
              .fadeOut("slow");
          }
          $("#business_btn_spinner").css("display", "none");
          $("#businessSubmitBtn").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          $("#businessErrormsg")
            .html(valid.error(msg))
            .fadeIn("slow")
            .delay(5000)
            .fadeOut("slow");
          $("#business_btn_spinner").css("display", "none");
          $("#businessSubmitBtn").attr("disabled", false);
        }
      });
      return false;
    }
  });

  //testFrm
  $("#testFrm").validate({
    rules: {
      name: {
        required: true,
        minlength: 2
      },
      mobile_number: {
        required: true,
        phonenumber: true
      },
      address: {
        required: true,
        minlength: 10
      },
      office_address: {
        required: true,
        minlength: 10
      },
      file_name_1: {
        required: true
      }
    },
    messages: {
      name: {
        required: "Please enter name",
        minlength: "Name contain minimum 2 characters"
      },
      mobile_number: {
        required: "Please enter mobile number",
        phonenumber: "Please enter valid mobile number"
      },
      address: {
        required: "Please enter address",
        minlength: "Address contain minimum 10 characters"
      },
      office_address: {
        required: "Please enter office address",
        minlength: "Address contain minimum 10 characters"
      },
      file_name_1: {
        required: "Please upload image"
      }
    },
    submitHandler: function (form) {
      /*  $("#submitBtn").attr("disabled", true);
       $("#btn_spinner").css("display", "inline-block"); */
      $.ajax({
        url: `${admin}/submit-add-form`,
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
          console.log('response', response)
          if (response.status == "SUCCESS") {
            valid.snackbar_success(response.message);
            /* if (response.data.type === 1) {
              $("#testFrm")[0].reset();
              // Clear the upload file from input
            } else {
              $("#eventModal").modal("hide");
            }
            dataTable.ajax.reload(null, false); */
          } else {
            /* console.log("response", response); */
            valid.snackbar_error(response.message);
          }
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        },
        error: function (jqXHR, exception) {
          var msg = valid.ajaxError(jqXHR, exception);
          valid.snackbar_error(msg);
          $("#btn_spinner").css("display", "none");
          $("#submitBtn").attr("disabled", false);
        }
      });
      return false;
    }
  });

});

var oneCaptcha, oneCaptcha2, oneCaptcha3;
var onloadCallback = function () {
  if ($("#recaptcha1").length) {
    oneCaptcha = grecaptcha.render("recaptcha1", {
      sitekey: "6Lc02ioqAAAAANw3J5SrEr_PN7f7eTSEwRA_P9oe"
    });
  }
  if ($("#recaptcha2").length) {
    oneCaptcha2 = grecaptcha.render("recaptcha2", {
      sitekey: "6Lce8DQpAAAAAEqnW04wUUuQ1GQvFXL61eUz-9b-"
    });
  }
  if ($("#recaptcha3").length) {
    oneCaptcha3 = grecaptcha.render("recaptcha3", {
      sitekey: "6Lce8DQpAAAAAEqnW04wUUuQ1GQvFXL61eUz-9b-"
    });
  }
};

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
$(document).ready(function () {
  // Function to get states based on the selected country
  function fetchAllState(countryId, selectBoxId, otherId) {
    $.ajax({
      url: `${admin}/fetch-all-states`, // Replace with your server route
      method: "POST",
      data: { countryId: countryId },
      dataType: "json",
      success: function (data) {
        var dropDown = $(`#${selectBoxId}`);
        dropDown.empty();
        dropDown.append(
          '<option value="" selected>Please Select State</option>'
        );
        $.each(data.data, function (index, element) {
          dropDown.append(
            '<option value="' +
            element.id +
            '">' +
            element.stateName +
            "</option>"
          );
        });
        // Clear city dropdown when country changes
        clearAllCities(otherId);
      }
    });
  }
  function fetchAllCities(stateId) {
    $.ajax({
      url: `${admin}/fetch-all-cities`, // Replace with your server route
      method: "POST",
      data: { stateId: stateId },
      dataType: "json",
      success: function (data) {
        var dropdown = $(`#districtId`);
        dropdown.empty();
        dropdown.append(
          '<option value="" selected>Please Select District</option>'
        );
        $.each(data.data, function (index, element) {
          dropdown.append(
            '<option value="' +
            element.id +
            '">' +
            element.districtName +
            "</option>"
          );
        });
      }
    });
  }
  // Function to clear city dropdown
  function clearAllCities(otherId) {
    var cityDropdown = $(`#${otherId}`);
    cityDropdown.empty();
    cityDropdown.append(
      '<option value="" selected>Please Select District</option>'
    );
  }
  function clearSelectBox(otherId) {
    var Dropdown = $(`#${otherId}`);
    Dropdown.empty();
    Dropdown.append('<option value="" selected>Please Select State</option>');
  }
  // Event listener for the country dropdown
  $(".getState").change(function () {
    var countryId = $(this).val();
    var selectBoxId = $(this).attr("data-select-id");
    var otherId = $(this).attr("data-other-id");
    if (countryId) {
      fetchAllState(countryId, selectBoxId, otherId);
    } else {
      clearSelectBox(selectBoxId);
      clearAllCities(otherId);
    }
  });

  $(".getCity").change(function () {
    var stateId = $(this).val();
    var selectBoxId = $(this).attr("data-select-id");
    if (stateId) {
      fetchAllCities(stateId, selectBoxId);
    } else {
      clearAllCities(selectBoxId);
    }
  });

  $(".getZipcode").change(function () {
    var id = $(this).val();
    var inputId = $(this).attr("data-input-id");
    if (id) {
      $.ajax({
        url: `${admin}/get-zipcode`, // Replace with your server route
        method: "POST",
        data: { cityId: id },
        dataType: "json",
        success: function (data) {
          $(`#${inputId}`).val(data.data.zipCode);
        }
      });
    } else {
      $(`#${inputId}`).val("");
    }
  });
  $("#ifscCode").on("keydown focusout", function (event) {
    // Check if the Enter key (key code 13) was pressed
    if (event.which === 13 || event.type === "focusout") {
      var countryId = $("#countryId option:selected").val();
      const ifscCode = $(this).val();
      const bankNameInput = $(this).attr("data-bank-name");
      const branchNameInput = $(this).attr("data-branch-name");
      const branchAddressInput = $(this).attr("data-branch-address");

      // AJAX request using jQuery
      $.ajax({
        type: "POST",
        url: `${admin}/get-bank-details`,
        data: { ifscCode: ifscCode, countryId: countryId },
        dataType: "json",
        success: function (response) {
          if (response.status == "SUCCESS") {
            let data = response.data.data;
            $(`#${bankNameInput}`).val(data.BANK);
            $(`#${branchNameInput}`).val(data.BRANCH);
            $(`#${branchAddressInput}`).val(data.ADDRESS);
          } else if (response.status == "FAILURE") {
            $(
              `#${bankNameInput}, #${branchNameInput}, #${branchAddressInput}`
            ).val("");
            valid.snackbar_error(response.message);
          }
        },
        error: function (xhr) {
          const error = JSON.parse(xhr.responseText).error;
          console.log(`Error: ${error}`);
        }
      });
    }
  });
  $(".otherInput").change(function () {
    var shippingVal = $(this).val();
    var inputName = $(this).attr("data-input-name");
    // Remove previous dynamic input
    $(`.${inputName}`).remove();
    if (shippingVal == 3) {
      var newInput = `<input type="text" name="${inputName}" id="${inputName}" class="form-control my-2 ${inputName}" placeholder="Please enter other" />`;
      $(this).next().after(newInput);
    }
  });
  $(".disabledTwoFa").click(function () {
    $.ajax({
      type: "POST",
      url: `${admin}/disable-two-fa`,
      dataType: "json",
      success: function (response) {
        if (response.status == "SUCCESS") {
          $("#message").html(valid.success(response.message));
          var url = admin + response.data.url;
          $(location).attr("href", url);
        } else {
          valid.snackbar_error(response.message);
        }
      },
      error: function (xhr) {
        const error = JSON.parse(xhr.responseText).error;
        console.log(`Error: ${error}`);
      }
    });
  });
});
