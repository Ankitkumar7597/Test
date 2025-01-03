var base_url = $("#base_url").val();
var admin = $("#admin").val();

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

// Change logo
function changeLogoImage() {
  $.ajax({
    url: `${admin}/change-logo-image`,
    type: "POST",
    data: {},
    success: function (data) {
      if (data.status == "success") {
        if (data.logo.logo != null && data.logo.logo != "") {
          $(".logoImgChange").prop("src", `/uploads/profile/${data.logo.logo}`);
        } else {
          $(".logoImgChange").prop("src", `/adminassets/images/profile.png`);
        }
      }
    }
  });
}

$(document).ready(function () {
  $(".modal").modal({
    backdrop: "static", // Disable closing on outside click
    keyboard: false // Disable closing on Esc key
  });
});

$(document).on("click", ".openPopupModel", function (e) {
  var dataURL = $(this).attr("dataHref");
  var dataBodyClass = $(this).attr("dataBody");
  var dataTitle = $(this).attr("dataTitle");
  var dataModelId = $(this).attr("dataModelId");
  var dataPageFormName = $(this).attr("dataPageFormName");
  var dataModalFormClass = $(this).attr("dataModalFormClass");
  $("." + dataBodyClass).load(dataURL, function () {
    $(".modal-header").children(".modal-title").html(dataTitle);
    $("#" + dataModelId).modal({
      backdrop: "static", // Disable clicking outside the modal to close it
      keyboard: false // Disable closing the modal with the keyboard (Esc key)
    });
    $("#" + dataModelId).modal("show");
    if (dataPageFormName) {
      $("#" + dataPageFormName).attr({ id: "" });
      $("." + dataModalFormClass).attr({ id: dataPageFormName });
    }
  });
});

