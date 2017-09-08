export default function copyText (text,ele) {
  var element = document.createElement('textarea');
  var parent = ele || document.body;
  element.value = text;
  parent.appendChild(element);
  if(element.createTextRange){
	  //兼容ie下的处理
	  var range = element.createTextRange();
	  range.moveStart("character", 0);
	  range.moveEnd("character",element.value.length);
	  range.select();
  }else{
	  element.setSelectionRange(0, element.value.length);
	  element.focus();
  }
  document.execCommand('copy');
  element.blur();
  parent.removeChild(element);
  return true;
}
