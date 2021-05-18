class Lowmodel {
	constructor(arg) {
		this.baseUrl = 'https://hengzhuo.vip/hengz';
		this.tostTime = null
		this.init()
	}
	init() {
		this.getTerritory().then(res => {
			this.setGoodList(res.data)
		}, err => {
			console.log(err);
		})
	}
	// 获取擅长领域
	getTerritory() {
		return new Promise((reslove, reject) => {
			$.get("https://hengzhuo.vip/hengz/app/org/skillList", function(data, status) {
				reslove(data);
			});
		})
	}
	// 获取擅长领域选中数量
	getSelectedNum() {

		let ac = $('.goodList span').filter((i, v) => {
			return $(v).hasClass('active')
		})
		return ac.length
	}
	// 改变擅长领域 选中状态
	changeStatus(that) {
		console.log(that);
		if (this.getSelectedNum() >= 3 && !$(that).hasClass('active')) {
			this.showTost('最多选择三个擅长领域')
		} else {
			$(that).toggleClass('active')
		}
	}
	setGoodList(data) {
		let html = data.reduce((prev, cur) => {
			return prev + `<span data-id='${cur.id}'>${cur.name}</span>`
		}, '')
		$('.goodList').empty().html(html);
	}
	showTost(text, time = 1000) {
		if (this.tostTime) {
			clearTimeout(this.tostTime)
			this.tostTime = null;
			$('.warn').hide();
		}
		$('.warn').css('display', 'flex')
		$('.warn>div').text(text)
		this.tostTime = setTimeout(function() {
			$('.warn').hide();
		}, time)
	}

}
let lowmodel = new Lowmodel()

$('.goodList').on('click', ' span', function() {
	lowmodel.changeStatus(this)
})


$('.goodat').on('click', function() {
	$('#popup').animate({
		top: 0
	}, 200)
	$(".category-desc-toggle").toggleClass("rotate45");
})
$(".category-desc-toggle").on('click', function() {
	$('#popup').animate({
		top: '100vh'
	}, 200)
	$(".category-desc-toggle").toggleClass("rotate45");
})
/* setPics */
function setPics(arr, _this) {
	console.log(_this);
	let dom = arr.reduce((prev, cur, ind) => {
		let html = `
			<div class="picCon">
				<img src="img/del.png" class='delIcon' data-ind='${ind}'>
				<img src="${request.baseUrl}/app/common/download/${cur}" class='pic_s'>
			</div>
			`
		return prev + html
	}, '')

	let len = _this.parent().attr('data-len');

	_this.parent().siblings('.picCon').remove()
	_this.parent().before(dom)
	_this.parent().parent().next('.statistics').text(`${arr.length}/${len}`)
	if (len <= arr.length) {
		_this.parent().hide()
	} else {
		_this.parent().show()
	}
}
/*
提交 data
*/
let commitData = {
	lszp: [],
	ryzp: [],
}
$('.zyzgz').on('change', function() {
	var formData = new FormData();
	formData.append('file', $(this)[0].files[0]);
	formData.append('path', 'backend/contract/img');
	request.http('/app/common/uploadFile/stateless', formData).then(res => {
		$(this).next('img').attr('src', `${request.baseUrl}/app/common/download/${res.data.fileId}`)
		let key = $(this).attr('data-commit')
		commitData[key] = res.data.fileId
	})
})

// 多张
$('.multiple').on('change', function() {
	var formData = new FormData();
	formData.append('file', $(this)[0].files[0]);
	formData.append('path', 'backend/contract/img');
	request.http('/app/common/uploadFile/stateless', formData).then(res => {
		let key = $(this).parent().attr('data-commit')
		commitData[key].push(res.data.fileId)
		setPics(commitData[key], $(this))
	})
})

/* 删除 图片*/
$('.picsCon').on('click', '.delIcon', function() {
	let key = $(this).parents('.picsCon').children('.uploadCon').attr('data-commit')
	let ind = $(this).attr('data-ind')
	console.log(ind);
	commitData[key].splice(ind, 1)
	let _this = $(this).parents('.picsCon').find('.multiple')
	setPics(commitData[key], _this)
})
