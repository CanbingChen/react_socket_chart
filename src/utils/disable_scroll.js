export const preventDefault =(e)=>{
	e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

const preventDefaultForScrollKeys = (e) => {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
export const disableScroll = () =>{

  window.onwheel = preventDefault; // modern standard
  window.ontouchmove  = preventDefault; // mobile
}
export const enableScroll = () => {
    window.onwheel = null;
    window.ontouchmove = null;
}
