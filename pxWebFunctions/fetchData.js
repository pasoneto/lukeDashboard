//Basic URL. Shows all parameters that are available for the particular variable.
async function baseURL(url){
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function queryBodyMaker(r){
      var query = []
      var lObj = r.variables.length
      for (let i = 0; i < lObj; i++) {
        let opt = r.variables[i]
        var values = [];
        for(let x = 0; x < opt.values.length; x++){
            values.push(opt.values[x]) //Select values that exist in checked values
        }
        var objQuery = {code: opt.code, selection: {filter: "item", values: values} }
        query.push(objQuery);
      }
      var rawBody = query;
      var query = {query: query, response: {"format": "json"}}
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(query)
      };
      return options
}

//Gets all data associated with url
async function getAllData(url, base){
  var [rawBody, queryPOST] = await queryMaker(url);
  var data = await fetch(url, queryPOST);
  var data = await data.json();
  var objData = await restructureData(base, data)
  return objData
}

//Structures json into more readable format.
//Data is the raw response, base are the parameters associated with each API call.
function restructureData(base, data){
  var objData = {}
  for(i in data.data){
    var json = { };
    for(k in data.data[i].key){
      var key = base.variables[k].code;
      json[key] = data.data[i].key[k];
      json["value"] = data.data[i].values[0];
    }
    objData[i] = json;
  } 
  return objData
}
