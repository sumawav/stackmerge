/*global postMessage, onmessage:true */
/* Quicksort implementation from
* http://blog.mgechev.com/2012/11/24/javascript-sorting-performance-quicksort-v8/
*/
var allPixels = [];

function swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function partition(array, left, right) {
    var cmp = array[right - 1],
        minEnd = left,
        maxEnd;
    for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
        if (array[maxEnd] <= cmp) {
            swap(array, maxEnd, minEnd);
            minEnd += 1;
        }
    }
    swap(array, minEnd, right - 1);
    return minEnd;
}

function quickSort(array, left, right) {
    if (left < right) {
        var p = partition(array, left, right);
        quickSort(array, left, p);
        quickSort(array, p + 1, right);
    }
}

function mergeImages(numWorkers) {
    var combined = new Uint8Array(allPixels[0].length);
    var dataSize = combined.length;

    var floor = Math.floor; // Slight optimisation - avoids property lookup

    var b;

    var imageIndex;
    var numImages = allPixels.length;
    var stackPixels = new Uint8Array(numImages);
    var medianIndex = floor(numImages / 2);

    var onePercent = Math.round(dataSize / (100 / numWorkers));

    for (b = 0; b !== dataSize; b += 1) {
        if ((b + 1) % 4 === 0) {
            // Alpha channel is always 255
            combined[b] = 255;
        } else {
            for (imageIndex = 0; imageIndex !== numImages; imageIndex += 1) {
                stackPixels[imageIndex] = allPixels[imageIndex][b];
            }

            // In Chrome this custom quicksort is about 3 times faster than
            // stackPixels.sort()
            quickSort(stackPixels, 0, numImages);
            combined[b] = stackPixels[medianIndex];
        }

        if (b % onePercent === 0) {
            postMessage(null);
        }
    }

    allPixels = [];
    postMessage(combined.buffer, [combined.buffer]);
    close();
}

onmessage = function (message) {
    if (message.data.numWorkers) {
        mergeImages(message.data.numWorkers);
    } else if (message.data.byteLength) {
        allPixels.push(new Uint8Array(message.data));
    }
};
