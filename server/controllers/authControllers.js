import User from "../models/User.js";
import b1 from 'bcryptjs'
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email: email});
        if (! user)
            return res.status(404).send({ message: "User not found" })
        else{
            const check = await b1.compare(password,user.password);
            if(check)
                return res.status(200).send({ message: "Login Sucefssful" })
            else
                return res.status(400).send({ message: " Wrong Password !! Login not Sucefssful" })
        }
    }
    catch (err) {
        console.log("Error", err);
        return res.status(500).send({ message: "error", err })
    }

}

export async function signup(req, res) {
    const { name, email, password, role } = req.body;  //By default role is user
    try {
        const user = await User.findOne({email: email});
        if (user)
            return res.status(400).send({ message: "User already exist" })

        const h_password = await b1.hash(password,10)
        
        await User.create({
            name, email, password:h_password, role
        })
        return res.send({ message: "Sucessful" })
    }
    catch (err) {
        console.log("Error", err);
        return res.status(500).send({ message: "error", err })
    }

}