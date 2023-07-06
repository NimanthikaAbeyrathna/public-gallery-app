const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

loadAllImages();

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (evt) => {
    if (evt.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keydown', (evt) => {
    if (evt.key === 'Escape' && !overlay.hasClass('d-none')) {
        overlay.addClass('d-none');
    }
});
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
dropZoneElm.on('dragover', (evt) => {
    evt.preventDefault();
});
dropZoneElm.on('drop', (evt) => {
    evt.preventDefault();
    const droppedFiles = evt.originalEvent
        .dataTransfer.files;
    const imageFiles = Array.from(droppedFiles)
        .filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});
// mainElm.on('click', '.image:not(.loader)', (evt)=> {
//     evt.target.requestFullscreen();
// });

function uploadImages(imageFiles) {
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="image loader"></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false,         // by default jQuery uses application/x-www-form-urlencoded
        processData: false          // by default jQuery tries to convert the data into String
    });

    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `url('${imageUrl}')`);
            const aElm = $(`<a href="${imageUrl}" download ><svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></a>`)
            divElm.append(aElm);
            divElm.removeClass('loader');
        });
    });
    jqxhr.always(() => $(".image.loader").remove());
}

function loadAllImages() {
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(`<div class="image"></div>`);
            const aElm = $(`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></a>`)
            divElm.append(aElm);
            divElm.css('background-image', `url('${imageUrl}')`);
            mainElm.append(divElm);
        });
    });
    jqxhr.always(() => {
    });
}

mainElm.on('click', '.image>svg', (event) => {
    const imageUrl = $(event.target).closest('.image').css('background-image');
    const url = imageUrl.slice(4, -1).replace(/"/g, "");
    downloadImage(url);
});

function downloadImage(imageUrl) {

    const jqxhr = $.ajax({
        url: imageUrl,
        xhrFields: {
            responseType: 'blob'
        }
    });

    jqxhr.done((blob) => {

        let blobUrl = URL.createObjectURL(blob);//get the url of blob
        console.log(blobUrl);
        let anchorElm = document.createElement('a');//create anchor tag
        anchorElm.href = blobUrl;//set attribute href
        anchorElm.download = 'image.jpg';//set the attribute download

        anchorElm.click();//using code click anchor element

        URL.revokeObjectURL(anchorElm.href);//clear the url
    });

    jqxhr.fail(error => console.error('Error:', error));

}





