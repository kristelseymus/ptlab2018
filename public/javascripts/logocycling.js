
$(document).ready(function(){
  var images = ["images/Logo_PTLab-01.jpg","images/Logo_PTLab-02.jpg","images/Logo_PTLab-03.jpg"];
  var i = 0;
  $img = $("#logo");
  setInterval(function () {
        i++;
        if (i >= images.length) {
            i = 0;
        }
        $img.fadeOut(function () {
            $img.attr('src', images[i]).fadeIn();
        })
    }, 6000)
});
