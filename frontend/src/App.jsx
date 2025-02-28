import { Container, Stack, Text } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import UserGrid from "./components/UserGrid";
import { useState, useEffect } from "react";

// Updated URL to use the port from runtime information
export const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:50420/api" 
  : "/api";

function App() {
        const [users, setUsers] = useState([]);

        useEffect(() => {
                // Fetch users when component mounts
                fetch(`${BASE_URL}/friends`)
                        .then(response => response.json())
                        .then(data => setUsers(data))
                        .catch(error => console.error("Error fetching friends:", error));
        }, []);

        return (
                <Stack minH={"100vh"}>
                        <Navbar setUsers={setUsers} />

                        <Container maxW={"1200px"} my={4}>
                                <Text
                                        fontSize={{ base: "3xl", md: "50" }}
                                        fontWeight={"bold"}
                                        letterSpacing={"2px"}
                                        textTransform={"uppercase"}
                                        textAlign={"center"}
                                        mb={8}
                                >
                                        <Text as={"span"} bgGradient={"linear(to-r, cyan.400, blue.500)"} bgClip={"text"}>
                                                My Besties
                                        </Text>
                                        🚀
                                </Text>

                                <UserGrid users={users} setUsers={setUsers} />
                        </Container>
                </Stack>
        );
}

export default App;