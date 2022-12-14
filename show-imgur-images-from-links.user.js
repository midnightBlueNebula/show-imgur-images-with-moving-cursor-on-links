// ==UserScript==
// @name         Show Imgur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show images from imgur when cursor moves on imgur link.
// @author       midnightBlueNebula
// @match        https://*/*
// @icon         https://sunrust.org/wiki/images/f/fc/Imgur_icon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const linkExp = new RegExp(/^(http|https):\/\/(imgur|i.imgur).com\//);
    const img = document.createElement("img");

    document.body.insertBefore(img, document.body.firstElementChild);

    img.style.position = "absolute";
    img.style.zIndex = "1000";
    hideImgElement();
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.maxWidth = "200px";
    img.style.maxHeight = "200px";
    img.style.border = "2px inset black";


    function isLinkFromImgur(link){
        return linkExp.test(link);
    }


    function returnIfTargetIsNotLink(target){
        return target.tagName.toLowerCase() != "a";
    }


    function hideImgElement(){
        img.style.left = "0px";
        img.style.top = "-1000px";
        img.src = "";
    }


    function cursorOnLink(event){
        if(returnIfTargetIsNotLink(event.target)) { hideImgElement(); return }

        const link = event.target.href;
        if(isLinkFromImgur(link)){
            img.src = link;
            img.onload = function() {
                const coords = {x: event.pageX, y: event.pageY};
                if(coords.y - window.scrollY + img.getBoundingClientRect().height > window.innerHeight){
                    coords.y -= img.getBoundingClientRect().height;
                }
                if(coords.x + window.scrollX + img.getBoundingClientRect().width > window.innerWidth){
                    coords.x -= img.getBoundingClientRect().width;
                }
                img.style.left = coords.x + "px";
                img.style.top = coords.y + "px";
            }
        }
    }


    document.addEventListener("mouseover", cursorOnLink);
})();
