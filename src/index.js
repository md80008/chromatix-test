var http = require("http");
let fs = require("fs");
var xml2js = require('xml2js');

//create a server object:
http
  .createServer(async function(req, res) {
    let xml_data = fs.readFileSync(__dirname + "/../data.xml", "utf8");
    var parser = new xml2js.Parser();
    var results = new Object();
    xml_data = xml_data.replace(/forecast-period/g, 'forecastperiod');
    parser.parseString(xml_data, function (err, result) {
      var loop_var = result.product.forecast[0].area;
      for (var i=0; i < loop_var.length; i++) {
        var description = loop_var[i].$.description;
        if (loop_var[i].forecastperiod != null && loop_var[i].forecastperiod[3] != null) {
          if (loop_var[i].forecastperiod[3].text[0].$.type === 'forecast') {
            var forecast_text = loop_var[i].forecastperiod[3].text[0]._;
            results[description] = forecast_text;
          }
        }
      }
    });

    res.write(JSON.stringify(results));
    res.end();
  })
  .listen(8080); //the server object listens on port 8080
