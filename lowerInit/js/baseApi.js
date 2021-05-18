class Jhttp {
	constructor(arg) {
		this.baseUrl = `http://192.168.1.101:7799/hengz`
	}
	http(url, params, type) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.baseUrl+url}`,
				type: "post",
				dataType: "json",
				data: params,
				processData: false,
				contentType: false,
				success: function(data) {
					resolve(data);
				},
				error: (err) => {
					reject(data);
				}
			})
		})
	}
}

let request = new Jhttp();
