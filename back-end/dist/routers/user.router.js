"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config/config"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = __importDefault(require("lodash"));
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const geocoder_1 = require("../helpers/geocoder");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mg = mailgun_js_1.default({ apiKey: config_1.default.apiKey, domain: config_1.default.DOMAIN });
const storage = multer_1.default.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".png");
    },
});
const fileFilter = function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer_1.default({
    storage: storage,
    fileFilter: fileFilter,
});
const type = upload.single("avatar");
const router = express_1.Router();
router.post("/singup", async (req, res, next) => {
    try {
        const { email, password, phone, name, address, confirmPassword, location } = await req.body;
        const { error } = user_model_1.validateUser(req.body);
        if (error)
            return res.status(404).send(error.details[0].message);
        let user = await user_model_1.User.findOne({ email: email });
        if (user)
            return res.status(400).send({
                error_en: "that user already  registered",
                error_ar: "هذا المستخدم مسجل بالفعل",
            });
        let nameUser = await user_model_1.User.findOne({ name: name });
        if (nameUser)
            return res.status(400).send({
                error_en: "that name already exist",
                error_ar: "هذا الاسم موجود بالفعل",
            });
        const vildeLowercase = /(?=.*?[a-z])/;
        const vildeCaptalercase = /(?=.*?[A-Z])/;
        if (!vildeCaptalercase.test(password))
            return res.status(400).send({
                error_en: "It must contain at least 1 uppercase alphabetic character",
                error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
            });
        if (!vildeLowercase.test(password))
            return res.status(400).send({
                error_en: "It must contain at least one lowercase alphabet",
                error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
            });
        if (password !== confirmPassword)
            return res.status(400).send({
                error_en: "Password does not match",
                error_ar: " كلمة السر غير متطابقة",
            });
        let loc = await geocoder_1.geocoder.geocode(address);
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashPassword = await bcryptjs_1.default.hash(password, salt);
        const hashConfriPassword = await bcryptjs_1.default.hash(confirmPassword, salt);
        const users = new user_model_1.User({
            email: email,
            password: hashPassword,
            phone: phone,
            name: name,
            confirmPassword: hashConfriPassword,
            address: address,
            location: {
                coordinates: [loc[0].longitude, loc[0].latitude],
                formattedAddress: loc[0].formattedAddress,
                street: loc[0].streetName,
                city: loc[0].city,
                state: loc[0].stateCode,
                zipcode: loc[0].zipcode,
                country: loc[0].countryCode,
            }
        });
        const token = jsonwebtoken_1.default.sign({ email: email }, config_1.default.secretToken, {});
        return users.save((err) => {
            if (err) {
                res.status(400).send({
                    error_en: "please enter vaild data",
                    error_ar: "الرجاء إدخال بيانات صحيحة",
                    error: err,
                });
            }
            else {
                const data = {
                    from: "abdelrahmansamysamy9@gmail.com",
                    to: email,
                    subject: "Accont Actvition Link",
                    html: `
                      <h2>please click on given link to activate your account</h2>
                      <a>http://localhost:4000/user/activate-email/${token}</a>
      
              `,
                };
                mg.messages().send(data, (err, body) => {
                    if (err) {
                        res.send({ error: err.message });
                    }
                    else {
                        res.status(200).send({
                            message_ar: "تم إرسال البريد الإلكتروني ، يرجى تفعيل حسابك ، والتحقق من صندوق بريدك الإلكتروني",
                            message_en: "Email has been sent , kindly activate your account , chack your email inbox",
                            user: users,
                            success: true
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        next(err);
    }
});
router.get("/admin/user/:id", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res, next) => {
    const user = await user_model_1.User.find({ name: req.params.id }).select("-password");
    return res.status(200).send(user);
});
router.put("/admin/changeInf/:id", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res, next) => {
    const { error } = user_model_1.validateUserUpdate(req.body);
    if (error)
        return res.status(404).send(error.details[0].message);
    const { phone, name, blocked } = req.body;
    const user = await user_model_1.User.updateOne({
        name: req.params.id,
    }, {
        $set: {
            name: name,
            phone: phone,
            blocked: blocked,
        },
    });
    res.status(200).send(user);
    return;
});
router.put("/me/complate", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    const { error } = user_model_1.validateUserUpdate(req.body);
    if (error)
        return res.status(404).send(error.details[0].message);
    const { age, gender, address } = req.body;
    const user = await user_model_1.User.updateOne({
        _id: res.locals.user._id,
    }, {
        $set: {
            age: age,
            gender: gender,
            address: address
        },
    });
    if (!user)
        return res.status(400).send({
            error_en: "the user is not exited",
            error_ar: " المستخدم غير موجد  ",
        });
    const me = await user_model_1.User.find({ _id: res.locals.user._id });
    res.status(200).send({ user: me[0], success: true });
    return;
});
router.put("/me/update", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    const { error } = user_model_1.validateUserUpdate(req.body);
    if (error)
        return res.status(404).send(error.details[0].message);
    const { phone, name, password, age, gender } = req.body;
    const validPassword = await bcryptjs_1.default.compare(password, res.locals.user.password);
    if (!validPassword)
        return res.status(400).send({
            error_en: "invalid password",
            error_ar: "كلمة السر خاطئة",
        });
    let validName = await user_model_1.User.find({
        name: name,
        _id: { $ne: res.locals.user._id }
    });
    if (!validName)
        return res.status(400).send({
            error_en: "alredy name is exited",
            error_ar: "الاسم موجد بي الفعل",
        });
    console.log(gender);
    const user = await user_model_1.User.updateOne({
        _id: res.locals.user._id,
    }, {
        $set: {
            name: name,
            phone: phone,
            age: age,
            gender: gender
        },
    });
    if (!user)
        return res.status(400).send({
            error_en: "the user is not exited",
            error_ar: " المستخدم غير موجد  ",
        });
    res.status(200).send(user);
    return;
});
router.put("/me/avatar", [auth_1.AuthenticationMiddleware, type], async (req, res, next) => {
    const avatar = await user_model_1.User.findById({ _id: res.locals.user._id });
    if (!avatar)
        return res
            .status(404)
            .send("The User Can't Found with the img Can You trying again");
    avatar.set({
        avatar: req.file.path,
    });
    res.status(200).send({ avatar: avatar });
    return avatar.save();
});
router.put("/me/changEmail/", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    const { error } = user_model_1.validateUserEmail(req.body);
    if (error)
        return res.status(404).send(error.details[0].message);
    const { password, email } = req.body;
    let validEmail = await user_model_1.User.findOne({ email: email });
    if (validEmail)
        return res.status(400).send({
            error_en: "already the email is existed",
            error_ar: "الاميل موجد بي  الفعل",
        });
    const validPassword = await bcryptjs_1.default.compare(password, res.locals.user.password);
    if (!validPassword)
        return res.status(400).send({
            error_en: "invalid password",
            error_ar: "كلمة السر خاطئة",
        });
    const user = await user_model_1.User.updateOne({
        _id: res.locals.user._id,
    }, {
        $set: {
            email: email,
            verify: false,
            resetLink: "",
        },
    });
    return res.status(200).send({
        message_en: " Your email has been changed ",
        message_ar: "تم تغيير الاميل الخاص بك ",
    });
});
router.get("/me", auth_1.AuthenticationMiddleware, async (req, res, next) => {
    try {
        const user = await user_model_1.User.find({ _id: res.locals.user._id }).select('-password -confirmPassword');
        if (!user)
            return res.status(400).send({
                error_en: " the user is not found ",
                error_ar: "المستخدم غير موجد",
            });
        res.send({ user: user });
    }
    catch (err) {
        return next(err);
    }
});
router.get("/users", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res) => {
    const users = await user_model_1.User.find({ isAdmin: false });
    res.send(users);
});
router.get("/users/notAccept", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res) => {
    const users = await user_model_1.User.find({ isAdmin: false, activateBouqute: false });
    res.send(users);
});
router.get("/users/accept", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res) => {
    const users = await user_model_1.User.find({ isAdmin: false, activateBouqute: true });
    res.send(users);
});
router.get("/users/accept/:id", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res) => {
    const users = await user_model_1.User.findById(req.params.id);
    res.send(users);
});
router.get("/admin/user/:id", [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware], async (req, res) => {
    const user = await user_model_1.User.find({ _id: req.params.id });
    res.send(user[0]);
});
router.put("/forget-password/", async (req, res) => {
    let token;
    const { email } = req.body;
    const validEmail = await user_model_1.User.find({ email: email });
    if (validEmail[0] === ([] && undefined)) {
        return res.status(400).send({
            error_en: "User with this email does not exists.",
            error_ar: "المستخدم بهذا البريد الإلكتروني غير موجود.",
        });
    }
    if (validEmail[0] != ([] && undefined)) {
        token = jsonwebtoken_1.default.sign({ _id: validEmail[0]._id }, config_1.default.secretPassword, {
            expiresIn: "30m",
        });
        await user_model_1.User.update({ email: validEmail[0].email }, {
            $set: { resetLink: token }
        });
        const data = {
            from: "abdelrahmansamysamy9@gmail.com",
            to: email,
            subject: "Accont Forget Password Link",
            html: `
              <h2>please click on given link to reset your password</h2>
              <a href="http:localhost:4200/auth/rest-password/${token}">Activate your Email</a>
  
      `,
        };
        mg.messages().send(data, async (err, body) => {
            if (err) {
                console.log(err);
                res.send({ error: err.message });
            }
        });
    }
    return res.status(200).send({
        message_en: "Email has been sent , kindly  follow the instruction , chack your inbox  ",
        message_ar: "تم إرسال البريد الإلكتروني ، يرجى اتباع التعليمات ، والتحقق من صندوق الوارد الخاص بك ",
    });
});
router.put("/reset-password/:resetLink", async (req, res) => {
    const { resetLink } = req.params;
    const { newPass } = req.body;
    const vildeLowercase = /(?=.*?[a-z])/;
    const vildeCaptalercase = /(?=.*?[A-Z])/;
    if (!vildeCaptalercase.test(newPass))
        return res.status(400).send({
            error_en: "It must contain at least 1 uppercase alphabetic character",
            error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
        });
    if (!vildeLowercase.test(newPass))
        return res.status(400).send({
            error_en: "It must contain at least one lowercase alphabet",
            error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
        });
    const validTocken = jsonwebtoken_1.default.verify(resetLink, config_1.default.secretPassword, (err, dec) => {
        if (err)
            return res.status(401).send({
                error_en: "incorrect token or it is expierd.",
                error_ar: "رابط غير صحيح أو انتهت صلاحيته.",
            });
        return dec;
    });
    if (!newPass)
        return res.status(400).send({ error_en: 'pleass enter new  password!! ' });
    if (!resetLink && !validTocken)
        return res.status(401).send({
            error_en: "incorrect token or it is expierd.",
            error_ar: "رابط غير صحيح أو انتهت صلاحيته.",
        });
    const resetLinkV = await user_model_1.User.find({ _id: validTocken._id });
    if (!resetLinkV)
        res.status(400).send({
            error_en: "This Link Is Invalid",
            error_ar: "هذا الرابط غير صالح",
        });
    const validPassword = await bcryptjs_1.default.compare(newPass, resetLinkV[0].password);
    console.log(resetLinkV[0].password);
    console.log(validPassword);
    if (validPassword)
        return res.status(400).send({
            error_en: "please change your password do not change your password like your old password.",
            error_ar: "الرجاء تغيير كلمة المرور الخاصة بك لا تغير كلمة المرور الخاصة بك مثل كلمة المرور القديمة.",
        });
    const salt = await bcryptjs_1.default.genSalt(10);
    console.log(newPass);
    const hashNewPass = await bcryptjs_1.default.hash(newPass, salt);
    const update = await user_model_1.User.updateOne({ resetLink: resetLink }, {
        $set: {
            password: hashNewPass,
            confirmPassword: hashNewPass,
        },
    });
    console.log(update);
    const data = {
        from: "lenamarwan575@gmail.com",
        to: resetLinkV[0].email,
        subject: "Accont change password",
        html: `
   <h2>Your password has been changed , You know it ?</h2> `,
    };
    mg.messages().send(data, async (err, body) => {
        if (err) {
            res.send({ error: err.message });
        }
    });
    return res.status(200).send({
        message_en: " Your password has been changed ",
        message_ar: " تم تغيير كلمة السر الخاصة بك ",
    });
});
router.put("/me/change-password", auth_1.AuthenticationMiddleware, async (req, res) => {
    try {
        const { password, newPass } = req.body;
        const { error } = user_model_1.validateUserPassword(req.body);
        if (error)
            return res.status(404).send(error.details[0].message);
        const vildeLowercase = /(?=.*?[a-z])/;
        const vildeCaptalercase = /(?=.*?[A-Z])/;
        if (!vildeCaptalercase.test(newPass))
            return res.status(400).send({
                error_en: "It must contain at least 1 uppercase alphabetic character",
                error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
            });
        if (!vildeLowercase.test(newPass))
            return res.status(400).send({
                error_en: "It must contain at least one lowercase alphabet",
                error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
            });
        const validOldPassword = await bcryptjs_1.default.compare(password, res.locals.user.password);
        const validNewPassword = await bcryptjs_1.default.compare(newPass, res.locals.user.password);
        if (!validOldPassword)
            return res.status(400).send({
                error_en: `The old password is wrong. Try again and verify that the old password is correct`,
                error_ar: `كلمة المرور القديمة خاطئة. حاول مرة أخرى وتحقق من صحة كلمة المرور القديمة`,
            });
        if (validNewPassword)
            return res.status(400).send({
                error_en: "please change your password do not change your password like your old password.",
                error_ar: "الرجاء تغيير كلمة المرور الخاصة بك لا تغير كلمة المرور الخاصة بك مثل كلمة المرور القديمة.",
            });
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashNewPass = await bcryptjs_1.default.hash(newPass, salt);
        const hashNewConfirmPassword = await bcryptjs_1.default.hash(newPass, salt);
        await user_model_1.User.updateOne({ _id: res.locals.user._id }, {
            $set: {
                password: hashNewPass,
                confirmPassword: hashNewConfirmPassword,
            },
        });
        return res.status(200).send({
            message_en: " Your password has been changed ",
            message_ar: "تم تغيير كلمة السر الخاصة بك ",
        });
    }
    catch (err) {
        throw err;
    }
});
router.post("/resendMessage", auth_1.AuthenticationMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const { error } = user_model_1.validateUserEmail(req.body);
        if (error)
            return res.status(404).send(error.details[0].message);
        const user = await user_model_1.User.findOne({ email: email });
        if (!user)
            return res.status(400).send({
                error_en: `That email INVALID`,
                error_ar: `هذا البريد الإلكتروني غير صالح`,
            });
        const token = jsonwebtoken_1.default.sign({ email: email, _id: user._id }, config_1.default.secretToken, {
            expiresIn: "20m",
        });
        if (token) {
            const data = {
                from: "abdelrahmansamysamy9@gmail.com",
                to: email,
                subject: "Accont Actvition Link",
                html: `
                      <h2>please click on given link to activate you account</h2>
                      <a>http://localhost:4000/user/activate-email/${token}</a>
      
              `,
            };
            mg.messages().send(data, (err, body) => {
                if (err) {
                    res.send({ error: err.message });
                }
                else {
                    res.send({
                        message_en: "The link was resubmitted, the link will be invalid 20 minutes from now",
                        message_ar: "تم إعادة إرسال الرابط ، سيكون الرابط غير صالح بعد 20 دقيقة من الآن",
                    });
                }
            });
        }
        else {
            res.status(400).send({
                error_en: "something is rwong!!!",
                error_ar: "هناك شئ غير صحيح !!!",
            });
        }
        return;
    }
    catch (err) {
        return res
            .status(400)
            .send({ message_en: "invlid TOKEN", message_ar: "رمز غير صالح" });
    }
});
router.get("/activate/:token", async (req, res) => {
    const { token } = req.params;
    if (token) {
        console.log(token);
        jsonwebtoken_1.default.verify(token, config_1.default.secretToken, function (err, decoded) {
            if (err) {
                res.status(404).send({ error: err.message });
            }
            return user_model_1.User.findOne({ email: decoded.email }, (err, user) => {
                if (err || !user) {
                    return res.status(400).send({
                        error_en: "User with this email does not exists.",
                        error_ar: "المستخدم بهذا البريد الإلكتروني غير موجود.",
                    });
                }
                const obj = {
                    verify: true,
                };
                user = lodash_1.default.extend(user, obj);
                return user.save((err, resullt) => {
                    if (err) {
                        return res.status(400).send({
                            error_en: "Link activate the email by mistake ",
                            error_ar: "لينك تفعيل الايميل خطا",
                        });
                    }
                    else {
                        return res.status(200).send({
                            message_en: " Your Email has been Activated ",
                            message_ar: " تم تفعيل بريدك الإلكتروني",
                        });
                    }
                });
            });
        });
    }
    else {
        return res.send({ error: "something went wrong!!!" });
    }
    return;
});
router.post("/feedback", async (req, res) => {
    const { email, subject, des, name } = req.body;
    const data = {
        from: "lenamarwan575@gmail.com",
        to: email,
        subject: subject,
        html: `        
     <h1>subject:${subject}</h1>
     <h2>name:${name}</h2>
   <h3>Description:${des}</h3>`,
    };
    mg.messages().send(data, async (err, body) => {
        if (err) {
            res.send({ error: err.message });
        }
    });
    return res.send({
        message_en: "Your message has been sent thanks",
        message_ar: "تم إرسال رسالتك شكرا",
    });
});
exports.default = router;
//# sourceMappingURL=user.router.js.map