/**
 * Validation methods for the User's Password
 * 
 * @author rohan_bharti
 */

exports.isLongEnough = function (input) {
    if (input.length >= 6) {
        return true;
    }
    return false;
};

exports.isGoodPassword = function (input) {
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return regex.test(input);
};

exports.isSafe = function (input) {
    var regex = /([$])/;
    return !regex.test(input);
};
