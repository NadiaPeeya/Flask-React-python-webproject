import { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
  Box,
  Heading,
  Divider
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import DocumentUploadForm from '../components/documents/DocumentUploadForm';
import DocumentList from '../components/documents/DocumentList';
import { BASE_URL } from '../App';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/documents`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSuccess = (newDocument) => {
    setDocuments(prevDocuments => [newDocument, ...prevDocuments]);
  };

  const handleDocumentDelete = (deletedId) => {
    setDocuments(prevDocuments => 
      prevDocuments.filter(doc => doc.id !== deletedId)
    );
  };

  return (
    <Stack minH="100vh" bg={bgColor}>
      <Navbar />
      
      <Container maxW="1200px" py={8}>
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="xl" color={headingColor}>
            Document Management
          </Heading>
          <Text mt={2} fontSize="lg">
            Upload, manage, and download your important documents
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={8}>
          <GridItem>
            <DocumentUploadForm onUploadSuccess={handleUploadSuccess} />
          </GridItem>
          
          <GridItem>
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>
                Your Documents
              </Heading>
              <Divider mb={4} />
              <DocumentList 
                documents={documents} 
                onDocumentDelete={handleDocumentDelete}
                isLoading={isLoading}
              />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Stack>
  );
};

export default DocumentsPage;