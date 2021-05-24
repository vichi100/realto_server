var ObjectId = require('mongodb').ObjectID;
x = ObjectId('60aaf7257327bc18ab1586a1') > ObjectId('60aaf7257327bc18ab1586a0');
y = ObjectId('60aaf7257327bc18ab1586a1') < ObjectId('60aaf7257327bc18ab1586a0');
console.log(ObjectId('60aaf7257327bc18ab1586a1'));
console.log(y);

arr = [ ObjectId('60aaf7257327bc18ab1586a1'), ObjectId('60aaf7257327bc18ab1586a0') ];

v = arr.sort((a, b) => {
	if (a > b) {
		return 1;
	} else if (b > a) {
		return -1;
	} else if (a === b) {
		return 0;
	}
});

console.log(v);
