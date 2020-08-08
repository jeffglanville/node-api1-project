const express = require("express")

const db = require("./database")

const server = express()

server.use(express.json())

server.get("/", (req,res) => {
    res.json({ message: "Hello, World"})
})

server.get("/users", (req, res) => {
    const users = db.getUsers()
        if (!users) {
            res.status(500).json({
                errorMessage: "The users information could not be retrieved"
            })
        }else{
            res.json(users)
        }
})

server.get("/users/:id", (req, res) => {
    const id = req.params.id

    const user = db.getUserById(id)

    if(user) {
        res.json(user)
    }else {
        res.status(404).json({ message: "User not found, please try the search again"})
    }
})

server.post("/users", (req, res) => {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
    })
        if(!req.body.name || !req.body.bio){
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user."
            })
        } else{
        res.status(201).json(newUser)
        }

        if(!newUser) {
            res.status(500).json({
                errorMessage: "There was an error while saving the user to the database"
            })
        }else {
            res.status(200).json({
                message: "Congrats, you saved the user!!"
            })
        }
})

server.delete("/users/:id", (req,res) => {
    const user = db.getUserById(req.params.id)

    if(user) {
        db.deleteUser(user.id)
        res.status(204).end
    }else {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }
    if (!req.params.id) {
        res.status(500).json({
            errorMessage: "The user could not be removed."
        })
    }
})

server.put("/users/:id", (req,res) => {
    const editedUser = db.getUserById(req.params.id)
    if(!editedUser) {
        res.status(404).json({
            errorMessage: "The user with the specified ID does not exit."
        })
    }else if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            errorMessage: "Please provide a name and bio for the user"
        })
    }else {
        const newInfoUser = db.updateUser(editedUser.id, {
            name: req.body.name,
            bio: req.body.bio
        })
        res.json(newInfoUser)
    }
})


server.listen(5000, () => {
    console.log("Server is listening on port 5000")
})