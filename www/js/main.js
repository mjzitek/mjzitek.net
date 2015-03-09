$(function() {

    getBlogPosts();
    getFlickrPhotos();
});





function getBlogPosts() {

  $.ajax({
    type: 'GET',
    url: config.ghost_reader_url,
    async: false,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
      json.forEach(function(d) {
        console.log(d.title);

        $("#blog-posts").append(
          $("<div/>").addClass("col-content-item")
                     .html(d.title)
        )


      });
    },
    error: function(e) {
      console.log(e.message);
    }
  });

}


function getFlickrPhotos() {
  var imgMaxH = 160;
  var contentWidth = $(".col-content").width();
  var contentHeight = $("#photos").height();
  var numOfRows = Math.floor(contentHeight / (imgMaxH + 6));
  var rows = [];

  $.ajax({
    type: 'GET',
    url: config.flickr_feed_url,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
      var m, dim, x, i, j, row, totalWidth,
          photoArray = [];

      for(i = 0; i < 10; i++) {
        m = {};
        m.i = json.items[i].media.m;
        dim = getImgSize(json.items[i].description);

        x = dim.h / imgMaxH;
        dim.w = Math.round(dim.w / x);
        dim.h = imgMaxH;

        m.dim = dim;
        photoArray.push(m);
      }

      for(i = 0; i < numOfRows; i++) {
        rowWidth = contentWidth;

        rows.push([]);

        for(var x = 0; x < photoArray.length; x++) {
          if(rowWidth > 0 && (rowWidth - photoArray[x].dim.w) > 0) {
            rows[i].push(photoArray[x])

            rowWidth -= photoArray[x].dim.w;

            if (x > -1) {
              photoArray.splice(x, 1);
            }
          }
        }
      }

      for(i = 0; i < numOfRows; i++) {
        row = rows[i];
        totalWidth = 0;

        for(j = 0; j < row.length; j++) {
          totalWidth += row[j].dim.w;
        }

        row.totalWidth = totalWidth;
        row.sidePadding = Math.floor(((contentWidth - totalWidth) / row.length) / 2);

        for(var j = 0; j < row.length; j++) {
          ///////////
          $("#photos").append(
            $("<div/>").addClass("col-content-item").addClass("photos")
            .append(
              $("<img/>").attr("src", row[j].i)
              .css({"height": imgMaxH + "px", "padding" : "3px " + row.sidePadding + "px"})

            )
          )
          ////////////
        }

      }


    },
    error: function(e) {
      console.log(e.message);
    }
  });
}




function getImgSize(htmlStr) {
  var div,
  img,
  i,
  dim = {};
  div = document.createElement('div');
  div.innerHTML = htmlStr;
  img = div.getElementsByTagName('img');
  for (i = 0; i < img.length; i += 1) {
    dim.w = img[i].width;
    dim.h = img[i].height;
  }

  return dim;
}
