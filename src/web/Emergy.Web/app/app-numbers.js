Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}