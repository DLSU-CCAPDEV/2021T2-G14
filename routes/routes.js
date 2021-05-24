const express = require("express");
const mongoose = require("mongoose");
const db = require("../models/db");
const User = require("../models/UserModel.js");
const Posts = require("../models/PostModel.js");
const Comments = require("../models/CommentModel.js");
const defaultclasses = require("../models/DefaultClassModel.js");
const Schedules = require("../models/ScheduleModel.js");
const Feedback = require("../models/FeedbackModel.js");
const app = express();
const bcrypt = require("bcrypt");
const validationResult = require("express-validator");
const saltRounds = 10;
const multer = require("multer");
const mime = require("mime");

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log("choosing file destination");
		if (req.body.schedTitle) cb(null, "public/img/uploads/post_uploads");
		else cb(null, "public/img/uploads/profile_uploads");
	},
	filename: function (req, file, cb) {
		if (req.body.schedTitle) {
			// for post img
			console.log("trying to make filename for postImg");
			cb(
				null,
				req.body.schedTitle +
					"-" +
					Date.now() +
					"." +
					mime.extension(file.mimetype)
			);
		} else {
			// for profile pictures
			cb(
				null,
				req.body.username +
					"-" +
					Date.now() +
					"." +
					mime.extension(file.mimetype)
			);
		}
	},
});
var upload = multer({ storage: storage });

// TODO: add in routes

/*
	opens the home page of the web app
	gets all the posts from the database and displays them 

*/
app.get("/", (req, res) => {
	console.log("Home Page");

	// HARDCODE add to db
	// var posts = [];
	// var titles = [
	// 	"Year 1 Term 1 Schedule",
	// 	"best sched ever",
	// 	"DL only",
	// 	"panget profs ko",
	// 	"please copy my sched",
	// ];

	// var authors = [
	// 	"sendcutdogpics",
	// 	"ironman3000",
	// 	"thorodinson",
	// 	"blackwidow69",
	// 	"captamerica",
	// ];

	// var descs = [
	// 	"This is my first scehdule.",
	// 	"i love my schedule",
	// 	"we can be friends",
	// 	"ew",
	// 	"who has the same sched???",
	// ];

	// for (var i = 0; i < 5; i++) {
	// 	var post = {
	// 		schedcard: "schedcard-" + (i + 1),
	// 		schedTitle: titles[i],
	// 		schedid: "A1B2" + (i + 1),
	// 		postImg: "/img/example" + (i + 1) + ".jpg",
	// 		schedAuthor: authors[i],
	// 		schedDesc: descs[i],
	// 		upqty: 0,
	// 		downqty: 0,
	// 	};

	// 	db.insertOne(Posts, post, (flag) => {
	// 		if (flag) {
	// 			console.log("added a post to db");
	// 		}
	// 	});

	// 	posts.push(post);
	// 	console.log(posts[i].schedcard);
	// 	console.log(posts[i].postImg);
	// }

	console.log(req.session.username);
	if (req.session.username) {
		// get all the posts from the database
		var postshome = "schedcard schedTitle _id postImg";
		db.findMany(Posts, {}, postshome, (result) => {
			if (result != null) {
				console.log("loading home");
				console.log(result);
				var details = {
					flag: true,
					result: result,
					username: req.session.username,
				};
				res.render("home", details);
			} else console.log("error with db");
		});
	} else {
		// get all the posts from the database
		var postshome = "schedcard schedTitle _id postImg";
		db.findMany(Posts, {}, postshome, (result) => {
			if (result != null) {
				console.log("loading home");
				console.log(result);
				var details = {
					flag: false,
					result: result,
				};
				res.render("home", details);
			} else console.log("error with db");
		});
	}

	// console.log(posts.length);
	// res.render("home", posts);
});

app.get("/about", function (req, res) {
	if (req.session.username) {
		var details = {
			username: req.session.username,
			flag: true,
		};
	} else {
		var details = {
			flag: false,
		};
	}

	res.render("about", details);
});

