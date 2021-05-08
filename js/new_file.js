//工具箱--诉讼费计算
 function lawsuit($type,$price) {
 	/*
 	1 : ['name':'财产案件','is_property':0,'price':1],
 	3 : ['name':'离婚案件','is_property':1,'price':1],
 	4 : ['name':'人格权案件','is_property':1,'price':1],
 	5 : ['name':'知识产权案件','is_property':1,'price':1],
 	
 	2 : ['name':'普通非财产案件','is_property':0,'price':0],
 	6 : ['name':'劳动争议案件','is_property':0,'price':0],
 	7 : ['name':'行政案件','is_property':0,'price':0],
 	8 : ['name':'商标 专利 海事行政案件','is_property':0,'price':0],
 	9 : ['name':'管辖权异议不成立案件','is_property':0,'price':0]
 	*/
 	$type = request - > param('type/d', 0);
 	$price = request - > param('price/d', 0);
 	$is_property = request - > param('is_property/d', 0);

 	if ($type == 0) {
 		return json(['status' : 203, 'msg' : '请选择案件类型！！']);
 	}

 	switch ($type) {
 		case 1:
 			$result = Calculation($type, $price);
 			break;
 		case 2:
 			$result = {
 				'shouli' : '50.00-100.00',
 				'zhixing' : '50.00-500.00',
 				'baoquan' : '30.00'
 			};
 			break;
 		case 3:
 			//离婚案件
 		case 4:
 			//人格权案件
 			$result = Calculation($type, $price, $is_property);
 			break;
 		case 5:
 			$result = Calculation($type, $price, $is_property);
 			break;
 		case 6:
 			$result = {
 				'shouli' : '10.00',
 				'zhixing' : '50.00-500.00',
 				'baoquan' : '30.00'
 			};
 			break;
 		case 7:
 			$result = {
 				'shouli' : '100.00',
 				'zhixing' : '50.00-500.00',
 				'baoquan' : '30.00'
 			};
 			break;
 		case 8:
 			$result = {
 				'shouli' : '100.00',
 				'zhixing' : '50.00-500.00',
 				'baoquan' : '30.00'
 			};
 			break;
 		case 9:
 			$result = {
 				'shouli' : '50.00-100.00',
 				'zhixing' : '50.00-500.00',
 				'baoquan' : '30.00'
 			};
 			break;
 		default:
 			return json({'status' : 203, 'msg' : '请选择案件类型！！'});
 			break;
 	}

 	return json(['status' : 200, 'msg' : '计算成功', 'data' : $result]);
 }

 //计算金额----------
 function Calculation($type, $price = 0, $is_property = 0) {
 	$result = {};
 	switch ($type) {
 		case 3:
 			//离婚案件
 			if ($is_property) {
 				/*
 				离婚案件每件交纳50元至300元。
 				涉及财产分割，财产总额不超过20万元的，不另行交纳；
 				超过20万元的部分，按照0.5%交纳
 				*/
 				if ($price > 200000) {
 					$shouli = ($price - 200000) * 0.005;
 				} else {
 					$shouli = 0;
 				}
 				$showlifee = number_format($shouli + 50, 2, '.', '').
 				'-'.number_format($shouli + 300, 2, '.', '');
 				$result = {'shouli' : $showlifee, 'zhixing' : zhixingPrice($price, $is_property),
 					'baoquan' : baoquanPrice($price)
 				};
 			} else {
 				$result = {'shouli' : '50.00-300.00', 'zhixing' : zhixingPrice($price, $is_property),
 					'baoquan' : baoquanPrice($price)
 				};
 			}
 			break;
 		case 4:
 			//人格权案件
 			if ($is_property) {
 				/*
 				赔偿金额不超过5万元的，不另行交纳；
 				超过5万元至10万元的部分，按照1%交纳；
 				超过10万元的部分，按照0.5%交纳。
 				*/
 				if ($price > 50000 && $price <= 100000) {
 					$shouli = ($price - 50000) * 0.01;
 				}
 				elseif($price > 100000) {
 					$shouli = 500 + ($price - 100000) * 0.005;
 				} else {
 					$shouli = 0;
 				}
 				$showlifee = number_format($shouli + 100, 2, '.', '').
 				'-'.number_format($shouli + 500, 2, '.', '');
 				$result = {'shouli' : $showlifee, 'zhixing' : zhixingPrice($price, $is_property),
 					'baoquan' : baoquanPrice($price)
 				};
 			} else {
 				$result = {'shouli' : '100.00-500.00', 'zhixing' : zhixingPrice($price, $is_property),
 					'baoquan' : baoquanPrice($price)
 				};
 			}
 			break;
 		case 5:
 			//知识产权案件
 			if ($is_property) {
 				/*
 				知识产权民事案件，没有争议金额或者价额的，每件交纳500元至1000元；
 				有争议金额或者价额的，按照财产案件的标准交纳。
 				*/
 				$result = {'shouli' : getshouliPrice($price), 'zhixing' : zhixingPrice($price,
 					$is_property), 'baoquan' : baoquanPrice($price)};
 			} else {
 				$result = {'shouli' : '500.00-1000.00', 'zhixing' : '50.00-500.00', 'baoquan' : '30.00'};
 			}
 			break;
 		case 1:
 		case 2:
 		case 6:
 		case 7:
 		case 8:
 		case 9:
 			if ($price) {
 				$result = {'shouli' : getshouliPrice($price), 'zhixing' : zhixingPrice($price,
 					$is_property), 'baoquan' : baoquanPrice($price)};
 			} else {
 				$result = {'shouli' : '50.00', 'zhixing' : '50.00', 'baoquan' : '30.00'};
 			}
 			break;
 		default:
 			$result = {'shouli' : '50.00', 'zhixing' : '50.00', 'baoquan' : '30.00'};
 			break;
 	}
 	return $result;
 }

  //受理费计算
