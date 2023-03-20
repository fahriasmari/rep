percentageConvert = (number) => {
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    if (x1.length <= 1) {
        x1 = "0" + x1
    }

    return x1 + x2;
}

module.exports = { percentageConvert };