app.get("/change_password", function (req, res) {
	res.render("change_password");
});

app.post("/change_password", function (req, res) {
	var old = req.body.old;
	var newPass = req.body.newPass;
	var confirm = req.body.confirm;
	var error = { ERROR: "One or more fields is/are incorrect." };

	if (newPass == confirm) {
		console.log("CHANGING PASSWORD");
		console.log(req.session.password);
		console.log(old);
		if (req.session.password == old) {
			bcrypt.hash(newPass, saltRounds, function (err, hash) {
				console.log("CHANGING PASSWORD");
				db.updateOne(
					User,
					{ username: req.session.username },
					{
						$set: {
							password: hash,
						},
					},
					(result) => {
						if (result) {
							console.log("CHANGING PASSWORD");
							console.log("updated password");
							res.redirect("/manage_account");
						} else {
							console.log("failed");
							res.render("change_password", error);
						}
					}
				);
			});
		} else {
			console.log("ERROR EQUALS");
			res.render("change_password", error);
		}
	} else {
		res.render("change_password", error);
	}
});

app.get("/contact", function (req, res) {
	if (req.session.username) {
		var details = {
			username: req.session.username,
			flag: true,
		};
	} else {
		var details = {
			flag: false,
		};
	}
	res.render("contact", details);
});

app.post("/contact", function (req, res) {
	var comments = req.body.comments;
	db.insertOne(Feedback, { feedback: comments }, function (result) {
		if (result) console.log("comment sent");
		else console.log("failed");
	});

	res.redirect("home");
});

app.get("/create", function (req, res) {
	if (req.session.username) {
		var query = {
			flag: true,
			username: req.session.username,
		};

		db.findMany(defaultclasses, {}, "classId className", function (result) {
			if (result != null) {
				console.log("Loading default classes from DB");
				var classList = [];
				for (var j = 0; j < result.length; j++) {
					classList.push({
						classId: result[j].classId,
						className: result[j].className,
					});
				}
				query.classList = classList;
				console.log(query);

				res.render("create", query);
			} else console.log("Error finding default classes");
		});
	} else {
		res.redirect("home");
	}
});

app.get("/delete_account", (req, res) => {
	var username = req.session.username;
	console.log("deleting user from database");
	db.deleteOne(User, { username: username }, (result) => {
		if (result) console.log("SUCCESS deleting user");
		else console.log("FAILED deleting user");
	});
	db.deleteMany(Comments, { cAuthor: username }, (result) => {
		if (result) console.log("SUCCESS deleting comment");
		else console.log("FAILED deleting comment");
	});
	db.deleteMany(Posts, { schedAuthor: username }, (result) => {
		if (result) console.log("SUCCESS deleting post");
		else console.log("FAILED deleting post");
	});

	req.session.username = null;
	req.session.password = null;
	res.redirect("home");
});

app.get("/getScheduleName", (req, res) => {
	console.log("Checking schedule name from db");
	console.log(req.query.scheduleName);
	console.log(req.query.username);
	db.findOne(
		Schedules,
		{ schedName: req.query.scheduleName, username: req.query.username },
		"schedName username",
		function (result) {
			res.send(result);
		}
	);
});

app.get("/getScheduleId", (req, res) => {
	console.log("Checking schedule Id from db");
	console.log(req.query.scheduleName);
	console.log(req.query.username);
	db.findOne(
		Schedules,
		{ schedName: req.query.scheduleName, username: req.query.username },
		"_id",
		function (result) {
			console.log(result);
			res.send(result);
		}
	);
});

app.get("/addScheduleName", (req, res) => {
	console.log("Adding schedule name to db");
	console.log(req.query.scheduleName);
	console.log(req.query.username);
	db.insertOne(
		Schedules,
		{
			schedName: req.query.scheduleName,
			username: req.query.username,
			schedId: req.query.schedId,
			classCnt: 9,
		},
		function (result) {
			console.log(result);
			res.send(result);
		}
	);
});

