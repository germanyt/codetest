/**
 * 
 */

'use strict';

var $ = require('jquery');

var basicData;

var categoryIndex = -1;
var sortRule;

var navElem = $('#JS_nav');
var listElem = $('#JS_product_list');


function getData (){
	$.ajax({
		url: 'data.json',
		dataType: 'json',
		success: function(data){
			basicData = data;
			renderNavigator();
			render();
		}
	});
}

function renderNavigator () {
	var html = '<a href="#" class="on" data-index="-1">ALL PRODUCTS</a>';

	$.each(basicData, function(i, item){
		html += '<a href="#" data-index="'+i+'">'+item.category+'</a>';
	});

	navElem.html( html );
}

function renderProducts (data) {
	var html = '';
	$.each(data, function(i, item){
		var image = item.image? ('products/'+item.image) : 'product_default.png';
		html += '<li>\
			<figure>\
				<img src="images/'+image+'" alt="'+item.name+'">\
				<figcaption>'+item.name+'</figcaption>\
			</figure>\
			<p>Price..........$'+item.price+'</p>\
		</li>';
	});

	return html;
}


function formatData(){
	var data = [];

	if(categoryIndex >= basicData.length){
		return false;
	}else if(categoryIndex == -1){
		$.each(basicData, function(i, item){
			data = data.concat(item.products);
		});
	} else {
		data = data.concat(basicData[categoryIndex].products);
	}

	return data;
}

function uniqe(data, key){
	var hash = {};
	var rt = [];

	data.forEach(function(item, index){
		if(!hash[item[key]]){
			hash[item[key]] = true;
			rt.push(item);
		}
	});

	return rt;
}

function Alphabetically(a, b){
	return a.name < b.name ? -1: 1;
}
function priceHighToLow(a, b){
	return b.price - a.price;
}
function priceLowToHigh(a, b){
	return a.price - b.price;
}

function sort(data){

	switch(sortRule){
		case 'Alphabetically':
		data.sort(Alphabetically);
		break;
		case 'priceHighToLow':
		data.sort(priceHighToLow);
		break;
		case 'priceLowToHigh':
		data.sort(priceLowToHigh);
		break;
		default:
		break;
	}

	return data;
	
}


function render(){
	var data , html;

	data = formatData();

	data = uniqe(data, 'id');
console.log(data);
	data = sort(data);

	html = renderProducts(data);

	listElem.html(html);

}

navElem.on('click', 'a', function(){
	var _this = $(this);

	var index = _this.data('index');

	_this.addClass('on').siblings().removeClass('on');

	categoryIndex = index - 0;
	sortRule = '';

	render();

	return false;
});


$('#JS_filter').on('click', 'a', function(){
	sortRule = $(this).data('sort');
	render();
	return false;
});


getData();
