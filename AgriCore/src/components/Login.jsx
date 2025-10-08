import React from 'react'
import {Box, Button, Container, Stack, TextField, Typography,FormLabel} from "@mui/material";
import {useState} from "react";
import {green} from "@mui/material/colors";


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState(null)

    // function hitLogin(){
    //     fetch("",[POST])
    //         .then(response=>response.json())
    //         .then(data=>console.log(data))
    // }
    const handleSubmit=(e)=>{
        e.preventDefault()
        // hitLogin();
        console.log(username,password);
    }
    return (
        <div>
            <Container maxWidth='sm' sx={{display:'flex',justifyContent:'space-between' ,border:1, borderRadius:3.5, mb:5,bgcolor:"#4caf50"}}>
                <Stack spacing={3} sx={{mb:3}}>
                    <Typography variant="h3"> Login </Typography>
                    <Box component="form" sx={{display:"flex",flexDirection:'column',gap:5,border:1,borderRadius:3.5,p:2}} >
                        <FormLabel sx={{pl:0, mb:0}}>username</FormLabel>
                        <TextField name="username" variant="filled" label="username" type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}}>username</TextField>
                        <TextField variant="filled" label='password' type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}>password</TextField>
                        <Button sx={{border:1}} type="submit" onClick={handleSubmit}>Submit</Button>


                    </Box>


                </Stack>
            </Container></div>
    )
}

export default Login
