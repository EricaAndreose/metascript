function carousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".mySlides");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);
  let slideIndex = 0;
  const slideWidth = slides[0].clientWidth; // Get the width of a single slide

  function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
  }

  function nextSlide() {
    slideIndex++;
    if (slideIndex >= slides.length) {
      slideIndex = 0; // Wrap around to the first slide
    }
    updateCarousel();
  }

  function prevSlide() {
    slideIndex--;
    if (slideIndex < 0) {
      slideIndex = slides.length - 1; // Wrap around to the last slide
    }
    updateCarousel();
  }
}

function plusDivs(n) {
  showDivs((slideIndex += n));
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (i = 0; i < x.length; i++) {
    x[i].style.transition = "left 0.5s"; // Add a transition
    x[i].style.left = "100%"; // Slide all slides to the right
  }
  x[slideIndex - 1].style.left = "0";
}

function parallax() {
  var image = document.querySelector(".parallax");
  var zoomFactor = parseFloat(image.getAttribute("data-zoom"));
  var scrollFactor = 0.001;

  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY || window.pageYOffset;
    var zoomedScale = 1 + scrollY * scrollFactor * zoomFactor;

    // Limit the zoom effect
    if (zoomedScale > 1 + zoomFactor) {
      zoomedScale = 1 + zoomFactor;
    }

    image.style.transform = `scale(${zoomedScale})`;
  });
}

function sceneSelector() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "./src/Arthur Schnitzler - Dream Story (2003, Green Integer).xml",
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var xmlDoc = xhr.responseXML;
      var sceneElements = xmlDoc.querySelectorAll(
        "div[type='scene']:not([n='none'])"
      );
      sceneElements.forEach(function (sceneElement) {
        var option = document.createElement("option");
        option.text = sceneElement.getAttribute("n");
        option.value = sceneElement.getAttribute("n");
        $("#scene-selector").append(option);
      });
      getSelectedScene();
    }
  };
  xhr.send();
}

function fetchTextContent(selectedSceneNumber) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "./src/Arthur Schnitzler - Dream Story (2003, Green Integer).xml",
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var xmlDoc = xhr.responseXML;
      var scene = xmlDoc.querySelector(
        `div[type='scene'][n='${selectedSceneNumber}']`
      );
      $("#left-text").empty().append(scene);
    }
  };
  xhr.send();
}

function fetchScreencaps(scenes) {
  var imageContainer = document.getElementById("image-container");
  sceneNumbers = scenes.split(",").map(function (scene) {
    return scene.trim();
  });
  $("#image-container").empty();
  $.getJSON(
    "./img/screencaps/folder_structure.json",
    function (folderStructure) {
      sceneNumbers.forEach(function (sceneNumber) {
        folder_name = "SCENE" + sceneNumber;
        if (folderStructure.hasOwnProperty(folder_name)) {
          file_list = folderStructure[folder_name];
          file_list.forEach(function (filename) {
            image_name =
              "./img/screencaps/SCENE" + sceneNumber + "/" + filename;
            var img = document.createElement("img");
            img.className = "screencap";
            img.src = image_name;
            imageContainer.appendChild(img);
          });
        }
      });
    }
  );
}

function getSelectedScene() {
  var selectedSceneNumber = $("#scene-selector").val();
  fetchTextContent(selectedSceneNumber);
  $("#scene-selector").change(function () {
    selectedSceneNumber = $(this).val();
    fetchTextContent(selectedSceneNumber);
    fetchScreencaps(selectedSceneNumber);
  });
}

$(document).ready(function () {
  parallax();
  carousel();
  fetchScreencaps("4");
  sceneSelector();
  showDivs(slideIndex);
});
