var express = require('express');
var morgan = require('morgan');
// var calculation = require('./calculation');
var https = require('https');

var stockTransactionsFile = require("./stockTransactionsFile.js");

var hostname = 'localhost';
var port = 3000;

var USDtoEUR = 0.934710473;
// var stockArray = ['Lyxor UCITS ETF BEL 20 TR', 'Aedifica', 'Lyxor Nasdaq 100 UCITS ETF', 'Coca-Cola', 'Zalando SE', 'Unilever', 'Facebook', 'Tesla'];
var stockArray = [];
//var scrapeResponse = [{"name":"Lyxor UCITS ETF BEL 20 TR","percentage":"0,60%","price":"57,09","history":[{"timespan":"1 januari","percent":"5,39%","high":"57,250","low":"53,950"},{"timespan":"1 week","percent":"1,76%","high":"57,250","low":"55,550"},{"timespan":"1 maand","percent":"4,25%","high":"57,250","low":"54,120"},{"timespan":"3 maanden","percent":"5,72%","high":"57,250","low":"53,700"},{"timespan":"6 maanden","percent":"5,14%","high":"57,250","low":"51,270"},{"timespan":"1 jaar","percent":"12,32%","high":"57,250","low":"47,020"}]},{"name":"Aedifica","percentage":"0,17%","price":"71,62","history":[{"timespan":"1 januari","percent":"0,76%","high":"73,790","low":"70,000"},{"timespan":"1 week","percent":"-0,43%","high":"72,000","low":"71,050"},{"timespan":"1 maand","percent":"0,66%","high":"72,690","low":"70,130"},{"timespan":"3 maanden","percent":"6,43%","high":"73,790","low":"66,200"},{"timespan":"6 maanden","percent":"-1,88%","high":"78,800","low":"66,000"},{"timespan":"1 jaar","percent":"17,95%","high":"78,800","low":"60,000"}]},{"name":"Lyxor Nasdaq 100 UCITS ETF","percentage":"-0,39%","price":"19,92","history":[{"timespan":"1 januari","percent":"9,28%","high":"20,240","low":"18,107"},{"timespan":"1 week","percent":"-0,52%","high":"20,087","low":"19,851"},{"timespan":"1 maand","percent":"3,05%","high":"20,240","low":"19,311"},{"timespan":"3 maanden","percent":"9,18%","high":"20,240","low":"17,999"},{"timespan":"6 maanden","percent":"19,83%","high":"20,240","low":"16,227"},{"timespan":"1 jaar","percent":"29,31%","high":"20,240","low":"14,826"}]},{"name":"Unilever","percentage":"0,87%","price":"46,05","history":[{"timespan":"1 januari","percent":"17,91%","high":"46,045","low":"37,330"},{"timespan":"1 week","percent":"3,88%","high":"46,045","low":"44,030"},{"timespan":"1 maand","percent":"18,87%","high":"46,045","low":"38,525"},{"timespan":"3 maanden","percent":"21,80%","high":"46,045","low":"37,330"},{"timespan":"6 maanden","percent":"12,21%","high":"46,045","low":"36,265"},{"timespan":"1 jaar","percent":"16,23%","high":"46,045","low":"36,265"}]},{"name":"Zalando SE","percentage":"2,74%","price":"36,78","history":[{"timespan":"1 januari","percent":"1,35%","high":"40,380","low":"34,920"},{"timespan":"1 week","percent":"2,78%","high":"37,160","low":"35,430"},{"timespan":"1 maand","percent":"-2,27%","high":"38,450","low":"35,430"},{"timespan":"3 maanden","percent":"4,97%","high":"40,380","low":"34,715"},{"timespan":"6 maanden","percent":"3,04%","high":"41,115","low":"33,545"},{"timespan":"1 jaar","percent":"25,49%","high":"41,115","low":"22,805"}]},{"name":"Coca-Cola","percentage":"0,62%","price":"42,29","history":[{"timespan":"1 januari","percent":"2,00%","high":"42,560","low":"40,220"},{"timespan":"1 week","percent":"-0,45%","high":"42,490","low":"41,740"},{"timespan":"1 maand","percent":"4,21%","high":"42,560","low":"40,220"},{"timespan":"3 maanden","percent":"0,69%","high":"42,560","low":"40,220"},{"timespan":"6 maanden","percent":"0,05%","high":"43,430","low":"39,880"},{"timespan":"1 jaar","percent":"-6,44%","high":"47,130","low":"39,880"}]},{"name":"Facebook","percentage":"0,40%","price":"138,79","history":[{"timespan":"1 januari","percent":"20,54%","high":"139,490","low":"114,774"},{"timespan":"1 week","percent":"1,18%","high":"139,490","low":"136,080"},{"timespan":"1 maand","percent":"3,43%","high":"139,490","low":"132,550"},{"timespan":"3 maanden","percent":"15,97%","high":"139,490","low":"114,774"},{"timespan":"6 maanden","percent":"9,20%","high":"139,490","low":"113,554"},{"timespan":"1 jaar","percent":"26,85%","high":"139,490","low":"106,310"}]},{"name":"Tesla","percentage":"-0,49%","price":"243,69","history":[{"timespan":"1 januari","percent":"14,02%","high":"287,390","low":"210,960"},{"timespan":"1 week","percent":"-3,13%","high":"253,890","low":"243,000"},{"timespan":"1 maand","percent":"-9,49%","high":"287,390","low":"242,010"},{"timespan":"3 maanden","percent":"26,80%","high":"287,390","low":"190,810"},{"timespan":"6 maanden","percent":"25,31%","high":"287,390","low":"178,190"},{"timespan":"1 jaar","percent":"17,44%","high":"287,390","low":"178,190"}]}];
var scrapeResponse = [];
var statusDateRetrieval = "notFetched";


