
/*
Необходимо реализовать предзагрузчик картинок.
	Картинки, которые нужно предзагрузить, можно передавать одним из следующих способов:
	- массив из URL
- URL через запятую
- массив элементов типа img
- элементы типа img через запятую
- img и URL можно указывать вперемшку

Все способы должны работать.
	Функция предзагрузки должна возвращает промис.
	Если какая-то из картинок не загрузилась(например сервер отдал 404, или указали элемент img,
	в котором уже была битая картинка, в общем, если по какой-либо причине не удалось загрузить картинку),
	то промис реджектится, если всё ок и всего картинки успешно загружены - резолвиться с массивом из IMG-элментов.

	пример:
*/
var images = document.getElementsByTagName('img');

preloader(images)
	.then(function(result){
			console.log('всё загружено');
		},
		function(){
			console.log('всё плохо');
		});

preloader(imageElement1, someUrl, someOtherUrl, imageElement2)
	.then(function(){
			console.log('всё загружено');
		},
		function(){
			console.log('всё плохо');
		});
//
//Если хочется еще более жесткого задания, то можно модеринизировать загрузчик таким образом,
//	чтобы он ВСЕГДА резолвился, а в onFulfilled-callback
//передавал в массив со статусами картинок. Например:
[
	{
		image: ....,
	status: true
},
{
	image: ....,
	status: false
}
]

preloader(images)
	.then(function(result){
		result.forEach(function(data){
			if(data.status){
			....
			} else {
			....
			}
		});
	});


/*
Еще более интересная вариация задания: прелоадер резолвится ВСЕГДА,
 но если какая-то картинка не смогла загрузиться, то эта картинка подменяется какой-нибудь default-картинкой*/