app.get("/updateScheduleName", (req, res) => {
	console.log("Updating schedule name");
	console.log("Finding " + req.query.oldScheduleName);
	console.log("Changing to " + req.query.newScheduleName);
	db.updateOne(
		Schedules,
		{ schedName: req.query.oldScheduleName, username: req.query.username },
		{ schedName: req.query.newScheduleName },
		(result) => {
			if (result) {
				console.log("Updated schedule name in db");
				res.send(result);
			} else {
				res.send(null);
				console.log("Failed to upload schedule in db");
			}
		}
	);
});

app.get("/saveSchedule", (req, res) => {
	console.log("Attempting to save schedule and classes to db");
	console.log(req.query.schedule);
	console.log(req.query.schedule.schedId);
	db.updateOne(
		Schedules,
		{ _id: req.query.schedule.schedId },
		{
			classCnt: req.query.schedule.classCnt,
			classes: req.query.schedule.classes,
		},
		(result) => {
			if (result > 0) {
				console.log("Successful updating schedule");
				res.send(result);
			} else {
				console.log("Error updating schedule");
				res.send(null);
			}
		}
	);
});

app.get("/edit_account", function (req, res) {
	db.findOne(
		User,
		{ username: req.session.username },
		"username desc email profPic",
		function (result) {
			if (result) {
				res.render("edit_account", result);
			} else console.log("error editing account");
		}
	);
});

app.post("/edit_account", function (req, res) {
	var username = req.session.username;
	var email = req.body.email;
	var desc = req.body.desc;
	db.updateOne(
		User,
		{ username: username },
		{
			$set: {
				email: email,
				desc: desc,
			},
		},
		(result) => {
			if (result) {
				console.log("updated");
				res.redirect("/manage_account");
			} else console.log("failed");
		}
	);
});

app.get("/log_in", function (req, res) {
	if (req.session.username) {
		res.redirect("home");
	} else {
		var details = {
			flag: false,
		};

		res.render("log_in", details);
	}
});

app.get("/manage_account", function (req, res) {
	var user;
	db.findOne(
		User,
		{ username: req.session.username },
		"username desc email profPic",
		function (result) {
			if (result) {
				console.log(result);
				res.render("manage_account", result);
			} else console.log("error managing account");
		}
	);
});

app.post("/log_in", function (req, res) {
	console.log("here");
	var username = req.body.username;
	var password = req.body.password;

	db.findOne(User, { username: username }, "", function (result) {
		console.log(result);
		if (result) {
			var user = {
				username: result.username,
				desc: result.desc,
				email: result.email,
			};

			bcrypt.compare(password, result.password, function (err, equal) {
				if (equal) {
					req.session.username = user.username;
					req.session.password = password;

					res.redirect("home");
				} else {
					var details = {
						flag: false,
						ERROR: "Username and/or Password is incorrect.",
					};
					console.log("this");

					res.render("log_in", details);
				}
			});
		} else {
			var details = {
				flag: false,
				ERROR: "Username and/or Password is incorrect.",
			};
			console.log("that");
			res.render("log_in", details);
		}
	});
});

app.get("/register", function (req, res) {
	var details = {};

	if (req.session.username) {
		details.flag = true;
		details.username = req.session.username;
	} else details.flag = false;

	res.render("register", details);
});

app.post("/register", upload.single("dp"), function (req, res) {
	var username = req.body.username;
	var email = req.body.email;
	var desc = req.body.desc;
	var password = req.body.password;
	var filename;
	if (req.file && req.file.filename) filename = req.file.filename;
	else filename = "dummy.jpg";

	bcrypt.hash(password, saltRounds, function (err, hash) {
		var user = {
			username: username,
			email: email,
			desc: desc,
			password: hash,
			profPic: filename,
		};

		db.insertOne(User, user, (result) => {
			if (result) {
				req.session.username = user.username;
				res.redirect("/");
			} else console.log("ERROR");
		});
	});
});

app.get("/checkID", function (req, res) {
	var username = req.query.username;

	db.findOne(User, { username: username }, "username", function (result) {
		res.send(result);
	});
});

