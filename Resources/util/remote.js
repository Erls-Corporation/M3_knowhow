/* 
 * This file is part of the knowhow ERP, a free and open source 
 * Enterprise Resource Planning software suite,
 * Copyright (c) 2010-2011 by bring.out doo Sarajevo.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including knowhow-specific Exhibits)
 * is available in the file LICENSE_CPAL_bring.out_knowhow.md located at the 
 * root directory of this source code archive.
 * By using this software, you agree to be bound by its terms.
 */

// Main remote methode's. Here are the logic of http request's, send's, etc...

// This is the unique namespace for remote method's
M3.Remote = {};

// Adding synchro into namespace...
M3.Remote.Get = {};
M3.Remote.Post = {};


// open main initialization form
M3.Remote.formInit = function() {
	
	// create window
	var s_win = Ti.UI.createWindow({
		title:'Inicijalizacija...',
		backgroundColor:'black',
		top:0,
		bottom:0
	});

	// create label server 
	var lbl_server = Ti.UI.createLabel({
		color:'white',
		text:'nije podešeno...',
		left:'25%',
		top:'3%',
		font:{fontSize:'6pt'}
	});
	
	// create btn set server
	var btn_set_server = Ti.UI.createButton({
		title:'Server',
		top:'2%',
		left:'2%',
		width:'23%',
		height:'10%'
	});

	// create btn init...
	var btn_init = Ti.UI.createButton({
		title:'Uzmi podatke',
		top:'12%',
		left:'2%',
		width:'40%',
		height:'10%'
	});
	
	// create label info 
	var lbl_info = Ti.UI.createLabel({
		color:'white',
		text:'Rezultati inicijalizacije:',
		left:'4%',
		top:'22%',
		font:{fontSize:'7pt'}
	});
		
	// create label info 
	var lbl_i_params = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'28%',
		font:{fontSize:'7pt'}
	});
	
	// create label info 
	var lbl_i_articles = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'33%',
		font:{fontSize:'7pt'}
	});

	// create label info 
	var lbl_i_images = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'38%',
		font:{fontSize:'7pt'}
	});	

	// create label customers 
	var lbl_i_cust = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'43%',
		font:{fontSize:'7pt'}
	});	
	
	// create label customers 
	var lbl_i_users = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'48%',
		font:{fontSize:'7pt'}
	});	

	
	// create btn init...
	var btn_save = Ti.UI.createButton({
		title:'Snimi',
		bottom:'1%',
		right:'2%',
		width:'35%',
		height:'10%'
	});	

	// create btn init...
	var btn_cancel = Ti.UI.createButton({
		title:'Odustani',
		bottom:'1%',
		left:'2%',
		width:'35%',
		height:'10%'
	});	
	
	// read global variables and set to lables...
	if(Ti.App.par_server_url != undefined && Ti.App.par_server_url != null && Ti.App.par_server_url != ""){
		lbl_server.text = Ti.App.par_server_url;
	};
	
	// add controls to window 's_win'
	s_win.add(lbl_server);
	s_win.add(btn_set_server);
	s_win.add(lbl_info);
	s_win.add(lbl_i_articles);
	s_win.add(lbl_i_params);
	s_win.add(lbl_i_images);
	s_win.add(lbl_i_cust);
	s_win.add(lbl_i_users);
	s_win.add(btn_init);
	s_win.add(btn_save);
	s_win.add(btn_cancel);
	
	// event listeners of 's_win' controls
	
	// btn_set_server listener
	btn_set_server.addEventListener("click", function(){
		var tmp_frm = M3.StdForms.getStrValue();
		tmp_frm.addEventListener("close", function(){
			lbl_server.text = tmp_frm.item_value;
			Ti.App.par_server_url = tmp_frm.item_value;
			Ti.App.Properties.setString("par_server_url", tmp_frm.item_value);
		});
	});
	
	// btn_init listener
	btn_init.addEventListener("click", function(){
		
		// synchronize articles
		M3.Remote.Get.synhroArticles();
		
		Ti.App.addEventListener("articlesSynchronized", function(e){
			
			if(e.result == 0){
				lbl_i_articles.text = "- artikli : nije uspjelo !!!";
				return;
			};
			
			// set label value
			lbl_i_articles.text = "- artikli init ok -> " + e.count;
		
			// run synchronize of the images
			M3.Remote.Get.synhroArticleImages();
			
			var images_cnt = 0;
		
			// listen for event save image
			Ti.App.addEventListener("articlesImageSaved", function(e){
				
				if(e.result == 0){
					lbl_i_images.text = "- download slika -> već postoje!";
				}
				else
				{
					images_cnt = images_cnt + e.count;
					lbl_i_images.text = "- download slika -> " + images_cnt.toString();
				};
			});
			
		});
		
		
		// synchronize params
		M3.Remote.Get.synhroParams();
		Ti.App.addEventListener("paramsSynchronized", function(e){
			if(e.result == 0){
				lbl_i_params.text = "- parametri: nije uspjelo !!!";
				return;
			};
			
			// set label value
			lbl_i_params.text = "- parametri init ok -> " + e.count;
		});	
		
		// synchronize customers
		M3.Remote.Get.synhroCustomers();
		Ti.App.addEventListener("customersSynchronized", function(e){
			if(e.result == 0){
				lbl_i_cust.text = "- partneri: nije uspjelo !!!";
				return;
			};
			
			// set label value
			lbl_i_cust.text = "- partneri init ok -> " + e.count;
		});
		
		// synchronize customers
		M3.Remote.Get.synhroUsers();
		Ti.App.addEventListener("usersSynchronized", function(e){
			if(e.result == 0){
				lbl_i_users.text = "- users: nije uspjelo !!!";
				return;
			};
			
			// set label value
			lbl_i_users.text = "- users init ok -> " + e.count;
		});
		
		
	});
	
	// set params
	btn_save.addEventListener("click", function(){
		M3.Params.setParams();
		s_win.close();
	});
	
	// cancel 
	btn_cancel.addEventListener("click", function(){
		s_win.close();
	});
	
	// open 's_win' window
	s_win.open();
	
	// return 's_win' for listening event 'close'
	return s_win;
	
};


