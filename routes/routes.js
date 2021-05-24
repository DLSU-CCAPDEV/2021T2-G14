const express = require("express");
const app = express();
const multer = require("multer");
const mime = require("mime");
const controller = require("../controllers/controller.js");

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
app.get("/", controller.getHome);

app.get("/about", controller.getAbout);

app.get("/change_password", controller.getChangPassword);

app.post("/change_password", controller.postChangePassword);

app.get("/contact", controller.getContact);

app.post("/contact", controller.postContact);

app.get("/create", controller.getCreate);

app.get("/delete_account", controller.getDeleteAcc);

app.get("/getScheduleName", controller.getSchedName);

app.get("/getScheduleId", controller.getSchedid);

app.get("/addScheduleName", controller.getAddSchedName);

app.get("/updateScheduleName", controller.getUpdateSchedName);

app.get("/saveSchedule", controller.getSaveSched);

app.get("/edit_account", controller.getEditAcc);

app.post("/edit_account", controller.postEditAcc);

app.get("/log_in", controller.getLogin);

app.get("/manage_account", controller.getManageAcc);

app.post("/log_in", controller.postLogin);

app.get("/register", controller.getRegister);

app.post("/register", upload.single("dp"), controller.postRegister);

app.get("/checkID", controller.getCheckid);

app.get("/logout", controller.getLogout);

app.get("/schedule/:scheduleId", controller.getSched_schedid);

app.get("/my_schedules", controller.getMyScheds);

app.get("/viewaccount", controller.getViewAcc);

/*
	when a post has been clicked
	View a post of a certain post
	opens a new page of the post with upvotes, downvotes, and comments 
*/
app.get("/viewpost/:postid", controller.getViewpost_postid);

/*
	Shows the search result from the search form in the header
	retrieves 0 to many posts
	if there are 0 matching posts, it says none has been found
*/
app.get("/searchResults", controller.getSearchResults);

/*
	when the upvote button has been clicked but the downvote is not active
	increase the number of upvotes
*/
app.get("/upvoteInc", controller.getUpvoteInc);

/*
	when upvote has been clicked and it is active
	reduce the amount of upvotes
*/
app.get("/upvoteDec", controller.getUpvoteDec);

/*
	when upvote is clicked and downvote is active
	reduce downvote by 1 and add 1 to upvote
*/
app.get("/downDecupInc", controller.getDownDecUpInc);

/*
	when downvote is clicked and upvote is not active
	increase downvote by 1
*/
app.get("/downvoteInc", controller.getDownVoteInc);

/*
	when downvote is clicked and it is active
	decrease downvote by one 
*/
app.get("/downvoteDec", controller.getDownVoteDec);

/*
	when downvote is clicked and upvote is active
	reduce upvote by 1 and increase downvote by 1
*/
app.get("/upDecdownInc", controller.getUpDecDownInc);

/*
	when you submit a comment, it is added to the database
*/
app.get("/addComment", controller.getAddComment);

app.get("/deletecomment", controller.getDeleteComment);

/*
	redirects to my posts to see the current user's posts with imgs
*/
app.get("/my_posts", controller.getMyPosts);

app.get("/editpost/:schedid", controller.getEditPost_schedid);

app.get("/deletepost/:schedid", controller.getDeletePost_schedid);

app.post("/save_edits", upload.single("postImg"), controller.getSaveEdits);

app.get("/create_post", controller.getCreatePost);

app.post("/create_post", upload.single("postImg"), controller.postCreatePost);

module.exports = app;