var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.listen(port, hostname, function(){
	console.log('Server running at http://' + hostname + ':' + port);
});

app.get('/stockArray', function(req, res, next){
    res.send(stockArray);
});

app.get('/stockShortName/:stockName', function(req, res, next){
	var shortName = getStockShortName(req.params.stockName);
	res.send(shortName);
});

app.get('/dayStockPercentage/:stockName', function(req, res, next){
	res.send(getDayStockPercentage(req.params.stockName));
});

app.get('/dayStockPrice/:stockName', function(req, res, next){
	res.send(getDayStockPrice(req.params.stockName));
	
});

app.get('/yearStockPercentage/:stockName', function(req, res, next){
	res.send(getYearStockPercentage(req.params.stockName));
});

app.get('/monthStockPercentage/:stockName', function(req, res, next){
	res.send(getMonthStockPercentage(req.params.stockName));
});

app.get('/stockValue/:stockName', function(req, res, next){
	var result = getIndividualStockValue(req.params.stockName).toString().substring(0,7);
	res.send(result);
});

app.get('/totalStockValueEURConverted', function(req, res, next){
	res.send(getTotalStockValue().stockValueEURConverted.toString().substring(0,8));
});

app.get('/stockReturn/:stockName', function(req, res, next){
	var initialResult = getIndividualStockReturn(req.params.stockName);
	var returnAbsNew = initialResult.returnAbs.toString().substring(0,7);
	var returnPercNew = initialResult.returnPerc.toString().substring(0,4);
	var result = {returnAbs: returnAbsNew, returnPerc: returnPercNew};
	res.send(result);	
});

app.get('/totalStockValueReturn', function(req, res, next){
	res.send(getTotalStockValueReturn());
});

app.get('/trafficLights/', function(req, res, next){
	res.send(calculatelights());
	
});

function getDayStockPercentage(stockName){
	var stockPercentageOrig = scrapeResponse
		.find(function(arrayElement){
			return arrayElement.name === stockName;
		})
		.percentage.replace(/,/g, '.');
	var stockPercentage;
	if (stockPercentageOrig.includes("-")){
		stockPercentage = stockPercentageOrig.substring(0,5);
	}else{
		stockPercentage = stockPercentageOrig.substring(0,4);
	}
	return stockPercentage;	
};

function getDayStockPrice(stockName){
	var stockPriceOrig = scrapeResponse
		.find(function(arrayElement){
			return arrayElement.name === stockName;
		})
		.price.replace(/,/g, '.');
	var stockPrice;
	if (stockPriceOrig.includes("-")){
		stockPrice = stockPriceOrig.substring(0,5);
	}else{
		stockPrice = stockPriceOrig.substring(0,4);
	}
	return stockPrice;	
};