// open initialization form
M3.Remote.formUsersInit = function() {
	
	// create window
	var s_win = Ti.UI.createWindow({
		title:'Inicijalizacija...',
		backgroundColor:'black',
		top:0,
		bottom:0
	});

	// create label server 
	var lbl_server = Ti.UI.createLabel({
		color:'white',
		text:'nije podešeno...',
		left:'25%',
		top:'3%',
		font:{fontSize:'6pt'}
	});
	
	// create btn set server
	var btn_set_server = Ti.UI.createButton({
		title:'Server',
		top:'2%',
		left:'2%',
		width:'23%',
		height:'10%'
	});

	// create btn init...
	var btn_init = Ti.UI.createButton({
		title:'Uzmi podatke',
		top:'12%',
		left:'2%',
		width:'40%',
		height:'10%'
	});
	
	// create label info 
	var lbl_info = Ti.UI.createLabel({
		color:'white',
		text:'Rezultati inicijalizacije:',
		left:'4%',
		top:'22%',
		font:{fontSize:'7pt'}
	});
			
	// create label customers 
	var lbl_i_users = Ti.UI.createLabel({
		text:"-",
		color:'white',
		left:'7%',
		top:'27%',
		font:{fontSize:'7pt'}
	});	

	
	// create btn init...
	var btn_save = Ti.UI.createButton({
		title:'Snimi',
		bottom:'1%',
		right:'2%',
		width:'35%',
		height:'10%'
	});	

	// create btn init...
	var btn_cancel = Ti.UI.createButton({
		title:'Odustani',
		bottom:'1%',
		left:'2%',
		width:'35%',
		height:'10%'
	});	
	
	// read global variables and set to lables...
	if(Ti.App.par_server_url != undefined && Ti.App.par_server_url != null && Ti.App.par_server_url != ""){
		lbl_server.text = Ti.App.par_server_url;
	};
	
	// add controls to window 's_win'
	s_win.add(lbl_server);
	s_win.add(btn_set_server);
	s_win.add(lbl_info);
	s_win.add(lbl_i_users);
	s_win.add(btn_init);
	s_win.add(btn_save);
	s_win.add(btn_cancel);
	
	// event listeners of 's_win' controls
	
	// btn_set_server listener
	btn_set_server.addEventListener("click", function(){
		var tmp_frm = M3.StdForms.getStrValue();
		tmp_frm.addEventListener("close", function(){
			lbl_server.text = tmp_frm.item_value;
			Ti.App.par_server_url = tmp_frm.item_value;
			Ti.App.Properties.setString("par_server_url", tmp_frm.item_value);
		});
	});
	
	// btn_init listener
	btn_init.addEventListener("click", function(){
		
		// synchronize users
		M3.Remote.Get.synhroUsers();
		Ti.App.addEventListener("usersSynchronized", function(e){
			if(e.result == 0){
				lbl_i_users.text = "- users: nije uspjelo !!!";
				return;
			};
			
			// set label value
			lbl_i_users.text = "- users init ok -> " + e.count;
		});
		
	});
	
	// set params
	btn_save.addEventListener("click", function(){
		M3.Params.setParams();
		s_win.close();
	});
	
	// cancel 
	btn_cancel.addEventListener("click", function(){
		s_win.close();
	});
	
	// open 's_win' window
	s_win.open();
	
	// return 's_win' for listening event 'close'
	return s_win;
	
};



