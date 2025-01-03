
<% ['Blog Image'].forEach(function (item, index) { %>
<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
<div class="form-group m-b-30">
	<label for="file_<%= index + 1 %>" class="col-form-label label-col-1">
		<%= item %> (Allow Only .jpeg, .jpg, .png)
	</label>
	<div class="input-group">
		<div class="input-group-prepend">
			<div class="fileUpload btn btn-secondary upload-btn">
				<span class="upl">Upload Img</span>
				<input type="file" id="file_upl_<%= index + 1 %>" class="upload up"
					accept="image/*"
					onchange="imageFile($(this), 'uploads/blog/', 'file_name_<%= index + 1 %>', 'upl_file_view_<%= index + 1 %>', 'upl_file_remove_<%= index + 1 %>', 'submitBtn', 3,200)" />
				<input type="hidden" name="file_name_<%= index + 1 %>"
					id="file_name_<%= index + 1 %>" value="<%= data.image %>" />
			</div>
		</div>
		<input type="text" placeholder="No File chosen"
			class="form-control in_field img_error custom_label img_name_display"
			name="file_name_display_<%= index + 1 %>" id="file_name_display_<%= index + 1 %>"
			value="<%= data.image %>" readonly />
	</div>
	<div class="progress progress_pro" style="display:none;">
		<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
			style="width: 0%"></div>
	</div>
</div>
</div>
<div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-4" style="position: relative;">
<span class="FileExt">

	<% if(data.fileType!=='image' ) { %>
		<%=data.fileEXT ? data.fileEXT : '' %>
			<% }%>


</span>
<span class="doc_append_<%= index + 1 %>" id="upl_file_view_<%= index + 1 %>"
	style="<%= data.image ? 'display: inline-block;' : 'display: none;' %>">
	<% if(data.fileType==='image' ) { %>
		<img src="<%= data.image ? `/uploads/blog/${data.image}` : '' %>"
			class="upl_file_view_<%= index + 1 %>" style="height: 100px; width: 100px;" />
		<% } else { %>
			<img src="<%= data.image ? '/images/file.png' : '' %>"
				class="upl_file_view_<%= index + 1 %>" style="height: 100px; width: 100px;" />
			<% } %>


</span>
<input type="button" id="upl_file_remove_<%= index + 1 %>" value="x"
	class="rmv upl_file_remove_<%= index + 1 %>"
	onclick="removeFile($(this), 'file_upl_<%= index + 1 %>', 'upl_file_view_<%= index + 1 %>', 'file_name_<%= index + 1 %>', 'uploads/blog/', 'doc_append_<%= index + 1 %>', 'file_name_display_<%= index + 1 %>', <%= data.image ? 1 : 2 %>)"
	style="position: absolute; left: 95px; top: -8px; <%= data.image ? 'display: inline-block;' : 'display: none;' %>" />
</div>
<% }) %>

	// file handel

	function imageFile($input, path, hiddenId, viewId, removeId, submitButtonId, type, validsize = 200) {
		const files = $input.prop('files');
		if (!files.length) {
			valid.snackbar_error("Please select a file.");
			return;
		}
		const fileTypes = {
			1: ['jpg', 'jpeg', 'png', 'webp'],
			2: ['pdf'],
			3: ['xlsx', 'xlsm', 'xlsb', 'xltx'],
			4: ['doc', 'docx', 'txt'],
			5: ['*']  // All files
		};
		if (!fileTypes[type]) {
			valid.snackbar_error("Invalid file type.");
			return;
		}

		// Check file extension
		if (fileTypes[type] !== '*' && !fileTypes[type].includes(fileExtension)) {
			valid.snackbar_error(`Invalid file type. Allowed types: ${fileTypes[type].join(', ')}`);
			$input.val('');
			return;
		}
		const formatFileSize = (sizeInKB) => {
			return sizeInKB < 1024 ? `${sizeInKB} KB` : `${(sizeInKB / 1024).toFixed(0)} MB`;
		};
		// Check file size
		if (fileSizeInKB > validsize) {
			valid.snackbar_error(`File size exceeds ${formatFileSize(validsize)} limit.`);
			$input.val('');
			return;
		}

		const names = $.map(files, file => file.name);
		$input.closest('.form-group').find('.img_name_display').val(names);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', path);
		formData.append('type', type);
		formData.append('names', names);
		formData.append('validsize', validsize);

		const $submitButton = $('#' + submitButtonId).attr('disabled', 'disabled');
		const $progressBar = $input.closest('.form-group').find('.progress-bar');
		const $progressContainer = $progressBar.closest('.progress_pro').show();
		$progressBar.css('width', '0%').text('0%');

		$.ajax({
			xhr: function () {
				const xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function (event) {
					if (event.lengthComputable) {
						const percentComplete = (event.loaded / event.total * 100).toFixed(2);
						$progressBar.css('width', percentComplete + '%').text(percentComplete + '%');
					}
				}, false);
				return xhr;
			},
			method: "POST",
			url: `${admin}/upload-attach-file`,
			data: formData,
			contentType: false,
			cache: false,
			processData: false,
			dataType: "json",
			success: function (response) {
				if (response.status === 'SUCCESS') {
					if (response.data.type == '1') {
						const imgElement = `<img src="/${path}${response.data.filename}" style="height: 100px; width: 100px;">`;
						$('#' + viewId).html(imgElement).show();
						$('#' + removeId).show();
						$('#' + hiddenId).val(response.data.filename);
					}
					else {
						const imgElement = `<a href="/${path}${response.data.filename}" target="_blank"><img src="/images/file.png" style="height: 100px; width: 100px;"></a>`;
						$('.FileExt').text(fileExtension)
						$('#' + viewId).html(imgElement).show();
						$('#' + removeId).show();
						$('#' + hiddenId).val(response.data.filename);
					}


				} else {
					valid.snackbar_error(response.message);
					$input.closest('.form-group').find('.img_name_display').val('');
					$progressContainer.hide();
				}
			},
			error: function () {
				valid.snackbar_error("File upload failed. Please try again.");
				$input.closest('.form-group').find('.img_name_display').val('');
				$progressContainer.hide();
			},
			complete: function () {
				$submitButton.removeAttr('disabled');
				setTimeout(() => $progressContainer.hide(), 1000);
			}
		});
	}

function removeFile($button, fileId, viewId, fileNameId, path, removeFile, removeVal, formType) {
	const $fileNameInput = $("#" + fileNameId);
	if (formType === 1) {
		$fileNameInput.val('');
		$("#" + viewId).attr('src', '').hide();
		$("." + removeFile).html(`<img id="${viewId}"/>`);
		$("#" + removeVal).val('');
		$('.FileExt').text('');
		$button.hide();
	} else {
		const filename = $fileNameInput.val();
		$.ajax({
			url: `${admin}/delete-attach-file`,
			type: 'POST',
			data: { filename: filename, path: path },
			dataType: "json",
			success: function (data) {
				if (data.status === "success") {
					$("#" + fileId).val('');
					$fileNameInput.val('');
					$("#" + viewId).attr('src', '').hide();
					$("." + removeFile).html(`<img id="${viewId}"/>`);
					$("#" + removeVal).val('');
					$('.FileExt').text('');
					$button.hide();
				}
			}
		});
	}
}