var stockTransactionsArray = [
	{
		name: "Lyxor UCITS ETF BEL 20 TR",
		transactionType: "buy",
		number: 40,
		stockValue: 55.710,
		currency: "EUR",
		transactionDate: "2015-12-02",
		transactionCosts: {
			currency: "EUR",
			stockTax: 29.41,
			brokerRenumeration: 7.50
		}
	},
	{
		name: "Aedifica",
		transactionType: "buy",
		number: 20,
		stockValue: 62.780,
		currency: "EUR",
		transactionDate: "2016-04-07",
		transactionCosts: {
			currency: "EUR",
			stockTax: 1.13,
			brokerRenumeration: 7.50			
		}
	},
	{
		name: "Aedifica",
		transactionType: "buy",
		number: 5,
		stockValue: 61,
		currency: "EUR",
		transactionDate: "2017-03-28",
		transactionCosts: {
			currency: "EUR",
			brokerRenumeration: 5.0			
		}
	},
	{
		name: "Aedifica",
		transactionType: "sell",
		number: 0,
		stockValue: 70,
		currency: "EUR",
		transactionDate: "2016-04-08",
		transactionCosts: {
			currency: "EUR",
			stockTax: 1.13,
			brokerRenumeration: 7.50			
		}
	},
	{
		name: "Lyxor Nasdaq 100 UCITS ETF",
		transactionType: "buy",
		number: 144,
		stockValue: 16.998,
		currency: "EUR",
		transactionDate: "2015-12-30",
		transactionCosts: {
			currency: "EUR",
			stockTax: 6.61,
			brokerRenumeration: 10.02			
		}
	},
	{
		name: "Coca-Cola",
		transactionType: "buy",
		number: 34,
		stockValue: 43.45,
		currency: "USD",
		exchangerate: 1.120100,
		transactionDate: "2016-08-02",
		transactionCosts: {
			currency: "EUR",
			stockTax: 3.56,
			brokerRenumeration: 29.95			
		}
	},
	{
		name: "Zalando SE",
		transactionType: "buy",
		number: 33,
		stockValue: 35.0475,
		currency: "EUR",
		transactionDate: "2016-09-05",
		transactionCosts: {
			currency: "EUR",
			stockTax: 3.12,
			brokerRenumeration: 24.95			
		}
	},
	{
		name: "Unilever",
		transactionType: "buy",
		number: 44,
		stockValue: 41.41,
		currency: "EUR",
		transactionDate: "2016-09-09",
		transactionCosts: {
			currency: "EUR",
			stockTax: 4.92,
			brokerRenumeration: 14.95			
		}
	},
	{
		name: "Facebook",
		transactionType: "buy",
		number: 17,
		stockValue: 130.25,
		currency: "USD",
		exchangerate: 1.104400,
		transactionDate: "2016-10-11",
		transactionCosts: {
			currency: "EUR",
			stockTax: 5.41,
			brokerRenumeration: 29.95			
		}
	},
	{
		name: "Aedifica",
		transactionType: "dividend",
		number: 20,
		dividendValue: 2.1,
		currency: "EUR",
		transactionDate: "2016-12-02",
		transactionCosts: {
			currency: "EUR",
			dividendTax: 11.34		
		}
	},
	{
		name: "Tesla",
		transactionType: "buy",
		number: 8,
		stockValue: 250.82,
		currency: "USD",
		exchangerate: 1.0571,
		transactionDate: "2017-03-01",
		transactionCosts: {
			currency: "USD",
			stockTax: 5.51,
			brokerRenumeration: 29.95,
		}
	},
	{
		name: "Johnson & Johnson",
		transactionType: "buy",
		number: 18,
		stockValue: 123.35,
		currency: "USD",
		exchangerate: 1.0915,
		transactionDate: "2017-05-02",
		transactionCosts: {
			currency: "USD",
			stockTax: 6.08,
			brokerRenumeration:	29.95,
		}		
	},
];

var stockPropertiesArray = [
	{
		name: "Lyxor UCITS ETF BEL 20 TR",
		shortName: "BEL20",
		stockType: "tracker"
	},
	{
		name: "Lyxor Nasdaq 100 UCITS ETF",
		shortName: "NASDAQ100",
		stockType: "tracker"
	}	
];

var getStockTransactionsArray = exports.getStockTransactionsArray = function (){
	return stockTransactionsArray;
}

var getCurrentStockNumber = exports.getCurrentStockNumber = function (stockName){
	var stockNumber = 0;
	stockTransactionsArray.forEach(function(element){
		if(element.name == stockName){
			if(element.transactionType == "buy"){
				stockNumber += element.number;
			}
			if(element.transactionType == "sell"){
				stockNumber -= element.number;
			}
		}
	});
	return stockNumber;
}

var getAverageStockStartValue = exports.getAverageStockStartValue = function (stockName){
	var stockNumber = 0;
	var valueTotal = 0;
	stockTransactionsArray.forEach(function(element){
		if(element.name === stockName){
			if(element.transactionType == "buy"){
				stockNumber += element.number;
				valueTotal += (element.stockValue * element.number);
			}
		}
	});
	var averageStartValue = valueTotal / stockNumber;
	return averageStartValue;
}

var getListOfActiveStocks = exports.getListOfActiveStocks = function (){
	var stockList = [];
	stockTransactionsArray.forEach(function(element){
		if (stockList.find(function(arrayElement){
			return arrayElement.name === element.name;
		}) == undefined){
			stockList.push({name:element.name, currentStockNumber: getCurrentStockNumber(element.name)});
		}
	});
	return stockList;
}

var getStockCurrency = exports.getStockCurrency = function (stockName){
	var found = false;
	var thecurrency = "EUR";
	stockTransactionsArray.forEach(function(element){
		if(element.name === stockName && element.transactionType === "buy" && found === false){
			thecurrency = element.currency;
			found = true;
		}
	});
	return thecurrency;
}

var getStockPropertiesArray = exports.getStockPropertiesArray = function(){
	return stockPropertiesArray;
};