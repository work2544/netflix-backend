import express, { Application, Request, Response, NextFunction } from "express";
import auth from "basic-auth";
import jwt, { decode } from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
declare global {
  namespace Express {
    interface Request {
      username: string;
    }
  }
}

const app: Application = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
type Movie = {
  name: string;
  url: string;
};

type User = {
  username: string;
  password: string;
};
const initialUsers: User[] = [
  {
    username: "admin",
    password: "$2b$10$yKLJIkR2w0CQCTp1R3/RBuYIOUJmTH4aa2TB53tN21JRco5cy9wp2", //hashed from "1234"
  },
];

var users: User[] = [...initialUsers];

const SECRET = "mysecret";
type MyJwtPayload = {
  username: string;
} & jwt.JwtPayload;

const movies: Movie[] = [
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
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "hello from express and vercel" });
});
app.get("/me", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ name: "latthaphol laohapiboonrattana", code: "630610759" });
});
app.get("/movie/:name", (req: Request, res: Response) => {
  const Qname = String(req.params.name);
  var Amovie = movies.filter((x) => {
    return x.name === Qname;
  });
  return res.json({ status: "success", Amovie });
});
app.get("/movieList", (req: Request, res: Response) => {
  if (req.query.order == "asc") {
    movies.sort((a, b) => {
      var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  } else if (req.query.order == "desc") {
    movies.sort((a, b) => {
      var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA > nameB) return -1;
      if (nameA < nameB) return 1;
      return 0;
    });
  }
  return res.json({ status: "success", movies });
});

// app.get("/user", (req: Request, res: Response) => {
//   return res.json({ status: "success", users });
// });
// app.get("/user/:name", (req: Request, res: Response) => {
//   const Qname = String(req.params.name);
//   var user = users.filter((x) => {
//     return x.username === Qname;
//   });
//   return res.json({ status: "success", user });
// });

app.get("/user/login", async (req, res) => {
  const user = auth(req);

  if (!user)
    return res
      .status(404)
      .json({ status: "failed", message: "Invalid username or password" });
  const username = user.name;
  const password = user.pass;

  const foundUser = users.find(
    (x) => x.username === username && bcrypt.compareSync(password, x.password)
  );
  if (!foundUser)
    return res
      .status(404)
      .json({ status: "failed", message: "Invalid username or password" });
  const token = jwt.sign({ username }, SECRET, { expiresIn: "10h" });
  return res.json({ status: "success", token });
}); //ok

app.delete("/reset", (req, res) => {
  users = [initialUsers[0]];
  return res.json({ status: "success" });
}); //ok

app.post("/user/regis", async (req, res) => {
  const user = req.body;
  const username = user.username;
  const password = user.password;
  if (
    username === "" ||
    password === "" ||
    typeof username !== "string" ||
    typeof password !== "string"
  )
    return res.status(400).json({ status: "failed", message: "Invalid input" });
  if (users.find((x) => x.username === username) !== undefined) {
    return res
      .status(400)
      .json({ status: "failed", message: "Username is already used" });
  }
  user.password = bcrypt.hashSync(password, 10);
  users.push(user);
  console.log(users);
  return res.status(200).json({ status: "success", username: username });
}); //ok
const PORT = 9000;
app.listen("https://netflix-backend-gray.vercel.app", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
module.exports = app;