// Synchronize users, main function 
M3.Remote.Get.synhroUsers = function() {
	
	var data;
	var server_url = Ti.App.par_server_url;
	// url to send request
	var url = server_url + '/users';
	
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		// retrieve data into JSON object	
 		data = JSON.parse(this.responseText);	
		
		if(data != null){

			// remove all articles from db
			M3.DB.deleteUsers();
		
			// insert data into db
			M3.DB.insertIntoUsers(data);
		
			// check for data inserted with server data
			var cnt = M3.DB.getUsersCount();
		
			// DEBUG msg
			if( cnt == data.length ){
				// fire event and run 'M3.Remote.synchro.synhroArticleImages()'
				Ti.App.fireEvent("usersSynchronized", { result:1, count:cnt.toString() });
			}
			else
			{
				Ti.App.fireEvent("usersSynchronized", { result:0, count:0 });
			};						
		};
   	};
		
	xhr.open('GET', url);
	xhr.send();

};


// Synchronize purchases, main function 
M3.Remote.Post.synhroPurchases = function() {
	
	var data = JSON.stringify(M3.DB.getPurcasesData(Ti.App.current_logged_user_id));
	//data = JSON.parse(data);
	var server_url = Ti.App.par_server_url;
	// url to send request

	var url = server_url + '/purchases/update';
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		Ti.App.fireEvent("purchasePosted", { result:1, count:data.length });
		Ti.API.info(this.readyState);
    	Ti.API.info(this.responseText);
   	};
		
	//xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(data);

};


// Synchronize customers, main function 
M3.Remote.Post.synhroCustomers = function() {
	
	var data = JSON.stringify(M3.Codes.Customers.getCustomers());
	//data = JSON.parse(data);
	
	var server_url = Ti.App.par_server_url;
	// url to send request

	var url = server_url + '/customers/update';
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		Ti.App.fireEvent("customersPosted", { result:1, count:data.length });
		Ti.API.info(this.readyState);
    	Ti.API.info(this.responseText);
   	};
		
	//xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(data);

};


// Synchronize customers, main function 
M3.Remote.Get.synhroCustomers = function() {
	
	var data;
	var server_url = Ti.App.par_server_url;
	// url to send request
	var url = server_url + '/customers';
	
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		// retrieve data into JSON object	
 		data = JSON.parse(this.responseText);	
		
		if(data != null){

			// remove all articles from db
			M3.DB.deleteCustomers();
		
			// insert data into db
			M3.DB.insertIntoCustomers(data);
		
			// check for data inserted with server data
			var cnt = M3.DB.getCustomersCount();
		
			// DEBUG msg
			if( cnt == data.length ){
				// fire event and run 'M3.Remote.synchro.synhroArticleImages()'
				Ti.App.fireEvent("customersSynchronized", { result:1, count:cnt.toString() });
			}
			else
			{
				Ti.App.fireEvent("customersSynchronized", { result:0, count:0 });
			};						
		};
   	};
		
	xhr.open('GET', url);
	xhr.send();

};


