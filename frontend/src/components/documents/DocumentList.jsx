import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  useToast,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FaDownload, FaTrash, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFilePowerpoint, FaFileAlt } from 'react-icons/fa';
import { BASE_URL } from '../../App';

const DocumentList = ({ documents, onDocumentDelete, isLoading }) => {
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const toast = useToast();
  const tableBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return FaFilePdf;
    if (fileType.includes('word') || fileType.includes('doc')) return FaFileWord;
    if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('xls')) return FaFileExcel;
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) return FaFileImage;
    if (fileType.includes('presentation') || fileType.includes('ppt')) return FaFilePowerpoint;
    if (fileType.includes('text')) return FaFileAlt;
    return FaFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleDownload = async (id, filename) => {
    try {
      window.open(`${BASE_URL}/documents/${id}/download`, '_blank');
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteAlert = (document) => {
    setDocumentToDelete(document);
    setIsAlertOpen(true);
  };

  const closeDeleteAlert = () => {
    setIsAlertOpen(false);
    setDocumentToDelete(null);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/documents/${documentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }

      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onDocumentDelete) {
        onDocumentDelete(documentToDelete.id);
      }
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      closeDeleteAlert();
    }
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg={tableBg}
        boxShadow="md"
        textAlign="center"
      >
        <Text fontSize="lg">No documents found. Upload your first document!</Text>
      </Box>
    );
  }

  return (
    <Box
      overflowX="auto"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg={tableBg}
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>File</Th>
            <Th>Description</Th>
            <Th>Size</Th>
            <Th>Upload Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((doc) => (
            <Tr key={doc.id} _hover={{ bg: hoverBg }}>
              <Td>
                <Flex align="center">
                  <Icon as={getFileIcon(doc.fileType)} boxSize={5} mr={2} color="blue.500" />
                  <Text fontWeight="medium" isTruncated maxW="200px">
                    {doc.originalFilename}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Text isTruncated maxW="200px">
                  {doc.description || '-'}
                </Text>
              </Td>
              <Td>
                <Badge colorScheme="blue">{formatFileSize(doc.fileSize)}</Badge>
              </Td>
              <Td>{new Date(doc.uploadDate).toLocaleString()}</Td>
              <Td>
                <Flex>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    leftIcon={<FaDownload />}
                    onClick={() => handleDownload(doc.id, doc.originalFilename)}
                    mr={2}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<FaTrash />}
                    onClick={() => openDeleteAlert(doc)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog isOpen={isAlertOpen} onClose={closeDeleteAlert} leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Document
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{documentToDelete?.originalFilename}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={closeDeleteAlert}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DocumentList;