app.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		if (err) throw err;
		res.redirect("home");
	});
});

app.get("/schedule/:scheduleId", (req, res) => {
	var user = req.session.username;
	console.log("in session: " + user);
	var query = { _id: req.params.scheduleId };
	console.log(query);
	// find the post from the database with comments
	var postdetails = "username _id schedName classCnt classes";
	db.findOne(Schedules, query, postdetails, (result) => {
		if (result != null) {
			console.log("redirecting to selected scheduled");
			console.log(result);

			schedule = {
				username: result.username,
				schedId: result._id,
				schedName: result.schedName,
				classCnt: result.classCnt,
				classes: result.classes,
			};
			console.log(result);
			var details;
			if (req.session.username)
				details = {
					flag: true,
					schedule: schedule,
					username: req.session.username,
				};
			else details = { flag: false, post: post };
			res.render("schedule", details);
		} else {
			res.render("error");
			console.log("post not found");
		}
	});
});

app.get("/my_schedules", function (req, res) {
	var currUser = req.session.username;
	var scheduleDetails = "schedName classCnt _id";
	db.findMany(
		Schedules,
		{ username: currUser },
		scheduleDetails,
		(result) => {
			if (result != null) {
				console.log("Loading my schedules");
				var details = {
					flag: true,
					result: result,
					username: req.session.username,
				};
				console.log(result);
				res.render("my_schedules", details);
			} else {
				console.log("error loading my posts");
			}
		}
	);
});

app.get("/viewaccount", (req, res, next) => {
	var username = req.query.username;
	var details;
	db.findOne(
		User,
		{ username: username },
		"username email desc profPic",
		(result) => {
			if (result != null) {
				console.log("RENDERING ACCOUNT");
				console.log(result);
				var user = result;
				db.findMany(
					Posts,
					{ schedAuthor: username },
					"_id postImg schedTitle schedAuthor schedDesc",
					(result) => {
						if (result != null) {
							if (req.session.username) {
								if (req.session.username == username) {
									details = {
										flag: true,
										same: true,
										result: result,
										user: user,
									};
									res.render("viewaccount", details);
								} else {
									details = {
										flag: true,
										same: false,
										result: result,
										user: user,
									};
									res.render("viewaccount", details);
								}
							} else {
								if (req.session.username == username) {
									details = {
										flag: false,
										same: true,
										result: result,
										user: user,
									};
									res.render("viewaccount", details);
								} else {
									details = {
										flag: false,
										same: false,
										result: result,
										user: user,
									};
									res.render("viewaccount", details);
								}
							}
						}
					}
				);
			} else console.log("ERROR FINDING ACCOUNT");
		}
	);
});

