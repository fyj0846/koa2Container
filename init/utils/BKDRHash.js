class BKDRHash {
  static hash(src) {
    var seed = 131; // 31 131 1313 13131 131313 etc..
    var hash = 0;

    if(typeof src != 'string') {
      return -1;
    }
    var srcArray = src.split('');
    srcArray.forEach(function (item) {
      hash = hash * seed + (item.charCodeAt(0));
    });
    return (hash & 0x7FFFFFFF);
  };
}

export default  BKDRHash;