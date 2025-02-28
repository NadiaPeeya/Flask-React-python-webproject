import { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Text,
  Progress,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaUpload, FaFile } from 'react-icons/fa';
import { BASE_URL } from '../../App';

const DocumentUploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await fetch(`${BASE_URL}/documents`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      const data = await response.json();
      
      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      bg="white"
      _dark={{ bg: 'gray.700' }}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Upload New Document
          </Text>

          <FormControl isRequired>
            <FormLabel>Select File</FormLabel>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              p={1}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls,.ppt,.pptx"
              disabled={isUploading}
            />
          </FormControl>

          {file && (
            <Flex align="center" p={2} bg="gray.100" _dark={{ bg: 'gray.600' }} borderRadius="md">
              <Icon as={FaFile} mr={2} />
              <Text fontSize="sm" isTruncated>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Text>
            </Flex>
          )}

          <FormControl>
            <FormLabel>Description (optional)</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this document"
              disabled={isUploading}
            />
          </FormControl>

          {isUploading && (
            <Box>
              <Text mb={1} fontSize="sm">Uploading: {Math.round(uploadProgress)}%</Text>
              <Progress value={uploadProgress} size="sm" colorScheme="blue" borderRadius="md" />
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isUploading}
            loadingText="Uploading..."
            leftIcon={<FaUpload />}
          >
            Upload Document
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default DocumentUploadForm;