/*
	when a post has been clicked
	View a post of a certain post
	opens a new page of the post with upvotes, downvotes, and comments 
*/
app.get("/viewpost/:postid", (req, res) => {
	var user = req.session.username;
	console.log("in session: " + user);
	var query = { _id: req.params.postid };
	console.log(query);
	// find the post from the database with comments
	var postdetails =
		"schedcard _id postImg schedTitle schedAuthor schedDesc upqty downqty";
	db.findOne(Posts, query, postdetails, (result) => {
		if (result != null) {
			console.log("redirecting to selected post");
			console.log(result);
			var post = {
				loggedUser: user,
				_id: result._id,
				postImg: result.postImg,
				schedTitle: result.schedTitle,
				schedAuthor: result.schedAuthor,
				schedDesc: result.schedDesc,
				upqty: result.upqty,
				downqty: result.downqty,
				comments: [],
			};

			var commentdetails = "schedid cAuthor cDesc";
			db.findMany(
				Comments,
				{ schedid: req.params.postid },
				commentdetails,
				(result) => {
					if (result != null) {
						console.log(result);
						result.forEach((comment) => {
							post.comments.push(comment);
						});

						var details;
						if (req.session.username)
							details = {
								flag: true,
								post: post,
								username: req.session.username,
							};
						else details = { flag: false, post: post };
						res.render("viewpost", details);
					} else console.log("error with comments");
				}
			);
		} else {
			res.render("error");
			console.log("post not found");
		}
	});

	// HARDCODED PROTOTYPE
	// var post = {
	// 	schedcard: "schedcard-1",
	// 	schedid: "A1B21",
	// 	postImg: "/img/example1.jpg",
	// 	schedTitle: "Year 1 Term 1 Schedule",
	// 	schedAuthor: "sendcutedogpics",
	// 	schedDesc: "This is my first schedule. Please like and comment!",
	// 	upqty: 300,
	// 	downqty: 10,
	// 	comments: [
	// 		{
	// 			cAuthor: "ironman3000",
	// 			cDesc: "nice sched",
	// 		},

	// 		{
	// 			cAuthor: "thorodinson",
	// 			cDesc: "We should be friends :)",
	// 		},

	// 		{
	// 			cAuthor: "blackwidow",
	// 			cDesc: "We should be friends :)",
	// 		},

	// 		{
	// 			cAuthor: "spongebobsquarepants",
	// 			cDesc: "We should be friends :)",
	// 		},

	// 		{
	// 			cAuthor: "miketysonnnnnnnn",
	// 			cDesc: "We should be friends :)",
	// 		},
	// 	],
	// };
	// res.render("viewpost", post);
});

/*
	Shows the search result from the search form in the header
	retrieves 0 to many posts
	if there are 0 matching posts, it says none has been found
*/
app.get("/searchResults", (req, res) => {
	var currUser = req.session.username;
	var details = {};
	if (req.query.q <= 0) {
		res.redirect("/");
	} else {
		var searchquery = {
			query: req.query.q,
			posts: [],
		};
		console.log("Search Results for: " + searchquery.query);
		// query the posts that have the following keyword (QUERY)s
		// find from db
		var postres = "schedTitle _id postImg";
		// find by username or title
		var byuser = { schedAuthor: { $regex: req.query.q, $options: "i" } };
		var bytitle = { schedTitle: { $regex: req.query.q, $options: "i" } };
		var filter = { $or: [byuser, bytitle] };
		db.findMany(Posts, filter, postres, (result) => {
			if (result.length > 0) {
				console.log("got from users or titles");
				console.log(result);
				// add them to the list
				result.forEach((post) => {
					searchquery.posts.push(post);
				});

				if (currUser)
					details = {
						flag: true,
						searchquery: searchquery,
						username: req.session.username,
					};
				else details = { flag: false, searchquery: searchquery };
				console.log(details);
				res.render("searchResults", details);
				console.log("found posts from search");
			} else {
				if (currUser)
					details = {
						flag: true,
						searchquery: searchquery,
						username: req.session.username,
					};
				else details = { flag: false, searchquery: searchquery };
				console.log(details);
				res.render("emptyResults", details);
				console.log("no posts found with query");
				console.log("none was found from users");
			}
		});

		// HARDCODED PROTOTYPE
		// var post = {
		// 	schedcard: "schedcard-1",
		// 	schedid: "A1B21",
		// 	postImg: "/img/example1.jpg",
		// };
		// searchquery.posts.push(post);
		// console.log(searchquery.posts[0].schedcard);
		// console.log(searchquery.posts[0].postImg);

		// console.log(searchquery.posts.length);
		// res.render("searchResults", searchquery);
	}
});

/*
	when the upvote button has been clicked but the downvote is not active
	increase the number of upvotes
*/
app.get("/upvoteInc", (req, res) => {
	var schedid = req.query._id;
	var query = {
		_id: req.query._id,
	};
	console.log(schedid);
	console.log("increasing upvote by 1");
	db.updateOne(Posts, query, { $inc: { upqty: 1 } }, (result) => {
		if (result) {
			console.log("returning updated schedule");
			db.findOne(Posts, query, "_id upqty", function (result) {
				if (result != null) {
					console.log("RESULTS\n" + result);
					res.send(result);
				} else {
					console.log("error");
					res.send(null);
				}
			});
		} else {
			console.log("error updating upvote count");
			res.send(null);
		}
	});
});

