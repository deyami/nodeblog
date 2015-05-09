function showQrcode(qrurl){
    $('#bsWXBox').css('display','block');
    $("#bsImg").attr("src",qrurl);
}

function qrcodeClose(qrurl){
    $('#bsWXBox').css('display','none');
    $("#bsImg").attr("src","");
}
