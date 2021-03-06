'use strict';

var inputField = document.querySelector('.chosen-value');
var dropdown = document.querySelector('.value-list');
var dropdownArray = [].concat(document.querySelectorAll('ul.value-list > li'));
var dropdownItems = dropdownArray[0];
//dropdown.classList.add('open');
//inputField.focus(); // Demo purposes only

var valueArray = [];
dropdownItems.forEach(function (item) {
  valueArray.push(item.textContent);
});

var closeDropdown = function closeDropdown() {
  dropdown.classList.remove('open');
};

inputField.addEventListener('input', function () {
  dropdown.classList.add('open');
  var inputValue = inputField.value.toLowerCase();
  var valueSubstring = undefined;
  if (inputValue.length > 0) {
    for (var j = 0; j < valueArray.length; j++) {
      if (!(new RegExp(inputValue).test(valueArray[j].toLowerCase()))/*(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())*/) {
        dropdownItems[j].classList.add('closed');
      } else {
        dropdownItems[j].classList.remove('closed');
      }
    }
  } else {
    for (var i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].classList.remove('closed');
    }
  }
});

dropdownItems.forEach(function (item) {
  item.addEventListener('click', function (evt) {
    //reset game
    resetGame();
    //set input field value to selected opening
    let currentString = item.textContent;
    inputField.value = currentString;
    //initialize selectedOpening variable with proper opening
    for (let i = 0; i < objs.length; i++) {
      //match first three characters with code of object to know which opening object was selected
      if (currentString.substring(0, 3) == objs[i].code) {
        selectedOpening = objs[i];
        break;
      }
    }
    dropdownItems.forEach(function (dropdown) {
      dropdown.classList.add('closed');
    });
  });
});

inputField.addEventListener('focus', function () {
  inputField.placeholder = 'Type to filter';
  dropdown.classList.add('open');
  dropdownItems.forEach(function (dropdown) {
    dropdown.classList.remove('closed');
  });
});

inputField.addEventListener('blur', function () {
  inputField.placeholder = 'Select Opening';
  dropdown.classList.remove('open');
});

document.addEventListener('click', function (evt) {
  
  var isDropdown = dropdown.contains(evt.target);
  var isInput = inputField.contains(evt.target);
  if (!isDropdown && !isInput) {
    dropdown.classList.remove('open');
  }
});