/*
	when upvote has been clicked and it is active
	reduce the amount of upvotes
*/
app.get("/upvoteDec", (req, res) => {
	var schedid = req.query._id;
	var query = { _id: req.query._id };
	console.log("decreasing upvote by 1");
	db.updateOne(Posts, query, { $inc: { upqty: -1 } }, (result) => {
		if (result) {
			console.log("returning updated schedule");
			db.findOne(Posts, query, "_id upqty", function (result) {
				if (result != null) {
					console.log("RESULTS\n" + result);
					res.send(result);
				} else {
					console.log("error");
					res.send(null);
				}
			});
		} else {
			console.log("error updating upvote count");
			res.send(null);
		}
	});
});

/*
	when upvote is clicked and downvote is active
	reduce downvote by 1 and add 1 to upvote
*/
app.get("/downDecupInc", (req, res) => {
	var schedid = req.query._id;
	var query = { _id: req.query._id };
	console.log("decreasing downvote by 1 & increasing upvote by 1");
	db.updateOne(
		Posts,
		query,
		{ $inc: { upqty: 1, downqty: -1 } },
		(result) => {
			if (result) {
				console.log("returning updated schedule");
				db.findOne(
					Posts,
					query,
					"_id upqty downqty",
					function (result) {
						if (result != null) {
							console.log("RESULTS\n" + result);
							res.send(result);
						} else {
							console.log("error");
							res.send(null);
						}
					}
				);
			} else {
				console.log("error updating upvote count");
				res.send(null);
			}
		}
	);
});

/*
	when downvote is clicked and upvote is not active
	increase downvote by 1
*/
app.get("/downvoteInc", (req, res) => {
	var schedid = req.query._id;
	var query = { _id: req.query._id };
	console.log("increasing downvote by 1");
	db.updateOne(Posts, query, { $inc: { downqty: 1 } }, (result) => {
		if (result) {
			console.log("returning updated schedule");
			db.findOne(Posts, query, "_id downqty", function (result) {
				if (result != null) {
					console.log("RESULTS\n" + result);
					res.send(result);
				} else {
					console.log("error");
					res.send(null);
				}
			});
		} else {
			console.log("error updating upvote count");
			res.send(null);
		}
	});
});

/*
	when downvote is clicked and it is active
	decrease downvote by one 
*/
app.get("/downvoteDec", (req, res) => {
	var schedid = req.query._id;
	var query = { _id: req.query._id };
	console.log("decreasing downvote by 1");
	db.updateOne(Posts, query, { $inc: { downqty: -1 } }, (result) => {
		if (result) {
			console.log("returning updated schedule");
			db.findOne(Posts, query, "_id downqty", function (result) {
				if (result != null) {
					console.log("RESULTS\n" + result);
					res.send(result);
				} else {
					console.log("error");
					res.send(null);
				}
			});
		} else {
			console.log("error updating upvote count");
			res.send(null);
		}
	});
});

/*
	when downvote is clicked and upvote is active
	reduce upvote by 1 and increase downvote by 1
*/
app.get("/upDecdownInc", (req, res) => {
	var schedid = req.query._id;
	var query = { _id: req.query._id };
	console.log("decreasing upvote by 1 & increasing downvote by 1");
	db.updateOne(
		Posts,
		{ _id: schedid },
		{ $inc: { downqty: 1, upqty: -1 } },
		(result) => {
			if (result) {
				console.log("returning updated schedule");
				db.findOne(
					Posts,
					{ _id: schedid },
					"_id upqty downqty",
					function (result) {
						if (result != null) {
							console.log("RESULTS\n" + result);
							res.send(result);
						} else {
							console.log("error");
							res.send(null);
						}
					}
				);
			} else {
				console.log("error updating upvote count");
				res.send(null);
			}
		}
	);
});

