var base_url = $("#base_url").val();
var admin = $("#admin").val();


$(document).ready(function () {
	const chatInput = $('.user-chat-input-section');
	const chat = $(".user-chat-conversation-list");

	// Event listener for the vendorList select box
	$(document).on("change", "#userDataList, #userTypes", function () {
		updateUserList($("#userDataList").val(), $("#userTypes").val());
		resetTicketDetails()
		chat.html('')
		chatInput.html('')
	});

	// Function to update the userList based on vendorId and status
	function updateUserList(userId, status) {
		$.ajax({
			url: `${admin}/get-user-ticket-list`,
			type: 'POST',
			data: { userId, status },
			success: function (data) {
				const userList = $("#userList");
				userList.html('');
				if (data.status == 'SUCCESS') {
					$.each(data.data, function (index, element) {
						// Convert createdAt to a Date object
						const createdAtDate = new Date(element.updatedAt);

						const formattedDate = getUserFormattedDate(createdAtDate);
						const listItem = `
					  <li class="contact-id" id="contact-id-${element.userId}" data-name="direct-message" data-userid="${element.userId}" data-ticketid="${element.id}">
						<a href="javascript:void(0)" class="px-2 pb-1 py-2">
						  <div class="row">
							<div class="col-lg-3 col-12">
							  <div class="flex-shrink-0 chat-user-img align-self-center me-2 ms-0">
								<div class="avatar-xxs"><img src="/images/avatar23.png" style="width: 35px;" alt="" /><span class="user-status"></span></div>
							  </div>
							</div>
							<div class="col-lg-9 col-12 px-0">
							  <div class="d-flex justify-content-between px-2">
								${element.ticketStatus == 0 ? '<div class="bg-info" style="height: 16px;margin-left: -13px; color: #fff; width: 35px; text-align: center; font-size: 9px; font-weight: 600; padding: 0px 0px; border-radius:5px;">Open</div>' :
								element.ticketStatus == 1 ? '<div class="bg-warning" style="height: 16px;margin-left: -13px; color: #fff; width: 35px; text-align: center; font-size: 9px; font-weight: 600; padding: 0px 0px; border-radius:5px;">Progress</div>' :
									'<div class="bg-danger" style="height: 16px;margin-left: -13px; color: #fff; width: 35px; text-align: center; font-size: 9px; font-weight: 600; padding: 0px 0px; border-radius:5px;">Closed</div>'}
								<div style="color: #5a5959; text-align: center; font-size: 10px; font-weight: 600; padding: 2px 0px; border-radius:100px;">${formattedDate}</div>
							  </div>
							  <div>
								<h5 class="single-line" style="font-size: 12px; margin-bottom:4px;">${element.subject}</h5>
								<p style="font-size: 10px;">Chat Ticket by ${element.userData.fullName}</p>
							  </div>
							</div>
						  </div>
						</a>
					  </li>`;
						userList.append(listItem);
					})
				} else {
					userList.html(`<li>
					<a href="javascript:void(0)" class="px-2 pb-1 py-2">
						<div class="row">
							<div class="col-lg-12 col-12">
								No Record Found
							</div>
						</div>
					</a>
				</li>`)
				}
			},
			error: function (error) {
				console.error("Error updating user list:", error);
			}
		});
	}
	function getUserFormattedDate(createdAt) {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		const isToday = createdAt.getDate() === today.getDate() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear();
		const isYesterday = createdAt.getDate() === yesterday.getDate() && createdAt.getMonth() === yesterday.getMonth() && createdAt.getFullYear() === yesterday.getFullYear();

		if (isToday) {
			// Display time if the date is today
			const options = { hour: 'numeric', minute: 'numeric', hour12: true };
			return `Today ${createdAt.toLocaleTimeString('en-US', options)}`;
		} else if (isYesterday) {
			// Display "Yesterday" if the date is yesterday
			return 'Yesterday';
		} else {
			// Display the full date for other days
			const options = { month: 'short', day: 'numeric', year: 'numeric' };
			return createdAt.toLocaleDateString('en-US', options);
		}
	};
	$(document).on("click", ".contact-id", function () {
		// Remove "active" class from all other "contact-id" elements
		$(".contact-id").not(this).removeClass('active');

		// Add "active" class to the clicked element
		$(this).addClass('active');
		const userId = $(this).data("userid");
		const ticketId = $(this).data("ticketid");
		loadChatContent(userId, ticketId);

		// Show loader before making the AJAX call
		showLoader();

		// Call loadChatContent after a small delay to simulate loading
		setTimeout(function () {
			loadChatContent(userId, ticketId);
			scrollToBottom();
		}, 500); // Adjust the delay (in milliseconds) as needed		
	});

	function showLoader() {
		// Display the loader container by setting display to "flex"
		$("#loader-container").css("display", "flex");
	}

	// Function to hide the loader
	function hideLoader() {
		// Hide the loader container by setting display to "none"
		$("#loader-container").css("display", "none");
	}

	function loadTextMessageBox(userId, ticketId) {
		const html = `
		<form id="chatinput-form" method="post" data-userid = "${userId}" data-ticketid = "${ticketId}" >
		  <div class="row g-0 align-items-center">
			<div class="col">
			  <div class="chat-input-feedback">Please Enter a Message</div>
			  <input type="text" class="form-control bg-light border-light" id="chat-input" placeholder="Type your message..." autocomplete="off" />
			</div>
			<div class="col-auto">
			  <div class="chat-input-links ms-2">
				<div class="links-list-item">
				  <button type="button" class="btn btn-success chat-send waves-effect waves-light" id="send-message-btn"> 
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 26px;">
					  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
					</svg>
				  </button>
				  <button type="button" class="btn-danger" data-userid = "${userId}" data-ticketid = "${ticketId}" id="closeTicket"  style="padding: 6px 14px; font-weight: 500; color: #fff; font-size: 16px; border:none; margin-top: 2px">Close Ticket</button>
				</div>
			  </div>
			</div>
		  </div>
		</form>
	  `;

		chatInput.html(userId && ticketId ? html : '');
	}

	function loadChat(userId, ticketId, messageData) {
		const chat = $(".user-chat-conversation-list");
		let html = '';

		let lastMessageDate = null;
		const today = new Date();

		messageData.forEach(element => {
			const messageType = element.type == 2 ? 'left' : 'right';
			const formattedTime = moment(element.createdAt).format('hh:mm a');
			const messageDate = new Date(element.createdAt);

			if (!lastMessageDate || !isSameDay(lastMessageDate, messageDate)) {
				const formattedDate = getFormattedDate(messageDate);
				html += `<li class="chat-date-separator">
							<span class="line-bar"></span>
							<span class="date-text">${formattedDate}</span>
							<span class="line-bar"></span>
						</li>`;
				lastMessageDate = messageDate;
			}

			const isToday = isSameDay(today, messageDate);
			const todayClass = isToday ? 'today' : '';

			html += `
				<li class="chat-list ${messageType} ${todayClass}" id="${element.id}">
					<div class="conversation-list mb-0">
						<div class="chat-avatar"><img src="/images/avatar23.png" alt="" /></div>
						<div class="user-chat-content">
							<div class="ctext-wrap">
								<div class="ctext-wrap-content" id="${element.id}">
									<p class="mb-0 ctext-content">${element.message}</p>
								</div>
							</div>
							<div class="conversation-name">
								<small class="text-muted time">${formattedTime}</small>
							</div>
						</div>
					</div>
					${isToday ? '<hr class="today-line">' : ''}
				</li>`;
		});

		chat.html(html);
		scrollToBottom()
	}

	function isSameDay(date1, date2) {
		return date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear();
	}

	function getFormattedDate(date) {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		if (isSameDay(date, today)) return 'Today';
		if (isSameDay(date, yesterday)) return 'Yesterday';

		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function scrollToBottom() {
		const chatConversation = document.getElementById('chat-conversation');

		// Calculate the new scroll position
		const newScrollPosition = chatConversation.scrollHeight - chatConversation.clientHeight;

		// Animate the scroll to the new position
		$(chatConversation).animate({
			scrollTop: newScrollPosition
		}, 'slow');
	}




	function loadChatContent(userId, ticketId) {
		$.ajax({
			url: `${admin}/get-user-chat`,
			type: 'POST',
			data: { userId, ticketId },
			success: function (data) {
				// Hide the loader when the AJAX call is successful
				hideLoader();
				if (data.status === "SUCCESS") {

					const { ticketData, messageData } = data.data;
					const displayStatus = getStatusButton(ticketData.ticketStatus, ticketData.id);
					updateTicketDetails(ticketData, displayStatus);
					if (ticketData.ticketStatus == 2) {
						chatInput.html('')
					} else {
						loadTextMessageBox(userId, ticketId);
					}
					loadChat(userId, ticketId, messageData);
				} else {
					resetTicketDetails();
					valid.snackbar_error(data.message);
				}
			},
			error: function (error) {
				hideLoader();
				console.error("Error loading chat content:", error);
			}
		});
	}

	function getStatusButton(ticketStatus, ticketId) {
		const statusColors = ["bg-info", "bg-warning", "bg-danger"];
		const statusTexts = ["Open", "Progress", "Closed"];
		const index = ticketStatus < statusColors.length ? ticketStatus : 0;
		return `<button class="status_show${ticketId} ${statusColors[index]}" style="color: #fff; padding: 3px 13px; border-radius: 15px; border: none; font-size: 11px;">${statusTexts[index]}</button>`;
	}

	function updateTicketDetails(ticketData, displayStatus) {
		$('#basic-details').css({ 'display': 'block' });
		$('#ticketImage').attr('src', `/uploads/ticket/${ticketData.image}`);
		$('#ticketNumber').text(ticketData.ticketNumber);
		$('#status').html(displayStatus);
		$('#creationDate').text(ticketData.creationDate);
		$('#subject').text(ticketData.subject);
		$('#reason').text(ticketData.reasonData.name);
	}

	function resetTicketDetails() {
		$('#basic-details').css({ 'display': 'none' });
		$('.ticketData').html(`N/A`);
	}

	$(document).on("click", "#send-message-btn", function () {
		sendMessage();
	});

	// Add an event listener for the enter key in the chat-input box
	$(document).on("keydown", "#chat-input", function (e) {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent newline character in the input
			sendMessage();
		}
	});
	// Add an event listener for form submission
	function sendMessage() {
		const userId = $("#chatinput-form").data("userid");
		const ticketId = $("#chatinput-form").data("ticketid");
		const message = $("#chat-input").val().trim();

		// Check if the message is not blank
		if (message) {
			// Make an AJAX request to send the message
			$.ajax({
				url: `${admin}/send-user-message`,
				type: 'POST',
				data: { userId, ticketId, message },
				success: function (response) {
					if (response.status === "SUCCESS") {
						// Clear the input field
						$("#chat-input").val('');

						// Update the chat with the new message
						const formattedTime = moment().format('hh:mm a');
						const html = `
					<li class="chat-list right">
					  <div class="conversation-list mb-0">
					  <div class="chat-avatar"><img src="/images/avatar23.png" alt="" /></div>
						<div class="user-chat-content">
						  <div class="ctext-wrap">
							<div class="ctext-wrap-content">
							  <p class="mb-0 ctext-content">${message}</p>
							</div>
						  </div>
						  <div class="conversation-name">
							<small class="text-muted time">${formattedTime}</small>
						  </div>
						</div>
					  </div>
					</li>
				  `;
						chat.append(html); // Append the new message to the chat
					} else {
						valid.snackbar_error(response.message);
					}
				},
				error: function (error) {
					console.error("Error sending message:", error);
				}
			});
		} else {
			valid.snackbar_error('Please enter a message before sending.');
		}
	}


	// Add this code inside your $(document).ready(function () { ... });
	$(document).on("click", "#closeTicket", function () {
		// Get vendorId and ticketId from the button's data attributes
		const userId = $(this).data("userid");
		const ticketId = $(this).data("ticketid");

		// Display confirmation modal using SweetAlert2
		Swal.fire({
			title: 'Are you sure?',
			text: 'You won\'t be able to revert this!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, close it!'
		}).then((result) => {
			if (result.isConfirmed) {
				// User clicked "Yes, close it!" button
				// Perform your AJAX request here with the retrieved vendorId and ticketId
				closeTicket(userId, ticketId);
			}
		});
	});

	// Function to perform the AJAX request to close the ticket
	function closeTicket(userId, ticketId) {
		// Perform your AJAX request
		$.ajax({
			url: `${admin}/close-user-ticket`,
			type: 'POST',
			data: { userId, ticketId },
			success: function (data) {
				if (data.status === "SUCCESS") {
					Swal.fire('Closed!', `${data.message}`, 'success');
					chatInput.html('')
				} else {
					Swal.fire('Error!', 'Failed to close the ticket.', 'error');
				}
			},
			error: function (error) {
				console.error("Error closing ticket:", error);
				Swal.fire('Error!', 'An error occurred while closing the ticket.', 'error');
			}
		});
	}


});
