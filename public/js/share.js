function showQrcode(qrurl){
    $('#bsWXBox').css('display','block');
    jQuery('#bsImg').empty();
    jQuery('#bsImg').qrcode({
        width: 178,
        height: 178,
        text    : qrurl     //根据此串生成第二个二维码
    });
}

function qrcodeClose(qrurl){
    jQuery('#bsImg').empty();
    $('#bsWXBox').css('display','none');
}