// validation on click
$(document).on("keypress", ".mobile-valid", function (e) {
  var $this = $(this);
  var key = String.fromCharCode(e.which);
  var regex = /^[0-9\b]+$/;
  // Restrict input to 10 digits
  if ($this.val().length >= 10) {
    e.preventDefault();
    return false;
  }
  // Not allow digits '1' to '5' if it's the first character
  if ($this.val().length === 0 && key >= "0" && key <= "5") {
    e.preventDefault();
    return false;
  }
  // Allow only numeric characters
  if (regex.test(key)) {
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
$(document).on("keydown", ".remove_space", function (e) {
  if (e.which === 32 && e.target.selectionStart === 0) {
    return false;
  }
});
$(document).on("keydown", ".remove_space_2", function (e) {
  if (e.which === 32) {
    return false;
  }
});
$(document).on("keydown", ".remove_back_space", function (e) {
  var $this = $(this);
  var currentValue = $this.val();
  // Check if the key pressed is the spacebar
  if (e.which === 32) {
    // Check if the last two characters are spaces
    var lastTwoChars = currentValue.slice(-2);

    if (lastTwoChars === "  ") {
      e.preventDefault(); // Prevent adding another space
      return false;
    }
  }
});
$(document).on("keypress", ".name-valid", function (e) {
  // Check if the key pressed is not a control character (like backspace, arrow keys, etc.)
  if (e.charCode != 0) {
    // Define a regex pattern that allows only letters (a-z, A-Z) and spaces
    var regex = new RegExp("^[a-zA-Z ]*$");

    // Get the character from the keypress event
    var key = String.fromCharCode(e.charCode || e.which);

    // Test the character against the regex pattern
    if (!regex.test(key)) {
      // If the character doesn't match the pattern, prevent the keypress
      e.preventDefault();
      return false;
    }
  }
});
$(document).on("keypress", ".onlyNumber", function (event) {
  const inputValue = event.key;
  const keyCode = event.which;
  // Check if the input is a number (0-9) or a control key (e.g., Backspace, Delete)
  if (
    !/^\d$/.test(inputValue) &&
    inputValue !== "." &&
    keyCode !== 8 &&
    keyCode !== 46
  ) {
    event.preventDefault(); // Prevent the input if it's not a number or dot
  }
});

// toggels
function togglePassword(type) {
  if (type == 1) {
    $(".toggle-login-password").toggleClass("fa-eye fa-eye-slash");
    var input = $($(".toggle-login-password").attr("toggle"));
  } else if (type == 2) {
    $(".toggle-login-password2").toggleClass("fa-eye fa-eye-slash");
    var input = $($(".toggle-login-password2").attr("toggle"));
  } else if (type == 3) {
    $(".toggle-login-password3").toggleClass("fa-eye fa-eye-slash");
    var input = $($(".toggle-login-password3").attr("toggle"));
  } else if (type == 4) {
    $(".toggle-login-password4").toggleClass("fa-eye fa-eye-slash");
    var input = $($(".toggle-login-password4").attr("toggle"));
  }
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
}

// 
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
  entriesPerPageFun();
  statusFilterFun();
  searchFun();
}

// admin logo upload
function previewImage() {
  const fileInput = document.getElementById("file");
  const fileInputContainer = document.querySelector(".formbold-file-input1");

  const names = Array.from(fileInput.files).map(file => file.name);
  fileInputContainer.querySelector(".empimage").value = names.join(", ");

  const formdata = new FormData();
  const files = fileInput.files;

  if (files.length > 0) {
    formdata.append("file", files[0]);
    formdata.append("path", "uploads/profile"); // Update with your actual upload path
    formdata.append("type", 1); // Update with your actual type
    formdata.append("names", names);
    formdata.append("validsize", 200);
    fileInputContainer.style.display = "block";
    $.ajax({
      xhr: function () {
        console.log("Creating XMLHttpRequest");
        const xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              const percentComplete = (evt.loaded / evt.total * 100).toFixed(2);
              fileInputContainer.querySelector(".progress-bar").style.width =
                percentComplete + "%";
            } else {
              console.log("Length not computable");
            }
          },
          false
        );

        return xhr;
      },

      method: "POST",
      url: `${admin}/upload-attach-file`,
      data: formdata,
      contentType: false,
      cache: false,
      processData: false,
      dataType: "json",
      beforeSend: function () {
        fileInputContainer.querySelector(".progress-bar").style.width = "0%";
      },
      error: function () {
        $("#uploadStatus").html(
          '<p style="color:#EA4335;">File upload failed, please try again.</p>'
        );
      },
      success: function (data) {
        console.log("data", data);
        if (data.status === "FAILURE") {
          valid.snackbar_error(data.message);
          handleUploadError();
        } else if (data.status === "SUCCESS") {
          showImagePreview(data.data.filename);
        }
      }
    });
  } else {
    valid.snackbar_error("Please select a file.");
  }

  // Prevent default form submission behavior
  event.preventDefault();
}
function showImagePreview(filename) {
  const imagePreview = document.getElementById("image-preview");
  const removeIcon = document.getElementById("remove-icon");
  var fileInputContainer = document.querySelector(".formbold-file-input1");
  const previewImage = document.getElementById("preview-image");
  const imageName = document.getElementById("imageName");
  imageName.value = filename;
  previewImage.src = `/uploads/profile/${filename}`;
  previewImage.style.display = "block"; // Show the preview image
  previewImage.style.width = "100%";
  previewImage.style.height = "139px";
  imagePreview.style.display = "block"; // Show the preview image
  removeIcon.style.display = "block";
  fileInputContainer.style.display = "none"; // Hide the file input container
}
function removeCommonImage(path) {
  // Assuming 'admin' is a global variable or defined elsewhere
  const adminUrl = `${admin}/delete-attach-file`;
  const fileInputContainer = document.querySelector(".formbold-file-input1");
  const removeIcon = document.getElementById("remove-icon");
  const imagePreview = document.getElementById("image-preview");
  const previewImage = document.getElementById("preview-image");
  const imageName = document.getElementById("imageName");
  const oldImage = document.getElementById("oldImage");
  if (oldImage.value) {
    fileInputContainer.style.display = "block";
    removeIcon.style.display = "none";
    imagePreview.style.display = "none";

    // Clearing the value of elements with the class 'empimage'
    $(".empimage").val("");

    // Clearing the value of the element with the ID 'file'
    $("#file").val("");
    imageName.value = "";
    previewImage.src = "";
  } else {
    $.ajax({
      url: adminUrl,
      type: "POST",
      data: { filename: imageName.value, path: path },
      dataType: "json",
      success: function (data) {
        if (data.status == "success") {
          fileInputContainer.style.display = "block";
          removeIcon.style.display = "none";
          imagePreview.style.display = "none";
          previewImage.src = "";

          // Clearing the value of elements with the class 'empimage'
          $(".empimage").val("");

          // Clearing the value of the element with the ID 'file'
          $("#file").val("");
          imageName.value = "";
        } else {
          console.error("Failed to delete image and folder:", data.error);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX Error:", textStatus, errorThrown);
      }
    });
  }
}
function handleUploadSuccess(data, path, hidd_id, view_id, remove_id, self) {
  const parentGroup = $(self).closest(".form-group");
  if (data.response === "upload") {
    const newImageUrl = `/${path}${data.filename}`;
    $(view_id).attr("src", newImageUrl);
    $(remove_id).css("display", "inline-block");
    $(hidd_id).val(data.filename);

    parentGroup.find(".form-control").addClass("valid").removeClass("error");
    setTimeout(() => {
      $(self.parentNode.parentNode.parentNode.nextElementSibling).fadeOut();
    }, 1000);
  } else {
    handleUploadError(self);
  }
}
function handleUploadError(self) {
  const parentGroup = $(self).closest(".form-group");
  parentGroup.find(".empimage, .form-control").val("");
  valid.snackbar_error("File upload failed, please try again.");
  $("#pro_pic_remove_1").hide();
  $(".doc_append_1").html(`<img id="pro_pic_view_1" class="pro_pic_view_1"/>`);
}

// file upload
function imageUpload(self, id, path, hidd_id, view_id, remove_id, type, validsize = 200) {
  const targetAppendImgElement = self.parentNode.parentNode.parentNode.parentNode.parentNode.nextElementSibling
  $('.submitBtn').attr('disabled', 'disabled');
  $(".img_error").trigger("focus");
  var e = jQuery.Event("keyup");
  $(".img_error").trigger(e);
  var names = [];
  for (var i = 0; i < $("#" + id).get(0).files.length; ++i) {
    names.push($("#" + id).get(0).files[i].name);
  }
  $("#" + id).closest('.form-group').find('.empimage').prop("value", names);
  var formdata = new FormData();
  var files = $('#' + id)[0].files;
  if (files.length > 0) {
    formdata.append('file', files[0]);
    formdata.append('path', path);
    formdata.append('type', type)
    formdata.append('names', names)
    formdata.append('validsize', validsize)
    $(self.parentNode.parentNode.parentNode.nextElementSibling).css("display", "block");
    $.ajax({
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = ((evt.loaded / evt.total) * 100).toFixed(2);
            $(self.parentNode.parentNode.parentNode.nextElementSibling.children[0]).width(percentComplete + '%');
            $(self.parentNode.parentNode.parentNode.nextElementSibling.children[0]).html(percentComplete + '%');
          }
        }, false);
        return xhr;
      },
      method: "POST",
      url: `${admin}/upload-attach-file`,
      data: formdata,
      contentType: false,
      cache: false,
      processData: false,
      dataType: "json",
      beforeSend: function () {
        $(self.parentNode.parentNode.parentNode.nextElementSibling.children[0]).width('0%');
      },
      error: function () {
        valid.snackbar_error('File upload failed, please try again.');
      },
      success: function (data) {
        if (data.status == 'SUCCESS') {
          $(targetAppendImgElement.querySelector("span")).html("<img id='" + view_id.id + "' class='" + view_id.id + "' src='" + '/' + path + data.data.filename + "' style='height: 100px; width: 100px;'>");
          $('.' + view_id.class).addClass('it');
          $('#' + remove_id.id).css("display", "inline-block");
          $("#" + hidd_id.id).val(data.data.filename);
          hidd_id.parentNode.parentNode.nextElementSibling.classList.remove("error")
          hidd_id.parentNode.parentNode.nextElementSibling.classList.add("valid")
          window.setTimeout(function () {
            self.parentNode.parentNode.parentNode.nextElementSibling.style.display = "none"
          }, 1000);
        } else {
          valid.snackbar_error(data.message);
          self.parentNode.parentNode.parentNode.nextElementSibling.style.display = "none"
          $("#" + hidd_id.id).val("");
          $("#" + id).closest('.form-group').find('.empimage').prop("value", '');
          $("#" + id).val("");
          $("#" + id).closest('.form-group').find('.form-control').attr("value", "");
          $('#' + remove_id.id).css("display", "none");
        }
        $('.submitBtn').removeAttr('disabled');
      }
    });
  } else {
    valid.snackbar_error("Please select a file.");
  }
  e.preventDefault();
}