function getMonthStockPercentage(stockName){
	//console.log("GMP",currentStockInfo);
	var historyStr = "history";
	var monthPercentageOrig = scrapeResponse
		.find(function(arrayElement){
			return arrayElement.name === stockName;
		})
		[historyStr]
		.find(function(arrayElement){
			return arrayElement.timespan === "1 maand";
		})
		.percent.replace(/,/g, '.');
	var monthPercentage = "";
	if (monthPercentageOrig.includes("-")){
		monthPercentage = monthPercentageOrig.substring(0,5);
	}else{
		monthPercentage = monthPercentageOrig.substring(0,4);
	}
	return monthPercentage;
}

function getYearStockPercentage(stockName){
	var historyStr = "history";
	var yearPercentageOrig = scrapeResponse
		.find(function(arrayElement){
			return arrayElement.name === stockName;
		})
		[historyStr]
		.find(function(arrayElement){
			return arrayElement.timespan === "1 jaar";
		})
		.percent.replace(/,/g, '.');
	var yearPercentage = "";
	if (yearPercentageOrig.includes("-")){
		yearPercentage = yearPercentageOrig.substring(0,5);
	}else{
		yearPercentage = yearPercentageOrig.substring(0,4);
	}
	return yearPercentage;
}

function getIndividualStockValue(stockName){
	var currentStockPrice = scrapeResponse.find(function(arrayElement){
		return arrayElement.name === stockName;
	}).price.replace(/,/g, '.');
	var currentStockNumber = stockTransactionsFile.getCurrentStockNumber(stockName);
	stockValue = currentStockPrice * currentStockNumber;
	// console.log("Returning: " + stockValue);
	return stockValue;
}

function getIndividualStockReturn(stockName){
	var currentStockValue = getIndividualStockValue(stockName);
	var averageStartValue = stockTransactionsFile.getAverageStockStartValue(stockName);
	var currentStockNumber = stockTransactionsFile.getCurrentStockNumber(stockName);
	var historicalStockValue = averageStartValue * currentStockNumber;
	var stockValueReturnAbs = currentStockValue - historicalStockValue;
	var stockValueReturnPerc = (stockValueReturnAbs/historicalStockValue)*100;
	return {returnAbs: stockValueReturnAbs, returnPerc: stockValueReturnPerc};
};

function getTotalStockValue(){
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	var totalValueUSD = 0;
	var totalValueEUR = 0;
	stockList.forEach(function(element){
		var individualStockValue = getIndividualStockValue(element.name);
		var currency = stockTransactionsFile.getStockCurrency(element.name);
		if(currency === "USD"){
			totalValueUSD += individualStockValue;
		} else{
			totalValueEUR += individualStockValue;
		}
	});
	totalValueEURConverted = totalValueEUR + totalValueUSD*USDtoEUR;
	return {stockValueEUR: totalValueEUR, stockValueUSD: totalValueUSD, stockValueEURConverted: totalValueEURConverted};
}

function getTotalStockValueReturn(){
	var stockReturn = getTotalStockValue()
	var totalStockValueEUR = stockReturn.stockValueEUR;
	var totalStockValueUSD = stockReturn.stockValueUSD;
	var totalStockValueConverted = stockReturn.stockValueEURConverted;
	
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	var totalHistoricalStockValueEUR = 0;
	var totalHistoricalStockValueUSD = 0;
	stockList.forEach(function(element){
		var historicalStockValue = stockTransactionsFile.getAverageStockStartValue(element.name) * stockTransactionsFile.getCurrentStockNumber(element.name);
		if(stockTransactionsFile.getStockCurrency(element.name) === "USD"){
			totalHistoricalStockValueUSD += historicalStockValue;
		} else{
			totalHistoricalStockValueEUR += historicalStockValue;
		}
	});
	var stockValueReturnAbsEUR = totalStockValueEUR - totalHistoricalStockValueEUR;
	var stockValueReturnAbsUSD = totalStockValueUSD - totalHistoricalStockValueUSD;
	var stockValueReturnAbsConv = stockValueReturnAbsEUR + stockValueReturnAbsUSD*USDtoEUR;
	var stockValueReturnPercEUR = (stockValueReturnAbsEUR / totalHistoricalStockValueEUR)*100;
	var stockValueReturnPercUSD = (stockValueReturnAbsUSD / totalHistoricalStockValueUSD)*100;
	var totalHistoricalValueConv = totalHistoricalStockValueEUR + totalHistoricalStockValueUSD*USDtoEUR;
	var stockValueReturnPercConv = (stockValueReturnAbsConv / totalHistoricalValueConv)*100;
	return {
		returnAbsEUR: stockValueReturnAbsEUR,
		returnAbsUSD: stockValueReturnAbsUSD,
		returnAbsConv: stockValueReturnAbsConv.toFixed(2),
		returnPercEUR: stockValueReturnPercEUR,
		returnPercUSD: stockValueReturnPercUSD,
		returnPercConv: stockValueReturnPercConv.toFixed(2)
	};
}

