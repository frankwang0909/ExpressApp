
var setting = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;
// 设置数据库名、数据库地址和数据库端口创建了一个数据库连接实例，
// 并通过  module.exports 导出该实例
module.exports = new Db(
	setting.db, 
	new Server(setting.host, setting.port),
	{safe:true}
);
