//Group object into list of classifiers
function groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

//Function translates value -1 to its label (because this does not come from ED's backend)
function _averageSubClass(i){if(i === -1){return('Keskiarvo')}else{return(i)}}
