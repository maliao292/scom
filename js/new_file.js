// [万，%]
let rule = [
	// [10, 5, 6],
	// [100, 4, 5],
	// [500, 3, 4],
	// [1000, 2, 3],
	// [5000, 1, 2],

	[10, 8, 10],
	[50, 7, 9],
	[100, 6, 8],

]

// 分段式计费
function getnext(rules, money, min) {
	//rules[0] 单位 为万元
	// money,min 单位为 元
	let upper = 0; // 上限
	let lower = 0; // 下限
	let $result = null;
	// 按照 标的 筛选 money 所在全额费用的区间
	let newrule = rules.filter(rule => {
		return rule[0] && (rule[0] <= money / 10000)
	})
	console.log(rules)
	newrule.forEach((res, ind) => {
		lower += (res[0] - (ind == 0 ? 0 : rules[ind - 1][0])) * 10000 * res[1] / 100
		if (rules.length === 3)
			upper += (res[0] - (ind == 0 ? 0 : rules[ind - 1][0])) * 10000 * res[2] / 100
	})

	if (rules.length === 3) {
		$result = lower + (money - newrule[length - 1][0] * 10000) * rules[length][1] * 100 + '-'
			upper + (money - newrule[length - 1][0] * 10000) * rules[length][2] * 100
	} else {
		$result = lower + (money - newrule[length - 1][0] * 10000) * rules[length][1] * 100
	}
	console.log(upper, lower);

	if (newrule.length === 0)
		return min?min:$result
	return $result
}

getnext(data, 60)