function removeImage(remove_id, img_id, view_id, img_name_id, path, remove_doc, remove_val, type, formType) {

  if (formType == "edit_form") {
    $("#" + img_name_id.id).val("");
    $("#" + view_id.id).attr('src', "");
    $("." + remove_doc).html("");
    $("." + remove_doc).html(`<img id="${view_id.id}"/>`);
    $("#" + remove_val).val('');
    $('#' + remove_id).css("display", "none");
    $("#" + img_id.id).closest('.form-group').find('.form-control').attr("value", "");
  }
  else {
    $(".img_error").trigger("focus");
    var e = jQuery.Event("keyup");
    $(".img_error").trigger(e);
    var img_name = $("#" + img_name_id.id).val();
    console.log('img_name', img_name)
    console.log('img_name_id', img_name_id)
    $.ajax({
      url: `${admin}/delete-attach-file`,
      type: 'POST',
      data: { filename: img_name, path: path },
      dataType: "json",
      success: function (data) {
        console.log('data', data)
        if (data.status == "success") {
          $("#" + img_id.id).val("");
          $("#" + img_name_id.id).val("");
          $("#" + view_id.id).attr('src', "");
          $("." + remove_doc).html("");
          $("." + remove_doc).html(`<img id="${view_id.id}"/>`);
          $("#" + remove_val).val('');
          $('#' + remove_id).css("display", "none");
          $("#" + img_id.id).closest('.form-group').find('.form-control').attr("value", "");
        }
      }
    });
  }
}