function getshouliPrice($amount) {
        /*
        1.不超过1万元的，每件交纳50元；
    　　2.超过1万元至10万元的部分，按照2.5%交纳；
    　　3.超过10万元至20万元的部分，按照2%交纳；
    　　4.超过20万元至50万元的部分，按照1.5%交纳；
    　　5.超过50万元至100万元的部分，按照1%交纳；
    　　6.超过100万元至200万元的部分，按照0.9%交纳；
    　　7.超过200万元至500万元的部分，按照0.8%交纳；
    　　8.超过500万元至1000万元的部分，按照0.7%交纳；
    　　9.超过1000万元至2000万元的部分，按照0.6%交纳；
    　　10.超过2000万元的部分，按照0.5%交纳。
    　　*/
        if ($amount <= 10000) {
            $shoulifee = 50;
        } elseif ($amount <= 100000) {
            $shoulifee = 50 + ($amount - 10000) * 0.025;
        } elseif ($amount <= 200000) {
            $shoulifee = 2300 + ($amount - 100000) * 0.02;
        } elseif ($amount <= 500000) {
            $shoulifee = 4300 + ($amount - 200000) * 0.015;
        } elseif ($amount <= 1000000) {
            $shoulifee = 8800 + ($amount - 500000) * 0.01;
        } elseif ($amount <= 2000000) {
            $shoulifee = 13800 + ($amount - 1000000) * 0.009;
        } elseif ($amount <= 5000000) {
            $shoulifee = 22800 + ($amount - 2000000) * 0.008;
        } elseif ($amount <= 10000000) {
            $shoulifee = 46800 + ($amount - 5000000) * 0.007;
        } elseif ($amount <= 20000000) {
            $shoulifee = 81800 + ($amount - 10000000) * 0.006;
        }else{
            $shoulifee = 141800 + ($amount - 20000000) * 0.005;
        }
        return number_format($shoulifee,2,'.','');
    }
	
	//执行费计算
function zhixingPrice($amount,$is_property) {
	        /*
	        1.没有执行金额或者价额的，每件交纳50元至500元。
	　　    2.执行金额或者价额不超过1万元的，每件交纳50元；
	　　    超过1万元至50万元的部分，按照1.5%交纳；
	　　    超过50万元至500万元的部分，按照1%交纳；
	　　    超过500万元至1000万元的部分，按照0.5%交纳；
	　　    超过1000万元的部分,按照0.1%交纳。
	        */
	        if ($amount <= 10000) {
	            $executionfee = 0;
	        } else if ($amount <= 500000) {
	            $executionfee = 50 + ($amount - 10000) * 0.015;
	        } else if ($amount <= 5000000) {
	            $executionfee = 7400 + ($amount - 500000) * 0.01;
	        } else if ($amount <= 10000000) {
	            $executionfee = 52400 + ($amount - 5000000) * 0.005;
	        } else {
	            $executionfee = 77400 + ($amount - 10000000) * 0.01;
	        }
	        if($is_property == 0){
	            $executionfee = 0;
	            return number_format($executionfee + 50,2,'.','').'-'.number_format($executionfee + 500,2,'.','');
	        }
	        if($amount == 0){
	            return '50.00';
	        }
	        return number_format($executionfee,2,'.','');
	    }