// Synchronize customers, main function 
M3.Remote.Get.synhroParams = function() {
	
	var data;
	var server_url = Ti.App.par_server_url;
	// url to send request
	var url = server_url + '/params/' + Ti.App.current_device_id;
	
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		// retrieve data into JSON object	
 		data = JSON.parse(this.responseText);	
		
		if(data != null){

			// remove all articles from db
			M3.DB.deleteParams();
		
			// insert data into db
			M3.DB.insertIntoParams(data);
		
			// check for data inserted with server data
			var cnt = M3.DB.getParamsCount();
		
			// DEBUG msg
			if( cnt == data.length ){
				// fire event and run 'M3.Remote.synchro.synhroArticleImages()'
				Ti.App.fireEvent("paramsSynchronized", { result:1, count:cnt.toString() });
			}
			else
			{
				Ti.App.fireEvent("paramsSynchronized", { result:0, count:0 });
			};						
		};
   	};
		
	xhr.open('GET', url);
	xhr.send();

};


// Synchronize articles, main function 
M3.Remote.Get.synhroArticles = function() {
	
	var data;
	var server_url = Ti.App.par_server_url;
	// url to send request
	var url = server_url + '/articles';
	
	// create http client
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.onload = function()
	{	
		// retrieve data into JSON object	
 		data = JSON.parse(this.responseText);	
		
		if(data != null){

			// remove all articles from db
			M3.DB.deleteArticles();
		
			// insert data into db
			M3.DB.insertIntoArticles(data);
		
			// check for data inserted with server data
			var cnt = M3.DB.getArticleCount();
		
			// DEBUG msg
			if( cnt == data.length ){
				// fire event and run 'M3.Remote.synchro.synhroArticleImages()'
				Ti.App.fireEvent("articlesSynchronized", { result:1, count:cnt.toString() });
			}
			else
			{
				Ti.App.fireEvent("articlesSynchronized", { result:0, count:0 });
			};						
		};
   	};
		
	xhr.open('GET', url);
	xhr.send();

};


// Synchronize images from http server...
M3.Remote.Get.synhroArticleImages = function() {
	
	// Get article JSON
	var art_data = M3.Codes.Articles.getArticles();
	
	var server_url = Ti.App.par_server_url;
	// per example: http://localhost:3333/article_pict/3013
	var _url = server_url + '/article_image/';
	var _srv_url;
	var _id;
	
	// Simply loop through the article data
	for (var i=0; i < art_data.length; i++) {

		// { _id }
		// This will be an article id variable
		_id = art_data[i].id;
	
		// { _srv_url } 
		// This will be a complete server url for creating http server and get request
		_srv_url = _url + _id;	  
		
		// save image to local storage of the phone
		M3.Remote.Get.saveImageToDevice( _id, _srv_url );
	};
			
};


// Get image from http server and update into local table "articles"
M3.Remote.Get.saveImageIntoTable = function( _article_id, _url ) {

	// Create http server
	var xhr = Ti.Network.createHTTPClient();
	var data;
	
	xhr.onload = function()
	{		
 		// Retrieve data from http server
 		data = this.responseData;
 			
 		// Debug info
 		//Ti.API.info("->" + _article_id + " data: " + Ti.Utils.base64encode(data));
 			
 		if (data != null) {
 			// Update data into blob field of local table "articles"
 			M3.DB.updateArticleImage( _article_id, data ); 
 		};
 			   	
   	};
		
	xhr.open('GET', _url);
	xhr.send();	
	
};


// Get image from http server and save to local storage of android device
M3.Remote.Get.saveImageToDevice = function( _article_id, _url ) {

	// Create http server
	var xhr = Ti.Network.createHTTPClient();
	var data;
	
	xhr.onload = function()
	{		
 		// Retrieve data from http server
 		data = this.responseData;
 					
 		if (data != null) {
 		
 			var s_file = Ti.Filesystem.getFile(Ti.App.current_images_dir, _article_id + '.jpg');
 			
 			// Create file only if not exist
 			if(!s_file.exists()){
 				s_file.write(data);
 				Ti.App.fireEvent("articlesImageSaved", { result: 1, count: 1 });
 			}
 			else
 			{
 				Ti.App.fireEvent("articlesImageSaved", { result: 0, count: 1 });
 			};
 			
 			// debug info
 			//Ti.API.info("->" + _article_id + " data: " + data + " size: " + s_file.size );
  
 		};					
   	};
		
	xhr.open('GET', _url);
	xhr.send();	
	
};
