function number_format($fee1) {
	return $fee1.toFixed(2);
}

// 限制 输入 数字
function num(obj){
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}

// 日期选择器数据
function setTimeDateSelete(endTime, beginYear) {
	var myDate = new Date(endTime);
	myDate.getFullYear(); //获取完整的年份(4位,1970-????)
	myDate.getMonth(); //获取当前月份(0-11,0代表1月)
	myDate.getDate();
	var _data = [];
	for (i = 0; i < myDate.getFullYear() - beginYear; i++) {
		//年
		var obj = {};
		var yer = beginYear + i + 1;
		obj.value = beginYear + i + 1;
		var _data2 = [];
		for (n = 0; n < 12; n++) {
			//月
			var obj2 = {};
			if (n < 9) {
				obj2.value = '0' + (n + 1);
			} else {
				obj2.value = n + 1;
			}
			var _data3 = [];
			if (n == 1) {
				var cond1 = yer % 4 == 0; //条件1：年份必须要能被4整除
				var cond2 = yer % 100 != 0; //条件2：年份不能是整百数
				var cond3 = yer % 400 == 0;
				var cond = cond1 && cond2 || cond3;
				//闰年
				if (cond) {
					for (y = 0; y < 29; y++) {
						//日
						var obj3 = {};
						if (y < 9) {
							obj3.value = '0' + (y + 1);
						} else {
							obj3.value = y + 1;
						}
						_data3.push(obj3)
					}
				} else {
					for (y = 0; y < 28; y++) {
						//日
						var obj3 = {};
						if (y < 9) {
							obj3.value = '0' + (y + 1);
						} else {
							obj3.value = y + 1;
						}
						_data3.push(obj3)
					}
				}
			} else if (n == 0 || n == 2 || n == 4 || n == 6 || n == 7 || n == 9 || n == 11) {
				for (y = 0; y < 31; y++) {
					//日
					var obj3 = {};
					if (y < 9) {
						obj3.value = '0' + (y + 1);
					} else {
						obj3.value = y + 1;
					}
					_data3.push(obj3)
				}
			} else {
				for (y = 0; y < 30; y++) {
					//日
					var obj3 = {};
					if (y < 9) {
						obj3.value = '0' + (y + 1);
					} else {
						obj3.value = y + 1;
					}
					_data3.push(obj3)
				}
			}
			obj2.childs = _data3;
			_data2.push(obj2);
		}
		obj.childs = _data2;
		_data.push(obj)

	}
	return _data
}
// 日期 月份差值
class Months {
	dateInfo(data) {
		let newDate = data.split('-');
		return parseInt(newDate[0]) * 12 + parseInt(newDate[1]) + parseInt(newDate[2]) / 31;
	}
	calculate(bDate, eDate) {
		let result = this.dateInfo(eDate) - this.dateInfo(bDate)
		return result
	}
	getDays(bDate, eDate){
		let days = new Date(eDate).getTime() - new Date(bDate).getTime()
		return Math.ceil(days/1000/60/60/24)
	}
}
let comFun = new Months;
// 提示信息
let tostTime = null

function showTost(text, time = 1000) {
	if (tostTime) {
		clearTimeout(tostTime)
		tostTime = null;
		$('.warn').hide();
	}
	$('.warn').css('display','flex')
	$('.warn>div').text(text)
	tostTime = setTimeout(function() {
		$('.warn').hide();
	}, time)
}
///* 法律费计算 */

