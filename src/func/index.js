function getData(name) {
    let nowDtl = window.localStorage.getItem(name);
    if (!nowDtl) return null;
    nowDtl = JSON.parse(nowDtl);
    return nowDtl;
}

function setData(name, obj) {
    const dtl = JSON.stringify(obj);
    window.localStorage.setItem(name, dtl);
}

// file转base64
const blobToBase64 = (raw, callback) => {
    var reader = new FileReader()
    reader.onload = () => {
        // console.log(reader.result.length)
        dealImage(reader.result, 500, callback);
    }
    reader.readAsDataURL(raw)
    reader.onerror = function (error) {
        console.log('Error: ', error)
    }
}
// 压缩base64方法
function dealImage(base64, w, callback) {
    var newImage = new Image();
    var quality = 0.6;    //压缩系数0-1之间
    newImage.src = base64;
    newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
    var imgWidth, imgHeight;
    newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (Math.max(imgWidth, imgHeight) > w) {
            if (imgWidth > imgHeight) {
                canvas.width = w;
                canvas.height = w * imgHeight / imgWidth;
            } else {
                canvas.height = w;
                canvas.width = w * imgWidth / imgHeight;
            }
        } else {
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            quality = 0.6;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
        // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        while (base64.length / 1024 > 150) {
            quality -= 0.01;
            base64 = canvas.toDataURL("image/jpeg", quality);
        }
        // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        while (base64.length / 1024 < 50) {
            quality += 0.001;
            base64 = canvas.toDataURL("image/jpeg", quality);
        }
        callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
    }
}

// 下载音乐
const downLoad = (name, url) => {
    fetch(url).then((res) =>
        res.blob().then((blob) => {
            let a = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        })
    ).catch(err => {
        alert(err + '，资源错误~');
    });
}
export {
    blobToBase64 as base,
    getData,
    setData,
    downLoad
}
