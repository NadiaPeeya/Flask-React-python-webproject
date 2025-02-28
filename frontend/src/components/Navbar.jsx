import { Box, Button, Container, Flex, Text, useColorMode, useColorModeValue, Link as ChakraLink } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaFileUpload } from "react-icons/fa";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CreateUserModal from "./CreateUserModal";

const Navbar = ({ setUsers }) => {
        const { colorMode, toggleColorMode } = useColorMode();
        const location = useLocation();
        
        return (
                <Container maxW={"900px"}>
                        <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200", "gray.700")}>
                                <Flex h='16' alignItems={"center"} justifyContent={"space-between"}>
                                        {/* Left side */}
                                        <Flex
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                gap={3}
                                                display={{ base: "none", sm: "flex" }}
                                        >
                                                <img src='/react.png' alt='React logo' width={50} height={50} />
                                                <Text fontSize={"40px"}>+</Text>
                                                <img src='/python.png' alt='Python logo' width={50} height={40} />
                                                <Text fontSize={"40px"}>=</Text>

                                                <img src='/explode.png' alt='Explode head' width={45} height={45} />
                                        </Flex>
                                        {/* Right side */}
                                        <Flex gap={3} alignItems={"center"}>
                                                <Text fontSize={"lg"} fontWeight={500} display={{ base: "none", md: "block" }}>
                                                        BFFship 🔥
                                                </Text>

                                                <ChakraLink 
                                                        as={RouterLink} 
                                                        to="/" 
                                                        fontWeight={location.pathname === "/" ? "bold" : "normal"}
                                                        color={location.pathname === "/" ? "blue.500" : "inherit"}
                                                        mr={2}
                                                >
                                                        Home
                                                </ChakraLink>

                                                <ChakraLink 
                                                        as={RouterLink} 
                                                        to="/documents" 
                                                        fontWeight={location.pathname === "/documents" ? "bold" : "normal"}
                                                        color={location.pathname === "/documents" ? "blue.500" : "inherit"}
                                                        mr={2}
                                                        display="flex"
                                                        alignItems="center"
                                                >
                                                        <FaFileUpload style={{ marginRight: '5px' }} /> Documents
                                                </ChakraLink>

                                                <Button onClick={toggleColorMode}>
                                                        {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
                                                </Button>
                                                
                                                {location.pathname === "/" && <CreateUserModal setUsers={setUsers} />}
                                        </Flex>
                                </Flex>
                        </Box>
                </Container>
        );
};
export default Navbar;