function getlawyerfee($cityid, $typeid, $price) {
	console.log(typeof $cityid, $typeid, $price);
	$result = null;
	switch (Number($cityid)) {
		case 1:
			//***********************辽宁*******************************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					不涉及财产关系的，基准收费标准为5000元-30000元/件，上浮不限
					
					(1)10万元以下部分(含10万元)收费比例为8%-10%，收费额不足5000元的每件按5000元收取;
					(2)10万元至50万元部分(含50万元)为7%-9%;
					(3)50万元至l00万元部分(含100万元)为6%-8%;
					(4)100万元至500万元部分(含500万元)为5%-7%;
					(5)500万元至1000万元部分(含1000万元)为4%-6%;
					(6)1000万元至2000万元部分(含2000万元)为3%-5%;
					(7)2000万元至5000万元部分(含5000万元)为2%-4%;
					(8)5000万元以上部分，为1%-3%。
					*/
					if ($price <= 100000) {
						$fee = $price * 0.08;
						$fee1 = $price * 0.1;
					} else if ($price <= 500000) {
						$fee = 8000 + ($price - 100000) * 0.07;
						$fee1 = 10000 + ($price - 100000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 36000 + ($price - 500000) * 0.06;
						$fee1 = 46000 + ($price - 500000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 66000 + ($price - 1000000) * 0.05;
						$fee1 = 86000 + ($price - 1000000) * 0.07;
					} else if ($price <= 10000000) {
						$fee = 266000 + ($price - 5000000) * 0.04;
						$fee1 = 366000 + ($price - 5000000) * 0.06;
					} else if ($price <= 20000000) {
						$fee = 466000 + ($price - 10000000) * 0.03;
						$fee1 = 666000 + ($price - 10000000) * 0.05;
					} else if ($price <= 50000000) {
						$fee = 766000 + ($price - 20000000) * 0.02;
						$fee1 = 116600 + ($price - 20000000) * 0.04;
					} else {
						$fee = 1366000 + ($price - 50000000) * 0.01;
						$fee1 = 1316600 + ($price - 50000000) * 0.03;
					}
					if ($fee1 < 5000) {
						$result = number_format('5000', 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
					}
				} else {
					$result = '5000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '3000',
					'sc': '3000',
					'sp': '4000'
				};
			}
			break;
		case 2:
			//************************天津*********************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					不涉及财产关系的,3000-30000元/件; 
					涉及财产关系的,诉讼(争议)财产标的额,按比例分段累加计算
					10万以下。8%（不足3000元按3000元收取）
					10万-100万 6%
					100万-1000万 4%
					超过1000万 2%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.08;
						if ($lawyerfee < 3000) {
							$lawyerfee = 3000;
						}
					} else if ($price <= 1000000) {
						$lawyerfee = 8000 + ($price - 100000) * 0.06;
					} else if ($price <= 10000000) {
						$lawyerfee = 62000 + ($price - 1000000) * 0.04;
					} else {
						$lawyerfee = 422000 + ($price - 10000000) * 0.02;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '3000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '5000-10000',
					'sc': '5000-10000',
					'sp': '5000-30000'
				};
			}
			break;
		case 3:
			//*************************广东*********************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					在收取1000-8000元基础再按以下加收
					5万元(含5万元)以下：免加收
					5万-10万(含10万元)：8%
					10万-50万(含50万元)：5%
					50万-100万(含100万元)：4%
					100万-500万(含500万元)：3%
					500万-1000万(含1000万元)：2%
					1000万-5000万(含5000万元)：1%
					5000万元以上：0.5%
					*/
					if ($price <= 50000) {
						$fee = 1000;
						$fee1 = 8000;
					} else if ($price <= 100000) {
						$fee = 1000 + ($price - 50000) * 0.08;
						$fee1 = 7000 + $fee;
					} else if ($price <= 500000) {
						$fee = 1000 + 4000 + ($price - 100000) * 0.05;
						$fee1 = 7000 + $fee;
					} else if ($price <= 1000000) {
						$fee = 1000 + 24000 + ($price - 500000) * 0.04;
						$fee1 = 7000 + $fee;
					} else if ($price <= 5000000) {
						$fee = 1000 + 44000 + ($price - 1000000) * 0.03;
						$fee1 = 7000 + $fee;
					} else if ($price <= 10000000) {
						$fee = 1000 + 164000 + ($price - 5000000) * 0.02;
						$fee1 = 7000 + $fee;
					} else if ($price <= 50000000) {
						$fee = 1000 + 264000 + ($price - 10000000) * 0.01;
						$fee1 = 7000 + $fee;
					} else {
						$fee = 1000 + 664000 + ($price - 50000000) * 0.005;
						$fee1 = 7000 + $fee;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					$result = '3000-20000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000—6000',
					'sc': '6000—16000',
					'sp': '6000—33000'
				};
			}
			break;
		case 4:
			//******************广西***************************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					争议标的 收费比例
					10万以下（含10万）费率5%
					每件低于1000元按1000元收取
					10-50万（含50万）费率4.5%
					50-100万（含100万）费率4%
					100-500万（含500万）费率3%
					500-1000万（含1000万）费率2%
					1000万 以上1%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.05;
						if ($lawyerfee < 1000) {
							$lawyerfee = 1000;
						}
					} else if ($price <= 500000) {
						$lawyerfee = 5000 + ($price - 100000) * 0.045;
					} else if ($price <= 1000000) {
						$lawyerfee = 23000 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$lawyerfee = 43000 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$lawyerfee = 163000 + ($price - 5000000) * 0.02;
					} else {
						$lawyerfee = 263000 + ($price - 10000000) * 0.01;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '1000-10000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000-15000',
					'sc': '2000-15000',
					'sp': '2000-150000'
				};
			}
			break;
		case 5:
			//**********************北京********************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万元(含)以下：10%，(最低收费3000元），
					10万—100万元(含100万元)：6%，
					100万—1000万元(含1000万元)：4%，
					1000万元以上：2%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.1;
						if ($lawyerfee < 3000) {
							$lawyerfee = 3000;
						}
					} else if ($price <= 1000000) {
						$lawyerfee = 10000 + ($price - 100000) * 0.06;
					} else if ($price <= 10000000) {
						$lawyerfee = 64000 + ($price - 1000000) * 0.04;
					} else {
						$lawyerfee = 424000 + ($price - 10000000) * 0.02;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '3000-10000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000—15000',
					'sc': '2000—15000',
					'sp': '4000—45000'
				};
				//$result = {'zc':'2000—10000','sc':'2000—10000','sp':'4000—30000'};//文档
			}
			break;
		case 6:
			//**********************河南*********************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					民事案件 不涉及财产每件收费 2000-10000
					10以下（含10万）3000-5000
					10-100万（含100万）3-5%
					100-1000万（含1000万）2-4%
					1000-5000万（含5000万）1-3%
					5000万元以上 0.5-2%
					*/
					if ($price <= 100000) {
						$fee = 3000;
						$fee1 = 5000;
					} else if ($price <= 1000000) {
						$fee = 3000 + ($price - 100000) * 0.03;
						$fee1 = 5000 + ($price - 100000) * 0.05;
					} else if ($price <= 10000000) {
						$fee = 3000 + 27000 + ($price - 1000000) * 0.02;
						$fee1 = 5000 + 45000 + ($price - 1000000) * 0.04;
					} else if ($price <= 50000000) {
						$fee = 3000 + 207000 + ($price - 10000000) * 0.01;
						$fee1 = 3000 + 405000 + ($price - 10000000) * 0.03;
					} else {
						$fee = 3000 + 607000 + ($price - 50000000) * 0.005;
						$fee1 = 3000 + 1605000 + ($price - 50000000) * 0.02;
					}

					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					if ($typeid == 1) {
						$result = '2000-10000';
					} else if ($typeid == 3) {
						$result = '3000-20000';
					}
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '3000-15000',
					'sc': '5000-20000',
					'sp': '5000-30000'
				};
			}
			break;
		case 7:
			//*****************山西*************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下（含10万）6%，低于2000元，按照2000元收费
					10-50万，5%
					50-100万，4%
					100-500万，3%
					500-1000万，2%
					1000-5000万，1.5%
					5000万元以上 ，1%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.06;
						if ($lawyerfee < 2000) {
							$lawyerfee = 2000;
						}
					} else if ($price <= 500000) {
						$lawyerfee = 6000 + ($price - 100000) * 0.05;
					} else if ($price <= 1000000) {
						$lawyerfee = 26000 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$lawyerfee = 46000 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$lawyerfee = 166000 + ($price - 5000000) * 0.02;
					} else if ($price <= 50000000) {
						$lawyerfee = 266000 + ($price - 10000000) * 0.015;
					} else {
						$lawyerfee = 866000 + ($price - 50000000) * 0.01;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '2000-20000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000—20000',
					'sc': '2000—20000',
					'sp': '3500—35000'
				};
			}
			break;
		case 8:
			//******************河北**************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万元(含)以下：8%，不足3000元的按3000元收取，
					10万—100万元(含100万元)：6%，
					100万—1000万元(含1000万元)：4%，
					1000万元以上：2%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.08;
						if ($lawyerfee < 3000) {
							$lawyerfee = 3000;
						}
					} else if ($price <= 1000000) {
						$lawyerfee = 8000 + ($price - 100000) * 0.06;
					} else if ($price <= 10000000) {
						$lawyerfee = 62000 + ($price - 1000000) * 0.04;
					} else {
						$lawyerfee = 422000 + ($price - 10000000) * 0.02;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '3000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000—6000',
					'sc': '3000—9000',
					'sp': '4000—12000'
				};
			}
			break;
		case 9:
			//*****************吉林**************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下（含10万），8-10%，不足5000 按5000
					10-50万（含50万），7-9%
					50-100万（含100万），6-8%
					100-500万（含500万），5-7%
					500-1000万（含1000万），4-6%
					1000-2000万（含2000万），3-5%
					2000-5000万（含5000万），2-4%
					5000万元以上，1-3%
					*/
					if ($price <= 100000) {
						$fee = $price * 0.08;
						$fee1 = $price * 0.1;
					} else if ($price <= 500000) {
						$fee = 8000 + ($price - 100000) * 0.07;
						$fee1 = 10000 + ($price - 100000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 36000 + ($price - 500000) * 0.06;
						$fee1 = 46000 + ($price - 500000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 66000 + ($price - 1000000) * 0.05;
						$fee1 = 86000 + ($price - 1000000) * 0.07;
					} else if ($price <= 10000000) {
						$fee = 266000 + ($price - 5000000) * 0.04;
						$fee1 = 366000 + ($price - 5000000) * 0.06;
					} else if ($price <= 20000000) {
						$fee = 466000 + ($price - 10000000) * 0.03;
						$fee1 = 666000 + ($price - 10000000) * 0.05;
					} else if ($price <= 50000000) {
						$fee = 766000 + ($price - 20000000) * 0.02;
						$fee1 = 116600 + ($price - 20000000) * 0.04;
					} else {
						$fee = 1366000 + ($price - 50000000) * 0.01;
						$fee1 = 1316600 + ($price - 50000000) * 0.03;
					}
					if ($fee1 < 5000) {
						$result = number_format(5000, 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					}
				} else {
					$result = '5000-20000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000',
					'sc': '3000',
					'sp': '5000'
				};
			}
			break;
		case 10:
			//***********************福建**************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					基础律师服务费5000-30000
					10-100万(不含100万)5-10%
					100-500万（不含500万）3-8%
					500-1000万（不含1000万）1.5-6%
					1000-5000万（不含5000万）0.75-3%
					5000万-1亿（不含1亿）0.5-1.5%
					1亿以上 0.25-1%
					*/
					if ($price < 100000) {
						$fee = 5000;
						$fee1 = 30000;
					} else if ($price < 1000000) {
						$fee = ($price - 100000) * 0.05 + 5000;
						$fee1 = ($price - 100000) * 0.1 + 30000;
					} else if ($price < 5000000) {
						$fee = 50000 + ($price - 1000000) * 0.03 + 5000 - 5000;
						$fee1 = 90000 + ($price - 1000000) * 0.08 + 30000;
					} else if ($price < 10000000) {
						$fee = 170000 + ($price - 5000000) * 0.015 + 5000 - 5000;
						$fee1 = 410000 + ($price - 5000000) * 0.06 + 30000;
					} else if ($price < 50000000) {
						$fee = 245000 + ($price - 10000000) * 0.0075 + 5000 - 5000;
						$fee1 = 710000 + ($price - 10000000) * 0.03 + 30000;
					} else if ($price < 100000000) {
						$fee = 545000 + ($price - 50000000) * 0.005 + 5000 - 5000;
						$fee1 = 1910000 + ($price - 50000000) * 0.015 + 30000;
					} else {
						$fee = 795000 + ($price - 100000000) * 0.0025 + 5000 - 5000;
						$fee1 = 2660000 + ($price - 100000000) * 0.01 + 30000;
					}

					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');

				} else {
					$result = '5000-50000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '双方协商',
					'sc': '双方协商',
					'sp': '双方协商'
				};
			}
			break;
		case 11:
			//******************内蒙古****************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					1万以下，1000元以上
					1-10万（含10万），6-5%
					10-50万（含50万），5-4%
					50-100万（含100万）,4-3%
					100-500万（含500万），3-2%
					500-1000万（含1000万），2-1%
					1000-5000万（含5000万），1-0.5%
					5000万以上，0.5%
					*/
					if ($price <= 10000) {
						$fee = 1000;
						$fee1 = 1000;
					} else if ($price <= 100000) {
						$fee = 1000 + ($price - 10000) * 0.05;
						$fee1 = 1000 + ($price - 10000) * 0.06;
					} else if ($price <= 500000) {
						$fee = 5500 + ($price - 100000) * 0.04;
						$fee1 = 6400 + ($price - 100000) * 0.05;
					} else if ($price <= 1000000) {
						$fee = 21500 + ($price - 500000) * 0.03;
						$fee1 = 26400 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$fee = 36500 + ($price - 1000000) * 0.02;
						$fee1 = 46400 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$fee = 116500 + ($price - 5000000) * 0.01;
						$fee1 = 166400 + ($price - 5000000) * 0.02;
					} else if ($price <= 50000000) {
						$fee = 166500 + ($price - 10000000) * 0.005;
						$fee1 = 266400 + ($price - 10000000) * 0.01;
					} else {
						$fee = 366500 + ($price - 50000000) * 0.005;
						$fee1 = 666400 + ($price - 50000000) * 0.005;
					}
					if ($fee == 1000 && $fee1 == 1000) {
						$result = number_format($fee, 2, '.', '') +
							'以上';
					} else {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					}
				} else {
					$result = '1000-5000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-5000',
					'sc': '500-5000',
					'sp': '1000-20000'
				};
			}
			break;
		case 12:
			//******************上海******************
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万元以下(含10万元)部分收费比例为8%-12%，收费不足3000元的，可按3000元收取;
					10万元以上至100万元(含100万元)部分收费比例为5%-7%;
					100万元以上至1000万元(含1000万元)部分收费比例为3%-5%;
					1000万元以上至1亿元(含1亿元)部分收费比例为1%-3%;
					1亿元以上部分收费比例为0.5%-1%。
					*/
					if ($price <= 100000) {
						$fee = $price * 0.08;
						if ($fee < 3000) {
							$fee = 3000;
							$fee1 = 0;
						} else {
							$fee1 = $price * 0.12;
						}
					} else if ($price <= 1000000) {
						$fee = 8000 + ($price - 100000) * 0.05;
						$fee1 = 12000 + ($price - 100000) * 0.07;

					} else if ($price <= 10000000) {
						$fee = 53000 + ($price - 1000000) * 0.03;
						$fee1 = 75000 + ($price - 1000000) * 0.05;
					} else if ($price <= 100000000) {
						$fee = 323000 + ($price - 10000000) * 0.01;
						$fee1 = 525000 + ($price - 10000000) * 0.03;
					} else {
						$fee = 1223000 + ($price - 100000000) * 0.005;
						$fee1 = 3225000 + ($price - 100000000) * 0.01;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '');
					}
				} else {
					$result = '3000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1500-10000',
					'sc': '2000-10000',
					'sp': '3000-30000'
				};
			}
			break;
		case 13:
			//***************江苏*************
			if ($typeid == 1 || $typeid == 3) {
				if ($price && $price > 10000) {
					/*
					不足1万，按民事不涉及财产标准执行
					大于1万小于10万（含10万）6-7%
					50万（含）5-6%
					100万（含）4-5%
					500万（含）3-4%
					1000万（含）2-3%
					1亿（含）1-2%
					1亿以上0.5-1%
					
					//百度算法
					1万以下  2500
					1-10   4-7%   4%+2100   7%+1800
					10-50   3-6%   3%+3100   6%+2800
					50-100   2.5-5%   2.5%+5600   5%+7800
					100-500   2-4%   2%+10600   4%+17800
					500-1000   1.5-3%   1.5%+35600   3%+67800
					1000-1亿   0.7-2%   0.7%+115600   2%+167800
					1亿以上    0.5%    0.5+315600  0.5+1667800
					*/
					/*
					if($price <= 100000){
					    $fee = 2100 + ($price-10000) * 0.04;
					    $fee1 = 1800 + ($price-10000) * 0.07;
					}else if($price <= 500000){
					    $fee = 3100 + ($price-100000) * 0.03;
					    $fee1 = 2800 + ($price-100000) * 0.06;
					}else if($price <= 1000000){
					    $fee = 5600 + ($price-500000) * 0.025;
					    $fee1 = 7800 + ($price-500000) * 0.04;
					}else{
					    $fee =  + ($price) * 0.05;
					    $fee1 =  + ($price) * 0.06;
					}
					*/

					if ($price <= 100000) {
						$fee = 2500 + ($price - 10000) * 0.06;
						$fee1 = 10000 + ($price - 10000) * 0.07;
					} else if ($price <= 500000) {
						$fee = 2500 + 5400 + ($price - 100000) * 0.05;
						$fee1 = 10000 + 6300 + ($price - 100000) * 0.06;
					} else if ($price <= 1000000) {
						$fee = 2500 + 24500 + ($price - 500000) * 0.04;
						$fee1 = 10000 + 29400 + ($price - 500000) * 0.05;
					} else if ($price <= 5000000) {
						$fee = 2500 + 39600 + ($price - 1000000) * 0.03;
						$fee1 = 10000 + 49500 + ($price - 1000000) * 0.04;
					} else if ($price <= 10000000) {
						$fee = 2500 + 147000 + ($price - 5000000) * 0.02;
						$fee1 = 10000 + 196000 + ($price - 5000000) * 0.03;
					} else if ($price <= 100000000) {
						$fee = 2500 + 199800 + ($price - 10000000) * 0.01;
						$fee1 = 10000 + 299700 + ($price - 10000000) * 0.02;
					} else {
						$fee = 2500 + 999900 + ($price - 100000000) * 0.005;
						$fee1 = 10000 + 1999800 + ($price - 100000000) * 0.01;
					}
					/*
					500万（含）3-4%
					1000万（含）2-3%
					1亿（含）1-2%
					1亿以上0.5-1%
					 */
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					$result = '2500-10000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-8000',
					'sc': '1500-10000',
					'sp': '3000-20000'
				};
			}
			break;
		case 14:
			//浙江
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万元以下(含10万元)部分收费比例为4.8%-6.4%，最低1500元的
					10-50 4-4.8
					50-100 3.2-4
					100-500 2.4-3.2
					500-1000 1.6-2.4
					1000 0.8-1.6
					*/
					if ($price <= 100000) {
						$fee = 1500 + $price * 0.048;
						if ($fee < 1500) {
							$fee = 1500;
							$fee1 = 0;
						} else {
							$fee1 = 1500 + $price * 0.064;
						}
					} else if ($price <= 500000) {
						$fee = 4800 + ($price - 100000) * 0.04;
						$fee1 = 6400 + ($price - 100000) * 0.048;

					} else if ($price <= 1000000) {
						$fee = 24800 + ($price - 500000) * 0.032;
						$fee1 = 30400 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$fee = 40800 + ($price - 1000000) * 0.024;
						$fee1 = 50400 + ($price - 1000000) * 0.032;
					} else if ($price <= 10000000) {
						$fee = 136800 + ($price - 5000000) * 0.016;
						$fee1 = 178400 + ($price - 5000000) * 0.024;
					} else {
						$fee = 296800 + ($price - 10000000) * 0.008;
						$fee1 = 418400 + ($price - 10000000) * 0.016;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '');
					}
				} else {
					$result = '2500-10000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1500-8000',
					'sc': '1500-10000',
					'sp': '2500-25000'
				};
			}
			break;
		case 15:
			//安徽
			if ($typeid == 1 || $typeid == 3) {
				if ($price && $price > 100000) {
					/*
					10万元以下(含10万元)1000-8000
					10-50 4-6 
					50-100 3-5
					100-500 2-4
					500-1000 1-3
					1000  1-2
					*/
					if ($price <= 500000) {
						$fee = 1000 + ($price - 100000) * 0.04;
						$fee1 = 8000 + ($price - 100000) * 0.06;
					} else if ($price <= 1000000) {
						$fee = 17000 + ($price - 500000) * 0.03;
						$fee1 = 32000 + ($price - 500000) * 0.05;
					} else if ($price <= 5000000) {
						$fee = 32000 + ($price - 1000000) * 0.02;
						$fee1 = 57000 + ($price - 1000000) * 0.04;
					} else if ($price <= 10000000) {
						$fee = 112000 + ($price - 5000000) * 0.01;
						$fee1 = 217000 + ($price - 5000000) * 0.03;
					} else {
						$fee = 162000 + ($price - 10000000) * 0.01;
						$fee1 = 367000 + ($price - 10000000) * 0.02;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '');
					}
				} else {
					$result = '1000-8000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1200-8000',
					'sc': '1200-8000',
					'sp': '1200-15000'
				};
			}

			break;
		case 16:
			//江西
			if ($typeid == 1 || $typeid == 3) {
				if ($price && $price > 50000) {
					/*
					5万免收
					5-10 1.5-5
					10-100 1.2-4
					100-500 1-3
					500-1000 0.5-2
					1000-5000 0.2-1.5
					5000+ 0.11
					*/
					if ($price <= 100000) {
						$fee = 1000 + ($price - 50000) * 0.015;
						$fee1 = 6000 + ($price - 50000) * 0.05;
					} else if ($price <= 1000000) {
						$fee = 1750 + ($price - 100000) * 0.012;
						$fee1 = 8500 + ($price - 100000) * 0.04;
					} else if ($price <= 5000000) {
						$fee = 12550 + ($price - 1000000) * 0.01;
						$fee1 = 44500 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$fee = 52550 + ($price - 5000000) * 0.005;
						$fee1 = 164500 + ($price - 5000000) * 0.02;
					} else if ($price <= 50000000) {
						$fee = 77550 + ($price - 10000000) * 0.002;
						$fee1 = 264500 + ($price - 10000000) * 0.015;
					} else {
						$fee = 157550 + ($price - 50000000) * 0.0011;
						$fee1 = 864500 + ($price - 50000000) * 0.0011;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = number_format($fee, 2, '.', '');
					}
				} else {
					$result = '1000-6000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '800-5000',
					'sc': '800-5000',
					'sp': '1600-15000'
				};
			}
			break;
		case 17:
			//山东
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					基础：2500-3000
					1-10 6-9
					10-50 5-6
					50-100 4-5
					100-500 3-4
					500以上 由律师事务所和委托人协商确定
					*/
					if ($price <= 100000) {
						$fee = 2500;
						$fee1 = 3000;
					} else if ($price <= 100000) {
						$fee = 2500 + ($price - 10000) * 0.06;
						$fee1 = 3000 + ($price - 10000) * 0.09;
					} else if ($price <= 500000) {
						$fee = 7900 + ($price - 100000) * 0.05;
						$fee1 = 11100 + ($price - 100000) * 0.06;
					} else if ($price <= 1000000) {
						$fee = 27900 + ($price - 500000) * 0.04;
						$fee1 = 35100 + ($price - 500000) * 0.05;
					} else if ($price <= 5000000) {
						$fee = 47900 + ($price - 1000000) * 0.03;
						$fee1 = 60100 + ($price - 1000000) * 0.04;
					} else {
						$fee = '由律师事务所和委托人协商确定';
						$fee1 = 0;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = $fee;
					}
				} else {
					$result = '2500-12000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '300-10000',
					'sc': '1500-12000',
					'sp': '2000-20000'
				};
			}
			break;
		case 18:
			//湖北
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10-100 1-5
					100-500 0.5-3
					500-1000 0.3-2
					1000-5000 0.2-1.5
					5000 0.1-1
					*/
					if ($price <= 100000) {
						$fee = 600;
						$fee1 = 8000;
					} else if ($price <= 1000000) {
						$fee = 600 + ($price - 100000) * 0.01;
						$fee1 = 8000 + ($price - 100000) * 0.05;
					} else if ($price <= 5000000) {
						$fee = 9600 + ($price - 1000000) * 0.005;
						$fee1 = 53000 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$fee = 29600 + ($price - 5000000) * 0.003;
						$fee1 = 173000 + ($price - 5000000) * 0.02;
					} else if ($price <= 50000000) {
						$fee = 44600 + ($price - 10000000) * 0.002;
						$fee1 = 273000 + ($price - 10000000) * 0.015;
					} else {
						$fee = 124600 + ($price - 50000000) * 0.001;
						$fee1 = 873000 + ($price - 50000000) * 0.01;
					}
					if ($fee1 > 0) {
						$result = number_format($fee, 2, '.', '') +
							'-' + number_format($fee1, 2, '.', '');
					} else {
						$result = $fee;
					}
				} else {
					$result = '600-8000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-10000',
					'sc': '1000-10000',
					'sp': '1000-15000'
				};
			}
			break;
		case 19:
			//湖南
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下 3000-10000
					10-50 6-8
					50-500 4-6
					500-2000 2-4
					2000-1亿 1-2
					1亿以上 0.5-1
					*/
					if ($price <= 100000) {
						$fee = 3000;
						$fee1 = 10000;
					} else if ($price <= 500000) {
						$fee = 3000 + ($price - 100000) * 0.06;
						$fee1 = 10000 + ($price - 100000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 27000 + ($price - 500000) * 0.04;
						$fee1 = 42000 + ($price - 500000) * 0.06;
					} else if ($price <= 20000000) {
						$fee = 207000 + ($price - 5000000) * 0.02;
						$fee1 = 312000 + ($price - 5000000) * 0.04;
					} else if ($price <= 100000000) {
						$fee = 507000 + ($price - 20000000) * 0.01;
						$fee1 = 912000 + ($price - 20000000) * 0.02;
					} else {
						$fee = 1307000 + ($price - 100000000) * 0.005;
						$fee1 = 2512000 + ($price - 100000000) * 0.01;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					$result = '3000-20000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-10000',
					'sc': '1000-10000',
					'sp': '2000-20000'
				};
			}
			break;
		case 20:
			//海南
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下 7% 不足2000 按2000收取
					10-50万 6%
					50-100万 5%
					100-500万 4%
					500-1000 3%
					1000-5000 2%
					5000-1亿 1%
					1亿以上 0.5%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.07;
						if ($lawyerfee < 2000) {
							$lawyerfee = 2000;
						}
					} else if ($price <= 500000) {
						$lawyerfee = 7000 + ($price - 100000) * 0.06;
					} else if ($price <= 1000000) {
						$lawyerfee = 31000 + ($price - 500000) * 0.05;
					} else if ($price <= 5000000) {
						$lawyerfee = 56000 + ($price - 1000000) * 0.04;
					} else if ($price <= 10000000) {
						$lawyerfee = 216000 + ($price - 5000000) * 0.03;
					} else if ($price <= 50000000) {
						$lawyerfee = 366000 + ($price - 10000000) * 0.02;
					} else if ($price <= 100000000) {
						$lawyerfee = 1166000 + ($price - 50000000) * 0.01;
					} else {
						$lawyerfee = 1666000 + ($price - 100000000) * 0.005;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '2000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000-20000',
					'sc': '2000-20000',
					'sp': '2000-50000',
				};
			}
			break;
		case 21:
			//黑龙江
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					2万以下 800
					2-10 4%
					10-50 3
					50-100 2 
					100-500 1
					500-1000 0.5
					1000-5000 0.25
					5000以上 双方协定
					*/
					if ($price <= 20000) {
						$lawyerfee = 800;
					} else if ($price <= 100000) {
						$lawyerfee = +($price - 20000) * 0.04;
					} else if ($price <= 500000) {
						$lawyerfee = +($price - 100000) * 0.03;
					} else if ($price <= 1000000) {
						$lawyerfee = +($price - 500000) * 0.02;
					} else if ($price <= 5000000) {
						$lawyerfee = +($price - 1000000) * 0.01;
					} else if ($price <= 10000000) {
						$lawyerfee = +($price - 5000000) * 0.05;
					} else if ($price <= 50000000) {
						$lawyerfee = +($price - 10000000) * 0.0025;
					} else {
						$lawyerfee = +($price - 100000000) * 0.005;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '2500';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1500',
					'sc': '2000',
					'sp': '3000'
				};
			}
			break;
		case 22:
			//重庆
			if ($typeid == 1) {
				if ($price) {

				} else {
					$result = '';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000-10000',
					'sc': '2000-10000',
					'sp': '3000-30000'
				};
			} else if ($typeid == 3) {
				if ($price) {

				} else {
					$result = {
						'yb': '2000-10000'
					};
				}
			}
			break;
		case 23:
			//四川【特殊案件】
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下 8-10 最低5000
					10-50 7-9
					50-100 6-8
					100-500 5-7
					500-1000 4-6
					1000-2000 3-5
					2000-5000 2-4
					5000 1-3
					 */
					if ($price <= 100000) {
						$fee = $price * 0.08;
						$fee1 = $price * 0.1;
					} else if ($price <= 500000) {
						$fee = 8000 + ($price - 100000) * 0.07;
						$fee1 = 10000 + ($price - 100000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 36000 + ($price - 500000) * 0.06;
						$fee1 = 46000 + ($price - 500000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 66000 + ($price - 1000000) * 0.05;
						$fee1 = 86000 + ($price - 1000000) * 0.07;
					} else if ($price <= 10000000) {
						$fee = 266000 + ($price - 5000000) * 0.04;
						$fee1 = 366000 + ($price - 5000000) * 0.06;
					} else if ($price <= 20000000) {
						$fee = 466000 + ($price - 10000000) * 0.03;
						$fee1 = 666000 + ($price - 10000000) * 0.05;
					} else if ($price <= 50000000) {
						$fee = 766000 + ($price - 20000000) * 0.02;
						$fee1 = 1166000 + ($price - 20000000) * 0.04;
					} else {
						$fee = 1366000 + ($price - 50000000) * 0.01;
						$fee1 = 2366000 + ($price - 50000000) * 0.03;
					}

					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
					if ($fee1 < 5000) {
						$result = number_format(5000, 2, '.', '');
					}
				} else {
					$result = {
						'yb': '5000-30000',
						'ts': '1000-10000'
					};
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000-15000',
					'sc': '2000-12000',
					'sp': '3000-30000'
				};
			}
			break;
		case 24:
			//贵州
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					1万以下 不低于6000
					1-10 7
					10-50 6
					50-100 5
					100-500 4
					500-1000 3
					1000-2000 2
					2000以上 1
					*/
					if ($price <= 10000) {
						$result = '不低于 6000.00';
						break;
					} else if ($price <= 100000) {
						$lawyerfee = 6000 + ($price - 10000) * 0.07;
					} else if ($price <= 500000) {
						$lawyerfee = 12300 + ($price - 100000) * 0.06;
					} else if ($price <= 1000000) {
						$lawyerfee = 36300 + ($price - 500000) * 0.05;
					} else if ($price <= 5000000) {
						$lawyerfee = 61300 + ($price - 1000000) * 0.04;
					} else if ($price <= 10000000) {
						$lawyerfee = 221300 + ($price - 5000000) * 0.03;
					} else if ($price <= 20000000) {
						$lawyerfee = 371300 + ($price - 10000000) * 0.02;
					} else {
						$lawyerfee = 571300 + ($price - 20000000) * 0.01;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '6000.00';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '6000-33000',
					'sc': '7000-36000',
					'sp': '8000-50000'
				};
			}
			break;
		case 25:
			//云南
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下 5%  不低于5000
					10-50  4.2
					50-100 4
					100-500 3
					500-1000 2
					1000-2000 1.2
					2000-5000 1
					5000以上 0.5
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.05;
						if ($lawyerfee < 5000) {
							$lawyerfee = 5000;
						}
					} else if ($price <= 500000) {
						$lawyerfee = 5000 + ($price - 100000) * 0.042;
					} else if ($price <= 1000000) {
						$lawyerfee = 21800 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$lawyerfee = 41800 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$lawyerfee = 161800 + ($price - 5000000) * 0.02;
					} else if ($price <= 20000000) {
						$lawyerfee = 261800 + ($price - 10000000) * 0.012;
					} else if ($price <= 50000000) {
						$lawyerfee = 381800 + ($price - 20000000) * 0.01;
					} else {
						$lawyerfee = 681800 + ($price - 50000000) * 0.005;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '5000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '3000',
					'sc': '4000',
					'sp': '20000'
				};
			}
			break;
		case 26:
			//西藏--【特殊结果】
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下   5-6
					10-100 4-5
					100-500 3-4
					500-1000 2-3
					1000-5000 1-2
					5000以上 0.5-1
					*/
					if ($price <= 100000) {
						$fee = $price * 0.05;
						$fee1 = $price * 0.06;
					} else if ($price <= 1000000) {
						$fee = 5000 + ($price - 100000) * 0.04;
						$fee1 = 6000 + ($price - 100000) * 0.05;
					} else if ($price <= 5000000) {
						$fee = 41000 + ($price - 1000000) * 0.03;
						$fee1 = 51000 + ($price - 1000000) * 0.04;
					} else if ($price <= 10000000) {
						$fee = 161000 + ($price - 5000000) * 0.02;
						$fee1 = 211000 + ($price - 5000000) * 0.03;
					} else if ($price <= 50000000) {
						$fee = 261000 + ($price - 10000000) * 0.01;
						$fee1 = 361000 + ($price - 10000000) * 0.02;
					} else {
						$fee = 661000 + ($price - 50000000) * 0.005;
						$fee1 = 1361000 + ($price - 50000000) * 0.01;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
					if ($fee1 < 2000) {
						$result = number_format(2000, 2, '.', '');
					}
				} else {
					$result = '2000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000-10000',
					'sc': '2000-15000',
					'sp': '',
					'bg': '5000-25000',
					'yg': '2000-20000'
				};
			}
			break;
		case 27:
			//陕西
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					1万以下 不低于1000
					1-50 5
					50-100 4
					100-500 3
					500-1000 2
					1000-5000 1
					5000以上 0.5
					*/
					if ($price <= 10000) {
						$lawyerfee = 1000;
					} else if ($price <= 500000) {
						$lawyerfee = 1000 + ($price - 10000) * 0.05;
					} else if ($price <= 1000000) {
						$lawyerfee = 25500 + ($price - 500000) * 0.04;
					} else if ($price <= 5000000) {
						$lawyerfee = 45500 + ($price - 1000000) * 0.03;
					} else if ($price <= 10000000) {
						$lawyerfee = 165500 + ($price - 5000000) * 0.02;
					} else if ($price <= 50000000) {
						$lawyerfee = 265500 + ($price - 10000000) * 0.01;
					} else {
						$lawyerfee = 665500 + ($price - 50000000) * 0.005;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '500-5000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '500-5000',
					'sc': '1000-5000',
					'sp': '1000-10000'
				};
			}
			break;
		case 28:
			//甘肃
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万以下 8-10  不足3000 按3000
					10-50  7-9
					50-100 6-8
					100-500 5-7
					500-1000 4-6
					1000-5000 3-5
					5000-1亿 2-4
					1亿以上 1-2
					*/
					if ($price <= 100000) {
						$fee = $price * 0.08;
						$fee1 = $price * 0.1;
					} else if ($price <= 500000) {
						$fee = 8000 + ($price - 100000) * 0.07;
						$fee1 = 10000 + ($price - 100000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 36000 + ($price - 500000) * 0.06;
						$fee1 = 46000 + ($price - 500000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 66000 + ($price - 1000000) * 0.05;
						$fee1 = 86000 + ($price - 1000000) * 0.07;
					} else if ($price <= 10000000) {
						$fee = 266000 + ($price - 5000000) * 0.04;
						$fee1 = 366000 + ($price - 5000000) * 0.06;
					} else if ($price <= 50000000) {
						$fee = 466000 + ($price - 10000000) * 0.03;
						$fee1 = 666000 + ($price - 10000000) * 0.05;
					} else if ($price <= 100000000) {
						$fee = 1666000 + ($price - 50000000) * 0.02;
						$fee1 = 2666000 + ($price - 50000000) * 0.04;
					} else {
						$fee = 2666000 + ($price - 100000000) * 0.01;
						$fee1 = 4666000 + ($price - 100000000) * 0.02;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
					if ($fee1 < 3000) {
						$result = number_format(3000, 2, '.', '');
					}
				} else {
					$result = '5000-50000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '800-3000',
					'sc': '800-5000',
					'sp': '1000-6000'
				};
			}
			break;
		case 29:
			//青海
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10 500-5000
					10-50 4.5
					50-100 3.5
					100-500 2.5 
					500-1000 1.5
					10000 1
					*/
					if ($price <= 100000) {
						$fee = 500;
						$fee1 = 5000;
					} else if ($price <= 500000) {
						$fee = 500 + ($price - 100000) * 0.045;
						$fee1 = 5000 + ($price - 100000) * 0.045;
					} else if ($price <= 1000000) {
						$fee = 500 + 18000 + ($price - 500000) * 0.035;
						$fee1 = 5000 + 18000 + ($price - 500000) * 0.035;
					} else if ($price <= 5000000) {
						$fee = +($price - 1000000) * 0.025;
						$fee1 = +($price - 1000000) * 0.025;
					} else if ($price <= 10000000) {
						$fee = +($price - 5000000) * 0.015;
						$fee1 = +($price - 5000000) * 0.015;
					} else {
						$fee = +($price - 10000000) * 0.01;
						$fee1 = +($price - 10000000) * 0.01;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					$result = '500-5000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '300-1000',
					'sc': '800-2000',
					'sp': '1000-6000'
				};
			}
			break;
		case 30:
			//新疆
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					1万以下 500-800
					1-10 5 +300
					10-50 4 +1300
					50-100 3 +6300
					100-500 2 +16300
					500-1000 1 66300
					1000 0.5 +116300
					*/
					if ($price <= 10000) {
						$result = '500-800';
						break;
					} else if ($price <= 100000) {
						$lawyerfee = 500 + 300 + ($price - 10000) * 0.05;
					} else if ($price <= 500000) {
						$lawyerfee = 5300 + ($price - 100000) * 0.04;
					} else if ($price <= 1000000) {
						$lawyerfee = 21300 + ($price - 500000) * 0.03;
					} else if ($price <= 5000000) {
						$lawyerfee = 36300 + ($price - 1000000) * 0.02;
					} else if ($price <= 10000000) {
						$lawyerfee = 116300 + ($price - 5000000) * 0.01;
					} else {
						$lawyerfee = 166300 + ($price - 10000000) * 0.005;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '500-4000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-3000',
					'sc': '2000-4000',
					'sp': '3000-10000'
				};
			}

			break;
		case 31:
			//宁夏
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					1万以下 1000-3000
					1-10 8-9
					10-100 6-8
					100-500 4-6
					500-1000 2-4
					1000-5000 1-2
					5000以上 0.5-1
					*/
					if ($price <= 10000) {
						$fee = 1000;
						$fee1 = 3000;
					} else if ($price <= 100000) {
						$fee = 1000 + ($price - 10000) * 0.08;
						$fee1 = 3000 + ($price - 10000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 8200 + ($price - 100000) * 0.06;
						$fee1 = 11100 + ($price - 100000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 62200 + ($price - 1000000) * 0.04;
						$fee1 = 83100 + ($price - 1000000) * 0.06;
					} else if ($price <= 10000000) {
						$fee = 222200 + ($price - 5000000) * 0.02;
						$fee1 = 323100 + ($price - 5000000) * 0.04;
					} else if ($price <= 50000000) {
						$fee = 322200 + ($price - 10000000) * 0.01;
						$fee1 = 523100 + ($price - 10000000) * 0.02;
					} else {
						$fee = 722200 + ($price - 50000000) * 0.005;
						$fee1 = 1323100 + ($price - 50000000) * 0.01;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');
				} else {
					$result = '1000-20000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '1000-3000',
					'sc': '1000-4000',
					'sp': '2000-6000'
				};
			}
			break;
		case 32:
			// 西安
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					if ($price <= 100000) {
						$fee = $price * 0.08;
						$fee1 = $price * 0.1;
						break;
					} else if ($price <= 500000) {
						$fee = 8000 + ($price - 100000) * 0.07;
						$fee1 = 10000 + ($price - 100000) * 0.09;
					} else if ($price <= 1000000) {
						$fee = 36000 + ($price - 500000) * 0.06;
						$fee1 = 46000 + ($price - 500000) * 0.08;
					} else if ($price <= 5000000) {
						$fee = 66000 + ($price - 1000000) * 0.05;
						$fee1 = 86000 + ($price - 1000000) * 0.07;
					} else if ($price <= 10000000) {
						$fee = 266000 + ($price - 5000000) * 0.04;
						$fee1 = 366000 + ($price - 5000000) * 0.06;
					} else if ($price <= 50000000) {
						$fee = 466000 + ($price - 10000000) * 0.03;
						$fee1 = 666000 + ($price - 10000000) * 0.05;
					} else {
						$fee = 1866000 + ($price - 50000000) * 0.02;
						$fee1 = 2666000 + ($price - 50000000) * 0.04;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');

					if ($fee1 < 5000) {
						$result = 5000
					}
				} else {
					$result = '500-5000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '500-5000',
					'sc': '1000-5000',
					'sp': '1000-10000'
				};
			}
			break;
		case 33:
			// 福州市
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					if ($price <= 100000) {
						$fee = 5000;
						$fee1 = 30000;
						break;
					} else if ($price <= 1000000) {
						$fee = 5000 + ($price - 100000) * 0.05;
						$fee1 = 30000 + ($price - 100000) * 0.1;
					} else if ($price <= 5000000) {
						$fee = 50000 + ($price - 1000000) * 0.03;
						$fee1 = 120000 + ($price - 1000000) * 0.08;
					} else if ($price <= 10000000) {
						$fee = 170000 + ($price - 5000000) * 0.015;
						$fee1 = 440000 + ($price - 5000000) * 0.06;
					} else if ($price <= 50000000) {
						$fee = 245000 + ($price - 10000000) * 0.0075;
						$fee1 = 740000 + ($price - 10000000) * 0.03;
					} else if ($price <= 100000000) {
						$fee = 545000 + ($price - 50000000) * 0.005;
						$fee1 = 1940000 + ($price - 50000000) * 0.015;
					} else {
						$fee = 795000 + ($price - 100000000) * 0.0025;
						$fee1 = 2690000 + ($price - 100000000) * 0.01;
					}
					$result = number_format($fee, 2, '.', '') + '-' + number_format($fee1, 2, '.', '');

					if ($fee1 < 5000) {
						$result = 5000
					}
				} else {
					$result = '5000-50000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '500-5000',
					'sc': '1000-5000',
					'sp': '1000-10000'
				};
			}
			break;
		default:
			//默认****河北****
			if ($typeid == 1 || $typeid == 3) {
				if ($price) {
					/*
					10万元(含)以下：8%，不足3000元的按3000元收取，
					10万—100万元(含100万元)：6%，
					100万—1000万元(含1000万元)：4%，
					1000万元以上：2%
					*/
					if ($price <= 100000) {
						$lawyerfee = $price * 0.08;
						if ($lawyerfee < 3000) {
							$lawyerfee = 3000;
						}
					} else if ($price <= 1000000) {
						$lawyerfee = 8000 + ($price - 100000) * 0.06;
					} else if ($price <= 10000000) {
						$lawyerfee = 62000 + ($price - 1000000) * 0.04;
					} else {
						$lawyerfee = 422000 + ($price - 10000000) * 0.02;
					}
					$result = number_format($lawyerfee, 2, '.', '');
				} else {
					$result = '3000-30000';
				}
			} else if ($typeid == 2) {
				$result = {
					'zc': '2000—6000',
					'sc': '3000—9000',
					'sp': '4000—12000'
				};
			}
			break;
	}
	return $result;
}
