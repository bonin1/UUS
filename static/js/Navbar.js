/* navbar */

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");
const whiteLogo = '/static/image/logo2.0white.png';
const blackLogo = '/static/image/logo2.0black.png';

hamburger.addEventListener("click", function() {
    mobileMenu();
    toggleBars();
});

navLink.forEach(n => n.addEventListener("click", closeMenu));

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

function toggleBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.toggle('active'));
}


const imageElement = document.getElementById('logo');
let isImageChanged = false;
hamburger.addEventListener('click', () => {
    imageElement.classList.add('fade');
    imageElement.addEventListener('transitionend', function() {
        imageElement.src = isImageChanged ? blackLogo : whiteLogo;
        imageElement.onload = function() {
            imageElement.classList.remove('fade');
        }
    }, { once: true });
    isImageChanged = !isImageChanged;
});



/*------------------------*/

function checkViewport() {
    const hoverInside = document.querySelector('.hover-inside');
    const divs = ['div-1', 'div-2', 'div-3','div-4','div-5','div-6'];
    const isOverDiv = [false, false, false, false, false, false];
    const divElements = divs.map(div => document.querySelector('.' + div));
    for (let i = 0; i < divs.length; i++) {
        let div = divElements[i];
        hoverInside.addEventListener('mouseover', function(event) {
            if (window.innerWidth < 768) return; // Add this line
            if (event.target.classList.contains('hover-text-' + (i+1))) {
                for (let j = 0; j < divs.length; j++) {
                    if (j !== i) {
                        let otherDiv = divElements[j];
                        otherDiv.style.opacity = '0';
                        otherDiv.style.visibility = 'hidden';
                        isOverDiv[j] = false;
                    }
                }
                div.style.opacity = '1';
                div.style.visibility = 'visible';
                isOverDiv[i] = true;
            }
        });
        div.addEventListener('mouseover', function() {
            if (window.innerWidth < 768) return;
            isOverDiv[i] = true;
        });
        div.addEventListener('mouseout', function() {
            if (window.innerWidth < 768) return;
            isOverDiv[i] = false;
            setTimeout(function() {
                if (!isOverDiv[i]) {
                    div.style.opacity = '0';
                    div.style.visibility = 'hidden';
                }
            }, 200);
        });
    }
}
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
checkViewport();
window.onresize = debounce(checkViewport, 250);


const allContentDivs = document.querySelectorAll('.content');
const hoverTextElements = document.querySelectorAll('.hover-text');

hoverTextElements.forEach((item, i) => {
    item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            const content = document.querySelector('.div-' + (i + 1));
            allContentDivs.forEach((div) => {
                if (div !== content) {
                    div.style.display = 'none';
                }
            });
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        }
    });
});