var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');


//Firebase Real Time
var firebase = require("firebase-admin");
var serviceAccount = require("./bookSan.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://booksan-9a3cc.firebaseio.com"
});

var db = firebase.database();

var port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());



app.get('/books', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');

	var booksReference = db.ref("books");

	//Attach an asynchronous callback to read the data
	booksReference.on("value", 
			  function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
			  function (errorObject) {
					res.send("The read failed: " + errorObject.code);
			 });
});

app.get('/book/:bookid', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');
	var bookid = Number(req.params.bookid);
	var booksReference = db.ref("books");

	//Attach an asynchronous callback to read the data

	booksReference.orderByChild("bookid").equalTo(bookid).on("child_added", 
	  function(snapshot) {
			console.log(snapshot.val());
			res.json(snapshot.val());
			booksReference.off("value");
			}, 
	  function (errorObject) {
			console.log("The read failed: " + errorObject.code);
			res.send("The read failed: " + errorObject.code);
 			});


});

app.get('/lastbookid', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');

	var booksReference = db.ref("lastId");

	//Attach an asynchronous callback to read the data
	booksReference.on("value", 
			  function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
			  function (errorObject) {
					res.send("The read failed: " + errorObject.code);
			 });
});


app.put('/lastbookid', function (req, res) {

	 
	var bookid = Number(req.body.bookid);

	//Update to Firebase
	var bookReference = db.ref("lastId");
	if(bookReference !== null) {

	bookReference.set(bookid, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("" );
					}
			});
	}


});


app.get('/lastorderid', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');

	var ordersReference = db.ref("lastOrderId");

	//Attach an asynchronous callback to read the data
	ordersReference.on("value", 
			  function(snapshot) {					
					res.json(snapshot.val());
					ordersReference.off("value");
					}, 
			  function (errorObject) {
					res.send("The read failed: " + errorObject.code);
			 });
});


app.put('/lastorderid', function (req, res) {

	 
	var orderId = Number(req.body.orderId);

	//Update to Firebase
	var ordersReference = db.ref("lastOrderId");
	if(ordersReference !== null) {

		ordersReference.set(orderId, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("" );
					}
			});
	}


});

app.put('/book', function (req, res) {
  
	console.log("HTTP Put Request");

	var bookid = req.body.bookid;
	var price = req.body.price; 
	var title = req.body.title;
	var author = req.body.author;
	var isbn=req.body.isbn;
	var pageCount=req.body.pageCount;
	var publishedDate=req.body.publishedDate;
	var thumbnailUrl=req.body.thumbnailUrl;
	var shortDescription=req.body.shortDescription;
	var category=req.body.category;

	var referencePath = '/books/'+bookid+'/';
	

	//Update to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {

	bookReference.set({bookid:bookid, price:price, title: title, author: author, isbn: isbn, pageCount: pageCount, publishedDate: publishedDate, thumbnailUrl: thumbnailUrl, shortDescription: shortDescription, category: category}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("" );
					}
			});
	}


});

app.post('/book', function (req, res) {

	var bookid = req.body.bookid;	
	var price = req.body.price; 	
	var title = req.body.title;
	var author = req.body.author;
	var isbn=req.body.isbn;
	var pageCount=req.body.pageCount;
	var publishedDate=req.body.publishedDate;
	var thumbnailUrl=req.body.thumbnailUrl;
	var shortDescription=req.body.shortDescription;
	var category=req.body.category;

	var referencePath = '/books/'+bookid+'/';
	

	//Add to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {

	bookReference.update({bookid:bookid, price:price, title: title, author: author, isbn: isbn, pageCount: pageCount, publishedDate: publishedDate, thumbnailUrl: thumbnailUrl, shortDescription: shortDescription, category: category}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("" );
					}
			});
	}

});


app.post('/order', function (req, res) {

	var orderId = req.body.orderId;	
	var name = req.body.name; 	
	var address = req.body.address;
	var province = req.body.province;
	var postal=req.body.postal;
	var total=req.body.total;
	var orderdetail=req.body.orderdetail;

	var referencePath = '/orders/' + orderId + '/';
	

	//Add to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {

	bookReference.update({orderId:orderId, name:name, address: address, province: province, postal: postal, total: total, orderdetail: orderdetail}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("" );
					}
			});
	}


	
});


app.delete('/order/:orderid', function (req, res) {
	var orderid = req.body.orderid;
	var orderid = Number(req.params.orderid);
	var referencePath = '/orders/'+orderid+'/';

	//Delete to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {
		bookReference.remove();
		res.send("" );
	}
});


app.delete('/book/:bookid', function (req, res) {
  	var bookid = req.body.bookid;
	var bookid = Number(req.params.bookid);
	var referencePath = '/books/'+bookid+'/';
	
	//Delete to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {
		bookReference.remove();
		res.send("" );
	}
});

app.listen(port, function () {
    console.log("Server is up and running...");
});