function calculatelights(){
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	var dayPercentageScore = 0;
	var monthPercentageScore = 0;
	var yearPercentageScore = 0
	stockList.forEach(function(element){
		var currency = stockTransactionsFile.getStockCurrency(element.name);
		var individualStockValue = getIndividualStockValue(element.name);
		if(currency === "USD"){
			individualStockValue = individualStockValue * USDtoEUR;
		}		
		dayPercentageScore += (getDayStockPercentage(element.name)*individualStockValue);
		monthPercentageScore += (getMonthStockPercentage(element.name)*individualStockValue);
		yearPercentageScore += (getYearStockPercentage(element.name)*individualStockValue);
	});
	var totalStockValue = getTotalStockValue(scrapeResponse).stockValueEURConverted;
	var dayPercentage = dayPercentageScore / totalStockValue;
	var monthPercentage = monthPercentageScore / totalStockValue;
	var yearPercentage = yearPercentageScore / totalStockValue;
	//console.log("Day percentage: " + dayPercentage.toFixed(2) + ", Month percentage: " + monthPercentage.toFixed(2) + " , Year Percentage: " + yearPercentage.toFixed(2));
	return {
		day: dayPercentage.toFixed(2),
		month: monthPercentage.toFixed(2),
		year: yearPercentage.toFixed(2)
	};
}

function getStockShortName(stockName){
	var searchResult = stockTransactionsFile.getStockPropertiesArray().find(function(arrayElement){
		var check = (arrayElement.name === stockName && typeof arrayElement.shortName !== 'undefined');
		return check;
	});
	var result='';
	console.log(stockName + ": " + searchResult);
	if (typeof searchResult === 'undefined'){
		result = "notAvailable";
	}else{
		result = searchResult.shortName;
	};
	return result;
};

function getStockData(numberOfAttempts){
	console.log("Trying to fetch the stock data");
	https.get('https://pdbss.herokuapp.com/withRecover', function(res){
		// https://pdbss.herokuapp.com/
		let rawData ='';
		if (res.statusCode !== 200){
			console.log("Something went wrong during the fetching of the data. Statuscode:");
			console.log(res.statusCode);
			if(numberOfAttempts === 0){
				console.log("Retrying data fetch again within 10 seconds.");
				setTimeout(function(){
					getStockData(1);
				}, 10000);
			}
		}
		else{
			res.on('data', function(chunk){
				rawData += chunk;
			});
			res.on('end', function(){
				try{
					scrapeResponse = JSON.parse(rawData);
					stockArray = stockTransactionsFile.getListOfActiveStocks().map(function(obj){
						return obj.name;
					});
					console.log("Fetching of stock data succeeded");				
				}
				catch(e){
					console.log(e);
				}
			})
		}
	}).on('error', function(e){
		console.log('An error occurred during the http get request: ${e.message}');
		if(numberOfAttempts === 0){
			console.log("Retrying data fetch again within 10 seconds.");
			setTimeout(function(){
				getStockData(1);
			}, 10000);
		}
	});	
};

function regularlyRefreshStockDataOnServer(){
	setInterval(function(){
		getStockData(0);
	},1200000)
}

getStockData(0);
regularlyRefreshStockDataOnServer();