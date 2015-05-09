/*用户表*/
create table user(
	uid bigint not null auto_increment,
    username varchar(64) not null ,
    password varchar(64) not null,
    create_time datetime not null, 
    last_login datetime not null ,
    primary key(uid)
);

/*博客文章表*/
create table post(
	pid bigint not null auto_increment,
	title varchar(255) not null,/*标题*/
	content text not null,/*内容*/
	author bigint not null,/*作者id*/
	poststate int not null default 0,/*文章状态，0为正式发布，1为草稿*/
	category int ,/*所属分类，0为通用（默认分类）*/
	qrcode_path varchar(512) ,/*二维码地址*/
	create_time datetime not null,
	last_update datetime not null,
	primary key(pid)
);

/*文章分类*/
create table category(
	cid int not null auto_increment,
	name varchar(255) not null,/*分类名称*/
	primary key(cid)
);

/*分享链接*/
create table sharedlink(
	id int not null auto_increment,
	content varchar(255) not null,/*链接文字*/
 	link varchar(255) not null,/*链接url*/
	create_time datetime not null,
	primary key(id)
);

/*回复*/
create table reply(
	rid bigint not null auto_increment,
	replyto bigint not null, /*回复的目标,可以为文章，也可以为回复，根据reply_type来判断*/
	title varchar(255) not null,/*回复标题*/
	content text not null,/*回复内容*/
	reply_type int not null,/*回复的类型,1为回复文章，2为回复回复*/
	audit_state int not null,/*审核状态，0为审核通过，1为待审核，2为封禁*/
	create_time datetime not null,
	last_update datetime not null,
	primary key(rid)
);
