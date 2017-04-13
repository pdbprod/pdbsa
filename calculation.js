var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; //making XMLHttpRequest work outside the browser as well
var stockTransactionsFile = require("./stockTransactionsFile.js");
var USDtoEUR = 0.934710473;

function getCurrentStockInfo(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", url, true);
	console.log("Retrieving data from: " + url);
	xhr.onload = function() {
		var status = xhr.status;
		if (status == 200) {
			var JSONResponse = JSON.parse(xhr.responseText);
			console.log("XHR responseText", xhr.responseText);
			callback(null, JSONResponse);
		} else {
			callback(status);
		}
    };
	xhr.send();
};

function getDayPercentage(stockName, currentStockInfo){
	var dayPercentageOrig = currentStockInfo
		.find(function(arrayElement){
			return arrayElement.name === stockName;
		})
		.percentage.replace(/,/g, '.');
	var dayPercentage = "";
	if (dayPercentageOrig.includes("-")){
		dayPercentage = dayPercentageOrig.substring(0,5);
	}else{
		dayPercentage = dayPercentageOrig.substring(0,4);
	}
	return dayPercentage;
}

function getMonthPercentage(stockName, currentStockInfo){
	//console.log("GMP",currentStockInfo);
	var historyStr = "history";
	var monthPercentageOrig = currentStockInfo
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

/*
function extractMonthPercentage(stockInfo) {
	return stockInfo["history"]
		.find(arrayElement => arrayElement.timespan === "1 maand")
		.percent.replace(/,/g, '.');
}

var monthPercentages = currentStockInfo.map(extractMonthPercentage);

*/

function getYearPercentage(stockName, currentStockInfo){
	var historyStr = "history";
	var yearPercentageOrig = currentStockInfo
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

function printIndividualStockPercentage(stockName, stockArray){
	console.log("Current percentage of " + stockName + " is: " + stockArray.find(function(arrayElement){
		return arrayElement.name === stockName;
	}).percentage);
}

function getIndividualStockValue(stockName, currentStockInfo){
	var currentStockPrice = currentStockInfo.find(function(arrayElement){
		return arrayElement.name === stockName;
	}).price.replace(/,/g, '.');
	var currentStockNumber = stockTransactionsFile.getCurrentStockNumber(stockName);
	stockValue = currentStockPrice * currentStockNumber;
	return stockValue;
}

function printAllIndividualStockValues(currentStockInfo){
	console.log("Overview of all individual stock values: ");
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	stockList.forEach(function(element){
		var individualStockValue = getIndividualStockValue(element.name, currentStockInfo);
		var currency = stockTransactionsFile.getStockCurrency(element.name);
		console.log("Current stock value for " + element.name + " is: " + currency + " " + individualStockValue.toFixed(2) + ".");
	});
}

function printAllIndividualStockValueReturns(currentStockInfo){
	console.log("Overview of all individual stock value returns: ");
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	stockList.forEach(function(element){
		var individualStockValueReturn = getIndividualStockValueReturn(element.name, currentStockInfo);
		var currency = stockTransactionsFile.getStockCurrency(element.name);
		console.log("Current absolute stock value return for " + element.name + " is: " + currency + " " + individualStockValueReturn.returnAbs.toFixed(2) + ", or in percentage: " + individualStockValueReturn.returnPerc.toFixed(2));
	});
}

function getIndividualStockValueReturn(stockName, currentStockInfo){
	var currentStockValue = getIndividualStockValue(stockName, currentStockInfo);
	var averageStartValue = stockTransactionsFile.getAverageStockStartValue(stockName);
	var currentStockNumber = stockTransactionsFile.getCurrentStockNumber(stockName);
	var historicalStockValue = averageStartValue * currentStockNumber;
	var stockValueReturnAbs = currentStockValue - historicalStockValue;
	var stockValueReturnPerc = (stockValueReturnAbs/historicalStockValue)*100;
	return {returnAbs: stockValueReturnAbs, returnPerc: stockValueReturnPerc};
}

function getTotalStockValueReturn(currentStockInfo){
	var stockReturn = getTotalStockValue(currentStockInfo)
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
		returnAbsConv: stockValueReturnAbsConv,
		returnPercEUR: stockValueReturnPercEUR,
		returnPercUSD: stockValueReturnPercUSD,
		returnPercConv: stockValueReturnPercConv
	};
}

function getTotalStockValue(currentStockInfo){
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	var totalValueUSD = 0;
	var totalValueEUR = 0;
	stockList.forEach(function(element){
		var individualStockValue = getIndividualStockValue(element.name, currentStockInfo);
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

var getStarted = exports.getStarted = function (){
	getCurrentStockInfo_request("https://pdbss.herokuapp.com/withRecover");
}

function getCurrentStockInfo_request(url){
	getCurrentStockInfo(url, getCurrentStockInfo_reply);
}

function getCurrentStockInfo_reply(err, result){
	if (err) {
		console.log("Something went wrong during the retrieval of the stock info: " + err);
	} else {
		console.log("Data retrieval succeeded");
		console.log("=====");
		// console.log(result);
		var currentStockInfo = result;
		performStockCalculations(currentStockInfo);
	}
}

function performStockCalculations(currentStockInfo){
	printAllIndividualStockValues(currentStockInfo);
	var totalStockValue = getTotalStockValue(currentStockInfo);
	console.log("Total stock value in original currencies is: EUR " + totalStockValue.stockValueEUR.toFixed(2) + " and USD " + totalStockValue.stockValueUSD.toFixed(2) + ".");
	console.log("Total stock value converted in EUR is: EUR " + totalStockValue.stockValueEURConverted.toFixed(2) + ".");
	console.log("=====");
	printAllIndividualStockValueReturns(currentStockInfo);
	var totalReturn = getTotalStockValueReturn(currentStockInfo);
	console.log("Return abs EUR: " + totalReturn.returnAbsEUR .toFixed(2) + ", abs USD: " + totalReturn.returnAbsUSD.toFixed(2) + ", abs converted: " + totalReturn.returnAbsConv.toFixed(2));
	console.log("Return perc EUR: " + totalReturn.returnPercEUR .toFixed(2) + ", perc USD: " + totalReturn.returnPercUSD.toFixed(2) + ", perc converted: " + totalReturn.returnPercConv.toFixed(2));
	console.log("=====");
	var light = calculatelights(currentStockInfo);
}

var calculatelights = exports.calculatelights = function (currentStockInfo){
	var stockList = stockTransactionsFile.getListOfActiveStocks();
	var dayPercentageScore = 0;
	var monthPercentageScore = 0;
	var yearPercentageScore = 0
	stockList.forEach(function(element){
		var currency = stockTransactionsFile.getStockCurrency(element.name);
		var individualStockValue = getIndividualStockValue(element.name, currentStockInfo);
		if(currency === "USD"){
			individualStockValue = individualStockValue * USDtoEUR;
		}		
		dayPercentageScore += (getDayPercentage(element.name, currentStockInfo)*individualStockValue);
		monthPercentageScore += (getMonthPercentage(element.name, currentStockInfo)*individualStockValue);
		yearPercentageScore += (getYearPercentage(element.name, currentStockInfo)*individualStockValue);
	});
	var totalStockValue = getTotalStockValue(currentStockInfo).stockValueEURConverted;
	var dayPercentage = dayPercentageScore / totalStockValue;
	var monthPercentage = monthPercentageScore / totalStockValue;
	var yearPercentage = yearPercentageScore / totalStockValue;
	console.log("Day percentage: " + dayPercentage.toFixed(2) + ", Month percentage: " + monthPercentage.toFixed(2) + " , Year Percentage: " + yearPercentage.toFixed(2));
	return {
		day: dayPercentage,
		month: monthPercentage,
		year: yearPercentageScore
	};
}

getStarted();