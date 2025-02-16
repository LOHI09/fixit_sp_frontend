import {
  Card,
  Center,
  Icon,
  Text,
  Heading,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
} from "@chakra-ui/react";

import { AxiosError } from "axios";

import {jwtDecode} from "jwt-decode"

import { MdHandyman } from "react-icons/md";
import { PasswordField } from "./PasswordField";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/LoginApi";

import { BaseSyntheticEvent } from "react";

import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
const [isLoading , setIsLoading] = useState(false)

const toast = useToast()
const navigate = useNavigate()

const mutation = useMutation({
  mutationFn: loginUser,
  onSuccess: (data: {access_token: string, token_type: string}) => {
    localStorage.setItem('token', data.access_token)
    const decoded = jwtDecode(data.access_token)
    localStorage.setItem('sp_username', decoded["username"])
    navigate('/profile')
    setIsLoading(false)
  },
  onError: (res: AxiosError) => {
    toast({
      position: "top",
      title: res.response?.data ? `Error: ${Object.entries(res.response?.data)[0][1]}` : `Error: ${res.message}`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    setIsLoading(false)
  }
})

const handleSubmit = (e: BaseSyntheticEvent) => {
  e.preventDefault()
  setIsLoading(true)
  const username = e.target.form[0].value
  const password = e.target.form[2].value
  mutation.mutate({username, password})
}

return (
  <Card maxW="md" p = {8} bg = "white" boxShadow="lg">
    <Stack spacing = {4}>
      <Center>
        <Icon as={MdHandyman} h = "32px" w = "32px"/>
        <Heading pl = "12px" fontSize = "28px" onClick = {() => navigate('/')} cursor = "pointer">Fixit - Service Providers</Heading>
      </Center>
      <Heading>Login to your account</Heading>
      <Divider orientation='horizontal' borderColor = "black"/>
      <form>
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="Enter your username"
              required
              border = "2px solid"
              borderColor = "primary.100"
            />
          </FormControl>
          <PasswordField
            placeholder="Enter your password"
            border = "2px solid"
            borderColor = "primary.100"
          />
          <Text
            textAlign = "center">
              {`Don't have an account? `}
              <Link
                as = {NavLink}
                to = "/signup"
                color = "primary.400"
                textDecoration = "underline">
                  Sign Up
              </Link>
          </Text>
          <Button
            bg = "primary.400"
            color= "white"
            _hover={{bg: "primary.500"}}
            type = "submit"
            onClick={(e) => handleSubmit(e)}
            isLoading = {isLoading}
            >Login
          </Button>
        </Stack>
      </form>
    </Stack>
  </Card>
)
}