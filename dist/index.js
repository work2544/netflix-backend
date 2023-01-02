"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const basic_auth_1 = __importDefault(require("basic-auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
const initialUsers = [
    {
        username: "admin",
        password: "$2b$10$yKLJIkR2w0CQCTp1R3/RBuYIOUJmTH4aa2TB53tN21JRco5cy9wp2", //hashed from "1234"
    },
];
var users = [...initialUsers];
const SECRET = "mysecret";
const movies = [
    {
        name: "sevensin",
        url: "https://www.youtube.com/watch?v=sv39RAWrd98",
    },
    {
        name: "alchemy",
        url: "https://www.youtube.com/watch?v=5Q0GvDGJolg",
    },
    {
        name: "alice",
        url: "https://www.youtube.com/watch?v=hQY0Bb9y37g",
    },
    {
        name: "bloodorigin",
        url: "https://www.youtube.com/watch?v=h5utcX_gDRw",
    },
    {
        name: "emily",
        url: "https://www.youtube.com/watch?v=YQ_49odKcvk",
    },
    {
        name: "glassonion",
        url: "https://www.youtube.com/watch?v=wlqkRZJJ9zE",
    },
    {
        name: "love101",
        url: "https://www.youtube.com/watch?v=QihpuY4qx1g",
    },
    {
        name: "mage0",
        url: "https://www.youtube.com/watch?v=UC6EXdxc1Io",
    },
    {
        name: "matilda",
        url: "https://www.youtube.com/watch?v=Is-8K1ImkHo",
    },
];
app.get("/", (req, res) => {
    return res.status(200).json({ message: "hello from express and vercel" });
});
app.get("/me", (req, res) => {
    return res
        .status(200)
        .json({ name: "latthaphol laohapiboonrattana", code: "630610759" });
});
app.get("/movie/:name", (req, res) => {
    const Qname = String(req.params.name);
    var Amovie = movies.filter((x) => {
        return x.name === Qname;
    });
    return res.json({ status: "success", Amovie });
});
app.get("/movieList", (req, res) => {
    if (req.query.order == "asc") {
        movies.sort((a, b) => {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });
    }
    else if (req.query.order == "desc") {
        movies.sort((a, b) => {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA > nameB)
                return -1;
            if (nameA < nameB)
                return 1;
            return 0;
        });
    }
    return res.json({ status: "success", movies });
});
app.get("/user", (req, res) => {
    return res.json({ status: "success", users });
});
app.get("/user/:name", (req, res) => {
    const Qname = String(req.params.name);
    var user = users.filter((x) => {
        return x.username === Qname;
    });
    return res.json({ status: "success", user });
});
app.get("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, basic_auth_1.default)(req);
    try {
        if (!user)
            return res
                .status(404)
                .json({ status: "failed", message: "Invalid username or password" });
        const username = user.name;
        const password = user.pass;
        const foundUser = users.find((x) => x.username === username && bcrypt_1.default.compareSync(password, x.password));
        if (!foundUser)
            return res
                .status(404)
                .json({ status: "failed", message: "Invalid username or password" });
        const token = jsonwebtoken_1.default.sign({ username }, SECRET, { expiresIn: "10h" });
        return res.json({ status: "success", token });
    }
    catch (error) {
        console.log(error);
    }
})); //ok
app.delete("/reset", (req, res) => {
    users = [initialUsers[0]];
    return res.json({ status: "success" });
}); //ok
app.post("/user/regis", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const username = user.username;
    const password = user.password;
    try {
        if (username === "" ||
            password === "" ||
            typeof username !== "string" ||
            typeof password !== "string")
            return res.status(400).json({ status: "failed", message: "Invalid input" });
        if (users.find((x) => x.username === username) !== undefined) {
            return res
                .status(400)
                .json({ status: "failed", message: "Username is already used" });
        }
        user.password = bcrypt_1.default.hashSync(password, 10);
        users.push(user);
        console.log(users);
        return res.status(200).json({ status: "success", username: username });
    }
    catch (error) {
        console.log(error);
    }
})); //ok
const PORT = 9000;
app.listen("https://netflix-backend-gray.vercel.app", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
module.exports = app;
