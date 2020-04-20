"use strict";

    const filesLimit = 3;
    const maxWidthUpload = 250;
    const maxHeightUpload = 150;
    const maxWidthPreview = 100;
    const maxHeightPreview = 50;
    const fileNamePrefix = 'file_';
    const canvasIdPrefix = 'canvas_';

    let files = {};
    let form = document.querySelector('form[id="form"]');
    let result = document.querySelector('#result');

    let myconsole = document.querySelector('#console');

    form.addEventListener('change', function (e) {
        if (!e.target.matches('input[type="file"]')) {
            return;
        }

        let inputFile = e.target;
        let id = inputFile.id.replace(fileNamePrefix, '');
        let isNew = (files[id] === undefined);
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            alert('Your browser is not support upload files.');
            return;
        }
        	displayLog('<b>---- get NEW image ----</b>');
        // set blob resized image into stack
        setResizedImage(inputFile.files[0], id);
	        displayLog('resize done');
        //add new input into form
        if (Object.keys(files).length < filesLimit && isNew) {
        	displayLog('insert new input');
            let fileInput = document.createElement("input");
            fileInput.id = fileNamePrefix + (+id + 1);
            fileInput.type = 'file';
            inputFile.after(fileInput);
        }

    });

    /**
     * Sending form data to backend
     * @param e
     * @returns {Promise<void>}
     */
    form.onsubmit = async (e) => {
        e.preventDefault();
        let FD = new FormData(form);
        let i = 1;
        for (let key in files) {
            FD.append(fileNamePrefix + i, files[key]);
            i += 1;
        }

        try{
        	let response = await fetch('/url_to_upload_script.php', {
	            method: 'POST',
	            body: FD
	        });

	        let answer = await response;
	        
	        if(response.data){
	        	result.innerHTML = JSON.stringify(answer.json());
	        }else{
	        	displayLog('Request was sended, bun we have empty answer');
       		}
        }catch (err) {
			displayLog('FormData completed but cat be send to <b>url_to_upload_script.php</b>');
		}
   
    };

    /**
     * Set new sizes images into blob stack and preview dom
     * @param file
     * @param id
     * @returns {boolean}
     */
    function setResizedImage(file, id) {

        if (!(/image/i).test(file.type)) {
            alert("File " + file.name + " is not an image.");
            return false;
        }
        const reader = new FileReader();
        
        displayLog('new reader');
        
        reader.onload = function () {
            const img = new Image();
            displayLog('new Image');
            img.onload = function () {
                setBlobSize(img, id);
                setPreview(img, id);
            };
            img.src = reader.result;

        };
        reader.readAsDataURL(file);
    }

    /**
     * Get size for upload to backend
     * @param img
     * @param id
     */
    function setBlobSize(img, id) {
        displayLog('setBlobSize');
        const canvas = document.createElement('canvas');
        
        displayLog('set canvas');
        
        let sizes = calculateSizes(img, maxWidthUpload, maxHeightUpload);
        
        displayLog(JSON.stringify(sizes));
        
        canvas.width = sizes.widthNew;
        canvas.height = sizes.heightNew;
        canvas.id = canvasIdPrefix + id;
                
        const context = canvas.getContext('2d');
                
        context.drawImage(img, 0, 0, sizes.widthOld, sizes.heightOld);
        
        displayLog('drawImage');
        
        canvas.toBlob(function (blob) {
            displayLog('insert to Blob');
            files[id] = blob;
        
            displayLog('files count: '+ Object.keys(files).length);
        });
    }

    /**
     * Set preview
     * @param img
     * @param id
     */
    function setPreview(img, id) {
        	displayLog('setPreview');
        const canvas = document.createElement('canvas');

        let sizes = calculateSizes(img, maxWidthPreview, maxHeightPreview);
        canvas.width = sizes.widthNew;
        canvas.height = sizes.heightNew;
        canvas.id = canvasIdPrefix + id;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, sizes.widthOld, sizes.heightOld);

        let isNew = true;
        let preview = document.querySelector('#preview');
        if (preview.childNodes.length > 0) {
            for (let i = 0; i < preview.childNodes.length; i++) {
                if (preview.childNodes[i].id === canvasIdPrefix + id) {
                    preview.childNodes[i].replaceWith(canvas);
                    isNew = false;
                }
            }
        }

        if (isNew) {
            preview.appendChild(canvas);
        }
    }

    /**
     *  Calculating sizes for images
     * @param img
     * @param maxWidth
     * @param maxHeight
     * @returns obj width: number, height: number
     */
    function calculateSizes(img, maxWidth, maxHeight) {
	        displayLog('calculateSizes');

        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                //height *= maxWidth / width;
                height = Math.round(height *= maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width *= maxHeight / height);
                height = maxHeight;
            }
        }
        return {
            widthOld:width,
            heightOld:height,
            widthNew: width,
            heightNew: height
        };
    }

    /**
     * MyLog for mobile debug and display process
     * */
    function displayLog(data) {
        const p = document.createElement('p');
        p.innerHTML = data;
        myconsole.append(p)
    }