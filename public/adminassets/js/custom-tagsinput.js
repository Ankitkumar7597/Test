function Tags(element) {
	var arrayOfList;
	var DOMParent = element;
	var DOMList;
	var DOMInput;
	var dataAttribute;
	function DOMCreate() {
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'tagUl')
		var li = document.createElement('li');
		var input = document.createElement('input');
		input.setAttribute("placeholder", "Enter Tags");
		input.setAttribute("id", "tagInput");

		DOMParent.appendChild(ul);
		DOMParent.appendChild(input); // first child is <ul>

		DOMList = DOMParent.firstElementChild; // last child is <input>

		DOMInput = DOMParent.lastElementChild;
	}
	function DOMRender() {
		// clear the entire <li> inside <ul> 
		DOMList.innerHTML = ''; // render each <li> to <ul>
		arrayOfList.forEach(function (currentValue, index) {
			var li = document.createElement('li');
			if (currentValue != "") {
				document.getElementById("tagInput").removeAttribute("placeholder");
				li.innerHTML = "".concat(currentValue, "<a>&times;</a>");
				li.querySelector('a').addEventListener('click', function () {
					onDelete(index);
					return false;
				});
				DOMList.appendChild(li);
			}
		});
		setAttribute();
	}
	function onKeyUp() {
		DOMInput.addEventListener('keyup', function (event) {
			console.log("arrayOfList", arrayOfList);
			var text = this.value.trim(); // check if ',' or 'enter' key was press
			if (text != "") {
				if (text.includes(',') || event.keyCode == 13) {
					// check if empty text when ',' is remove
					if (text.replace(',', '') != '') {
						// push to array and remove ','
						arrayOfList.push(text.replace(',', ''));
					} // clear input
					this.value = '';
				}
				DOMRender();
			}
		});
	}
	function onDelete(id) {
		arrayOfList = arrayOfList.filter(function (currentValue, index) {
			if (index == id) {
				return false;
			}
			return currentValue;
		});
		DOMRender();
	}
	function getAttribute() {
		dataAttribute = DOMParent.getAttribute('data-simple-tags');
		dataAttribute = dataAttribute.split(','); // store array of data attribute in arrayOfList

		arrayOfList = dataAttribute.map(function (currentValue) {
			return currentValue.trim();
		});
	}
	function setAttribute() {
		if (arrayOfList[0] == '') {
			arrayOfList.shift()
		}
		DOMParent.setAttribute('data-simple-tags', arrayOfList.toString());
		$("#tags").val(arrayOfList.toString())
	}
	getAttribute();
	DOMCreate();
	DOMRender();
	onKeyUp();
}
(function () {
	var DOMSimpleTags = document.querySelectorAll('.simple-tags');
	DOMSimpleTags = Array.from(DOMSimpleTags);
	DOMSimpleTags.forEach(function (currentValue, index) {
		new Tags(currentValue);
	});
})();
/* 

var el = document.getElementById('container');
new Tags(el); */