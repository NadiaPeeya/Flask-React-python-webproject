// import { useState } from 'react'
// import './App.css'
import {  Container, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import Navbar from './components/Navbar'

function App() {
  // const [count, setCount] = useState(0)
  const bgColor = useColorModeValue("gray.200", "gray.800");

  return (
    <> 
    <Stack minH={"100vh"}  bg={bgColor}>
        <Navbar/>
          <Container maxW={"1200px"} my={4}>
            <Text
            fontWeight={"bold"}
            letterSpacing={"2px"}
            textAlign={"uppercase"}
            mb={8}
            >
            <Text as={"span"}>
              My Besties
            </Text>
            🔦
            </Text>
          </Container>
    </Stack>
    </>
  )
}

export default App
