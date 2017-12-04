const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose')

const should = chai.should();

const {BlogPost} = require('../models');
const {app,runServer.closeServer} = require('..server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


function seedBlogData() {
	console.info('seeding blog data');
	const seedData = [];

	for (let i=1;i<=10; i++) {
		seedData.push(generateBlogData());
		return Restaurant.insertMany(seedData);
	}
}

function generateBlogAuthor(){
	const authors = [
	'Roald Dahl','Pol Pot','Korean Guy'];
	return authors[Math.floor(Math.random() *authors.length)];
}

function generateBlogContent(){
	const content = [
	'once upon a time','not time for thinking','small time gal'];
	return content[Math.floor(Math.random() *content.length)];
}
function generateBlogTitle(){
	const titles = [
	'the story','na sceal','dfljsdflhwh'];
	return titles[Math.floor(Math.random() *titles.length)];

}

function generateBlogData(){
	return {
		author:generateBlogAuthor(),
		content:generateBlogContent(),
		title:generateBlogTitle(),
		created:faker.date.past()

	}
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog Api resource', function(){
	before(function(){
		return runserver(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedBlogData();
	});

	afterEach(function(){
		return tearDownDb();
	});

	after(function(){
	return closeServer();
})

describe('GET endpoint', function(){
	it('should return all existing blogposts', function(){

		let res;
		return chai.request(app)
		.get('/posts')
		.then(function(_res){
			res= _res;
			res.should.have.status(200);
			res.body.posts.should.have.length.of.at.least(1);
			return Blogpost.count();
		})
		.then(function(count){
		res.body.restaurants.should.have.length.of(count);
		});
	});

	it('should return blogposts with right fields', function(){

		let resPosts;
		return chai.request(app)
		.get('/posts')
		.then(function(res){
			res.should.have.status(200):
			res.should.be.json;
			res.body.posts.should.be.a('array');
			res.body.posts.should.have.length.of.at.least(1);
			res.body.posts.forEach(function(posts){
				post.should.be.a('object');
				post.should.include.keys(
					'author','firstname','lastname','title','content','created');
			});
			resPosts=res.body.posts[0];
			return Blogpost.findById(resPosts.id);
		})
		.then(function(blogpost){
			resPosts.id.should.equal(blogpost.id);
			resPosts.firstname.should.equal(blogpost.firstname);
			resPosts.lastname.should.equal(blogpost.lastname);
			resPosts.title.should.equal(blogpost.title);
			resPosts.content.should.equal(blogpost.content);
			resPosts.created.should.equal(blogpost.content);
		});
	});
});

describe('POST endpoint', function(){

	it('should add a new blogpost', function(){

		const newBlog = generateBlogpostData();

		return chai.request(app)
		.post('/posts')
		.send(newBlog)
		.then(function(res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys(
				'is','author','firstname','lastname','title','content','created');
			res.body.author.should.equal(newBlog.author);
			res.body.firstname.should.equal(newBlog.firstname);
			res.body.lastname.should.equal(newBlog.lastname);
			res.body.title.should.equal(newBlog.title);
			res.body.content.should.equal(newBlog.content);
			res.body.created.should.equal(newBlog.created);
			res.body.id.should.not.be.null;
		});
		resPosts=res.body.posts[0];
		return Blogpost.findById(resPosts.id);
	})
	.then(function(blogpost){
		blogpost.author.should.equal(newBlog.author);
		blogpost.firstname.should.equal(blogpost.firstname);
		blogpost.lastname.should.equal(blogpost.lastname);
		blogpost.title.should.equal(blogpost.title);
		blogpost.content.should.equal(blogpost.content);
		blogpost.created.should.equal(blogpost.created);
	});
});


 describe('PUT endpoint', function(){

 	it('should update fields sent over', function(){
 		const updateData = {
 			title:'the long walk',
 			content:'i walked all the way to ijukizi'
 		};

 		return BlogPost
 			.findOne()
 			.then(function(blogpost){
 				updateData.id=blogpost.id;

 				return chai.request(app)
 				.put(`/posts/${blogpost.id}`)
 				.send(updateData);
 			})
 			.then(function(res){
 				res.should.have.status(204);

 				return BlogPost.findById(updateData.id);
 			})
 			.then(function(blogpost){
 				blogpost.title.should.equal(updateData.title);
 				blogpost.content.should.equal(updateData.content);
 			});
 	});
 });

 describe('DELETE endpoint', function(){

 	it('should delete a restaurant', function(){

 		let blogpost;

 		return BlogPost
 			.findOne()
 			.then(function(_blogpost){
 				blogpost = _blogpost;
 				return chai.request(app).delete(`/posts/${blogpost.id}`);
 			})
 			.then(function(res){
 				res.should.have.status(204);
 				return BlogPost.findById(restaurant.id);
 			})
 			.then(function(_blogpost){
 				should.not.exist(_blogpost);
 			});
 	});
 });
 });
