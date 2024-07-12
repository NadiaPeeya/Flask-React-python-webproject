import { Box,  Button, Container, Flex, Img, Text, useColorMode, useColorModeValue} from '@chakra-ui/react'
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.400", "gray.700");
  return (
     
    <Container maxW={"900px"}>
      <Box
        px={5}
        my={5}
        borderRadius={5}
        bg={bgColor}
      >
        <Flex h="16"
          alignItems={"center"}
          justify={"space-between"}
        >  
        <Flex
         alignItems={"center"}
         gap={3}
        >
          <Img src='/react.png' alt='React logo' width={50} height={50}/>
            <Text fontSize={"40px"}>+</Text>
          <Img src='/python.png' alt='Python logo' width={50} height={20}/>
          <Text fontSize={"40px"}>=</Text>
          <Img src='/explode.png' alt='Explode head' width={45} height={45}/>
       </Flex>
       <Flex gap={3} alignItems={"center"}>
       <Text fontSize={"lg"} fontWeight={500} display={{base: "none", md: "block"}}>
        BFFship
       </Text>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <IoMoon/> : <LuSun size={20}/>}
        </Button>
       </Flex>
        </Flex>
       
      </Box>
    </Container>
  )
}

export default Navbar