/*
	when you submit a comment, it is added to the database
*/
app.get("/addComment", (req, res) => {
	var comment = {
		schedid: req.query._id,
		commentid: req.query.commentid,
		cAuthor: req.session.username,
		cDesc: req.query.cDesc,
	};

	console.log("adding comment to db");
	db.insertOne(Comments, comment, (result) => {
		if (result) {
			console.log("added comment to database");

			db.findOne(
				Comments,
				{
					schedid: comment.schedid,
					commentid: comment.commentid,
					cAuthor: comment.cAuthor,
					cDesc: comment.cDesc,
				},
				"schedid commentid cAuthor cDesc",
				(result) => {
					if (result != null) {
						console.log("found comment");
						res.send(result);
					} else console.log("comment added not found");
				}
			);
		} else {
			console.log("error adding comment to database");
		}
	});
});

app.get("/deletecomment", (req, res) => {
	var commentid = req.query.commentid;
	console.log("deleting comment from database");
	db.deleteOne(Comments, { _id: commentid }, (result) => {
		if (result) console.log("SUCCESS deleting comment");
		else console.log("FAILED deleting comment");
	});
});

/*
	redirects to my posts to see the current user's posts with imgs
*/
app.get("/my_posts", (req, res) => {
	var currUser = req.session.username;
	var postDetails =
		"_id postImg schedTitle schedAuthor schedDesc upqty downqty";
	db.findMany(Posts, { schedAuthor: currUser }, postDetails, (result) => {
		if (result != null) {
			console.log("loading my posts");
			var details = {
				flag: true,
				result: result,
				username: req.session.username,
			};
			res.render("my_posts", details);
		} else {
			console.log("error loading my posts");
		}
	});
});

app.get("/editpost/:schedid", (req, res) => {
	var schedid = req.params.schedid;
	var scheddet = "postImg schedTitle _id schedAuthor schedDesc";
	db.findOne(Posts, { _id: schedid }, scheddet, (result) => {
		if (result != null) {
			var details = {
				flag: true,
				post: result,
				username: req.session.username,
			};
			res.render("edit_post", details);
		} else console.log("error editing post");
	});
});

app.get("/deletepost/:schedid", (req, res) => {
	var schedid = req.params.schedid;
	db.deleteOne(Posts, { _id: schedid }, (result) => {
		if (result) {
			res.redirect("/my_posts");
		} else console.log("error removing post");
	});
});

app.post("/save_edits", upload.single("postImg"), (req, res) => {
	console.log("SAVING EDITS ON POST");

	var schedid = req.body.schedid;
	console.log(schedid);

	var filename;
	if (req.file && req.file.filename) filename = req.file.filename;
	else filename = req.body.oldPostImg;
	console.log(filename);
	db.updateOne(
		Posts,
		{ _id: schedid },
		{
			$set: {
				schedTitle: req.body.schedTitle,
				schedDesc: req.body.schedDesc,
				postImg: filename,
			},
		},
		(result) => {
			if (result) res.redirect("/my_posts");
			else console.log("failed to update");
		}
	);
});

app.get("/create_post", (req, res) => {
	var details;
	if (req.session.username) details = { flag: true };
	else details = { flag: false };
	res.render("create_post", details);
});

app.post("/create_post", upload.single("postImg"), (req, res) => {
	console.log("CREATING POST");
	var schedTitle = req.body.schedTitle;
	var schedDesc = req.body.schedDesc;
	var filename;
	if (req.file && req.file.filename) filename = req.file.filename;
	else filename = "dummy.jpg";

	var postDetails = {
		schedTitle: schedTitle,
		schedAuthor: req.session.username,
		schedDesc: schedDesc,
		postImg: filename,
		upqty: 0,
		downqty: 0,
	};

	console.log("posting new post");
	console.log(postDetails);
	db.insertOne(Posts, postDetails, (result) => {
		if (result) res.redirect("/my_posts");
		else console.log("error posting schdule");
	});
});

module.exports = app;
