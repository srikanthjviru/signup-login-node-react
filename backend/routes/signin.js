const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserSession = require("../models/UserSession");

router.post("/signup", (req, res, next) => {
  const { body } = req;
  const { firstName, lastName, password, isDeleted } = body;
  let { email } = body;
  if (!firstName) {
    return res.send({
      success: false,
      message: "Error: FirstName cant be blank"
    });
  }

  if (!lastName) {
    return res.send({
      success: false,
      message: "Error: LastName cant be blank"
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cant be blank"
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cant be blank"
    });
  }
  email = email.toLowerCase();
  // Steps
  // 1.Verify email doesn't exist
  // 2.Save
  User.find({
    email: email
  })
    .then(previousUsers => {
      if (previousUsers.length > 0) {
        return res.send({
          status: false,
          message: "Error: Account already exists"
        });
      }
      // Save new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser
        .save()
        .then(user => {
          return res.send({
            success: true,
            message: "Signed Up",
            user: user
          });
        })
        .catch(err => {
          return res.end({
            success: false,
            message: `Error while saving the newUser ${err}`
          });
        });
    })
    .catch(err => console.log("Error: Can't find email", err));
});
router.post("/signin", (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;
  if (!email && !password) {
    return res.send({
      status: false,
      message: "Signin using email and password"
    });
  }
  if (!password) {
    return res.send({
      status: false,
      message: "Type in  Password"
    });
  }
  if (!email) {
    return res.send({
      status: false,
      message: "Type in  Email"
    });
  }
  email = email.toLowerCase();

  User.find({ email: email })
    .then(users => {
      // if number of users is 0, the following error pops up.
      // it would be usually either 1 or 0
      if (users.length != 1) {
        return res.send({
          status: false,
          message: "Error: Invalid"
        });
      }
      // now take out that user and
      // user since instance of User model, it will have the available methods
      // so now validating if entered password is correct or not.
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          status: false,
          message: "Error : wrong password"
        });
      }
      //Otherwise correct user
      // So we would create a new user session for this User

      var userSession = new UserSession();
      userSession.userId = user._id;
      userSession
        .save()
        .then(doc => {
          return res.send({
            success: true,
            message: "Valid Signin",
            token: doc._id
          });
        })
        .catch(err => console.log("Servor error", err));
    })
    .catch(err =>
      res.send({
        message: "Error: Email does not exist",
        status: false
      })
    );
});
router.get("/verify", (req, res, next) => {
  // get the token
  const { query } = req;
  const { token } = query;

  // verify the token is one of the kind and its not deleted

  UserSession.find({
    isDeleted: false,
    _id: token
  })
    .then(session => {
      console.log("Sessionnnn", session, session.length);
      if (session.length != 1) {
        return res.send({
          status: false,
          message: "Error: Server error"
        });
      } else {
        return res.send({
          status: true,
          message: "Valid Signin"
        });
      }
    })
    .catch(err =>
      res.send({ status: false, message: "Error while verifying the token" })
    );
});
router.get("/logout", (req, res, next) => {
  const { query } = req;
  const { token } = query;
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    {
      $set: {
        isDeleted: true
      }
    },
    null
  )
    .then(user => {
      return res.send({
        status: true,
        message: "Successfully logged out",
        updated: user
      });
    })
    .catch(err => {
      return res.send({
        status: false,
        message: "Error: is not logged out!"
      });
    });
});
module.exports = router;
