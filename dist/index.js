"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
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
const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
module.exports = app;